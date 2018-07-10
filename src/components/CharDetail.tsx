import * as React from 'react';

import Script from '../assets/js/Script';
import IBonus from '../interfaces/IBonus';
import IChar from '../interfaces/IChar';
import ICharacterStatus from '../interfaces/ICharacterStatus';
import IItem from '../interfaces/IItem';
import IMix from '../interfaces/IMix';
import IStatusInput from '../interfaces/IStatusInput';
import IStatusResult from '../interfaces/IStatusResult';
import CharSelect from './CharSelect';
import Quests from './Quests';
import Result from './Result';
import SetItem from './SetItem';
import ShitftEquip from './ShitftEquip';
import Skills from './Skills';
import Status from './Status';
import Title from './Title';

interface ICharDetail {
    onCharChanged?: (char: IChar | undefined) => void
}
const radioTitles = ['Duas mãos', 'Escudo', 'Orbital'];
const radios = {
    indexChecked: 0,
    lastIndex: radioTitles.length - 1,
    name: 'Status',
    titles: radioTitles,
}

class CharDetail extends React.Component<ICharDetail>{

    public state: { hasChar: boolean }
    private char: IChar | undefined;
    private bonus: { itens: IBonus[], quests: IBonus[], mixes: Array<{ item: string, mix: IMix }> };
    private inputs: IStatusInput[];
    private detail: { status: Status | null, skills: Skills | null, quests: Quests | null, result: Result | null }
    private sets: { kit: SetItem | null, pri: SetItem | null, set: SetItem | null }

    constructor(props: ICharDetail) {
        super(props);
        this.bonus = { itens: [], quests: [], mixes: [] };
        this.inputs = [];
        this.detail = { status: null, skills: null, quests: null, result: null }
        this.sets = { kit: null, pri: null, set: null }
        this.state = { hasChar: false };
    }

    public setChar(newChar: IChar | undefined) {
        
        this.char = newChar;
        if (!this.state.hasChar) {
            this.setState({ hasChar: true });
            return;
        }
        this.updateChar();
    }

    public render() {
        const chars: IChar[] = Script.getChars();
        const details = () => {
            if (this.char === undefined){
                return null;
            }
            return <div>
                <Status
                    ref={ref => this.detail.status = ref}
                    onStatusChanged={this.onStatusChanged} />
                <Skills
                    ref={ref => this.detail.skills = ref}
                    onSkillChanged={this.onSkillChanged} />
                <Quests
                    ref={ref => this.detail.quests = ref}
                    onQuestsChanged={this.onQuestChanged} />
            </div>
        }
        return (
            <div className="row" style={{ margin: 0 }}>
                <div className="block col-lg-2">
                    <Title title="Personagens" />
                    <CharSelect
                        title={"Selecione um personagem:"}
                        name={"Personagens"}
                        chars={chars} 
                        onCharSelect={this.onCharSelect}/>
                    { details() }
                </div>
                <div className="block col-lg-6">
                    <Title title="Equipamentos" />
                    <SetItem 
                        ref={ref => this.sets.kit = ref}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                    <SetItem 
                        ref={ref => this.sets.set = ref}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                    <ShitftEquip
                        name={radios.name}
                        titles={radios.titles}
                        default={radios.indexChecked}
                        onSelectedCallback={this.onSelectEquip} />
                    <SetItem 
                        ref={ref => this.sets.pri = ref}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} 
                        onInputValues={this.addInputValues} />
                </div>
                <div className="col-lg-2">
                    <Title title="Resultados" />
                    <Result ref={ref => this.detail.result = ref} />
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.updateChar();
    }

    public componentDidUpdate() {
        this.updateChar();
    }

	private updateChar() {
        if (this.detail.status !== null) {
            this.detail.status.setStatus(this.char === undefined ? undefined : this.char.stats);
        }
        if (this.detail.skills !== null) {
            this.detail.skills.setSkills(this.char === undefined ? [] : this.char.skills);
        }
        if (this.detail.quests !== null) {
            this.detail.quests.setQuest(this.char === undefined ? [] : Script.getQuests());
        }
        if (this.sets.kit !== null) {
			this.sets.kit.initState(Script.getSetByName(Script.sets.kit));
		}
		if (this.sets.set !== null) {
			this.sets.set.initState(Script.getSetByName(Script.sets.set));
		}
		if (this.sets.pri !== null) {
			const primario = Script.getSetByName(Script.sets.primario);
			const item = Script.getItem(radios.titles[radios.indexChecked]);
			if (item !== undefined) {
				primario.push(item);
			}
			this.sets.pri.initState(primario);
		}
        this.setResult();
    }
    
    private onStatusChanged = (charStats: ICharacterStatus) => {
        if (this.char !== undefined) {
            this.char.stats = charStats;
            this.setResult();
        }
    }

    private onSkillChanged = (cod: number, value: number, percent: boolean): boolean => {
        const names = Script.itensName;
        const inputValue = (name: string) => {
            const input = this.inputs.find(i => {
                return i.title === name;
            });
            return input === undefined || input.element === null ? 0 : input.element.asNumber();
        };

        switch (cod) {
            case Script.codes.AP: break;

            case Script.codes.AR:
                const result = this.calculateResults();
                let asNumber = Number(result.AR.value);
                if (!isNaN(asNumber)) {
                    const val = inputValue(names.arma + "-" + cod);
                    asNumber += percent ? val * value / 100 : val;
                    result.AR.value = asNumber;
                    if(this.detail.result !== null) {
                        this.detail.result.setResult(result);
                    }
                }
            break;
        }
        return true;
    }

    private onQuestChanged = (name: string, index: number, value: string): boolean => {
        let newStats = 0;
        if (this.char === undefined || this.detail.status === null) {
            return false;
        }

        const level = this.char.stats.lvl;
        if (isNaN(level)) {
            alert("Verifique o campo 'Level'. Valor encontrado: '" + this.char.stats.lvl + "'.");
            return false;
        }

        const questsDone = Script.getQuestsAt(index);
        if (level < questsDone[index].level) {
            alert("Você ainda não possui level suficiente para realizar essa quest.");
            return false;
        }

        this.bonus.quests = [];
        questsDone.forEach(q => {
            q.bonus.forEach(b => {
                if (b.cod === Script.codes.STS) {
                    newStats += b.value;
                }
                if (b.cod === Script.codes.STSp) {
                    const dif = level - q.level;
                    newStats += dif * b.value + b.value;
                }
                if (b.cod === Script.codes.HP || b.cod === Script.codes.HPadd) {
                    this.bonus.quests.push(b);
                }
            })
        })
        this.detail.status.setQuestBonus(newStats);
        this.setResult();
        return true;
    }
    
    private onCharSelect = (name: string, index: number, char: IChar | undefined): boolean => {
        const charsDone = [Script.chars.Arqueira]
      
        const charName = char === undefined ? undefined : char.name;
        if (charName !== undefined && charsDone.indexOf(charName) < 0){
            alert ("Ainda não é possível calcular a build para " + charName + ". :("
                + "\nMas estamos trabalhando nisso. :)");
            return false;
        }
        if (this.props.onCharChanged !== undefined) {
            this.props.onCharChanged(char);
        }
		const newChar = Script.getCharDetail(charName);
		this.setChar(newChar);
		return true;
	}

    private itemChanged = (title: string, newValue: number, oldValue: number) => {
        const attrCod = Script.getCodByAttr(title);
        if (attrCod === undefined) {
            return;
        }
        const bItens = this.bonus.itens;
        const contains = bItens.find(b => {
            return b.cod === attrCod;
        })
        if (contains === undefined) {
            bItens.push({ cod: attrCod, value: newValue });
        } else {
            const index = bItens.indexOf(contains);
            bItens[index].value += newValue > oldValue 
                ? (newValue - oldValue) 
                : -(oldValue - newValue);
        }
        this.setResult();
    }

    private mixSelected = (name: string, val: IMix | undefined) => {
        const mixes = this.bonus.mixes;
        const item = mixes.find(m => {
            return m.item === name;
        });

        if (item === undefined && val !== undefined) {
            mixes.push({ item: name, mix: val });
        } else if (item !== undefined && val === undefined) {
            mixes.splice(mixes.indexOf(item), 1);
        } else if (item !== undefined && val !== undefined) {
            item.mix = val;
        }
        console.log(mixes);
        this.setResult();
    }

    private onSelectEquip = (value: string, oldValue?: string) => {
        
        if (oldValue !== undefined) {
            this.mixSelected(oldValue, undefined);
        }
        const item: IItem | undefined = Script.getItem(value);
		if (this.sets.pri !== null) {
            if (item === undefined) {
                this.sets.pri.removeItem(radios.lastIndex);
            } else {
                this.sets.pri.addItem(item, radios.lastIndex);
            }
		}
    }

    private addInputValues = (inputs: IStatusInput[]) => {
        this.inputs = this.inputs.concat(inputs);
    }

    private setResult = () => {
        if (this.detail.result !== null) {
            const result = this.calculateResults()
            this.detail.result.setResult(result);
        }
    }

    private calculateResults = (): IStatusResult => {
        const char = this.char;
        if (char === undefined || char.formula === undefined) {
            return Script.defResult();
        }
        const getAttrByCode = (code: number): number => {
            const attr = this.bonus.itens.find(b => {
                return b.cod === code;
            });
            return attr === undefined ? 0 : attr.value;
        }
        const getStatsByCode = (code: number): number => {
            return code === Script.codes.FOR ? char.stats.for 
                    : code === Script.codes.AGI ? char.stats.agi
                    : code === Script.codes.INT ? char.stats.int
                    : code === Script.codes.TAL ? char.stats.tal
                    : code === Script.codes.VIT ? char.stats.vit
                    : -1;
        }

        const stats = char.stats;
        const f = char.formula;
        const statAttr = getStatsByCode(f.AP.attrFator);
        const minArma = getAttrByCode(Script.codes.APmin);
        const maxArma = getAttrByCode(Script.codes.APmax);
        const maxArmaAdd = getAttrByCode(Script.codes.APadd);
        const passive = 32;

        const div: number[] = [];
        f.AP.attrDiv.forEach(a => {
            const result = getStatsByCode(a.attr);
            if (result !== -1){
                div.push(result)
            }
        });

        const def = (f.DEF.fLvl * stats.lvl) + (f.DEF.fTal * stats.tal) + (f.DEF.fAgi * stats.agi) + f.DEF.add;
        const multi = (statAttr === -1 || minArma === 0) ? 0 : (1 / f.AP.fFator * statAttr);
        const sumAttrs = div.reduce((d, i) => d + i , 0);
        const maxAdd = maxArmaAdd > 0 ? stats.lvl / maxArmaAdd : 0;

        const values = {
            ABS: Math.trunc((stats.lvl / f.ABS.fLvl) + (stats.for / f.ABS.fFor) + (stats.tal / f.ABS.fTal)
                            + (stats.agi / f.ABS.fAgi) + (def / 100) + f.ABS.add),
            APmax: 6 + (maxArma) + Math.trunc(stats.lvl / 6) + Math.trunc(sumAttrs / 40) + Math.trunc(maxAdd)
                        + Math.trunc(multi * maxArma) + Math.trunc(maxArma * passive / 100),
            APmin: 4 + (minArma) + Math.trunc(stats.lvl / 6) + Math.trunc(sumAttrs / 40) + Math.trunc((minArma + maxArma) / 16)
                        + Math.trunc(multi * minArma) + Math.trunc(minArma * passive / 100),
            AR: Math.trunc((stats.lvl * f.AR.fLvl) + (stats.tal * f.AR.fTal) + (stats.agi * f.AR.fAgi) + f.AR.add),
            DEF: Math.trunc(def),
            HP: Math.trunc((f.HP.fLvl * stats.lvl) + (f.HP.fAgi * stats.agi) + (f.HP.fVit * stats.vit) + f.HP.add),
            MP: Math.trunc((f.MP.fLvl * stats.lvl) + (f.MP.fInt * stats.int) + f.MP.add),
            RES: Math.trunc((f.RES.fLvl * stats.lvl) + (f.RES.fFor * stats.for) + (f.RES.fTal * stats.tal)
                + (stats.int) + (f.RES.fVit * stats.vit) + f.RES.add),
        }

        const applyBonus = (bonus: IBonus) => {
            switch (bonus.cod) {
                case Script.itens.AR.cod: values.AR += bonus.value; break;
                case Script.itens.DEF.cod: values.DEF += bonus.value; break;
                case Script.itens.ABS.cod: values.ABS += bonus.value; break;
                case Script.itens.HP.cod: values.HP += bonus.value; break;
                case Script.itens.HPadd.cod: values.HP += bonus.value; break;
                case Script.itens.MP.cod: values.MP += bonus.value; break;
                case Script.itens.MPadd.cod: values.MP += bonus.value; break;
                case Script.itens.RES.cod: values.RES += bonus.value; break;
                case Script.itens.RESadd.cod: values.RES += bonus.value; break;
            }
        }
        this.bonus.mixes.forEach(m => 
            m.mix.bonus.forEach(b => 
                applyBonus(b)));
        this.bonus.quests.forEach(q => applyBonus(q));
        this.bonus.itens.forEach(i => applyBonus(i));
        return Script.defResult(values);
    }
}

export default CharDetail;