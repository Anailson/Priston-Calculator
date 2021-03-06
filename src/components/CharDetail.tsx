import * as React from 'react';

import Script from '../assets/js/Script';
import IAttr from '../interfaces/IAttr';
import IBonus from '../interfaces/IBonus';
import IChar from '../interfaces/IChar';
import ICharacterStatus from '../interfaces/ICharacterStatus';
import IForces from '../interfaces/IForces';
import IItem from '../interfaces/IItem';
import ILanguage from '../interfaces/ILanguage';
import IMix from '../interfaces/IMix';
import IQuest from '../interfaces/IQuest';
import ISkills from '../interfaces/ISkills';
import IStatusResult from '../interfaces/IStatusResult';
import IValuesResult from '../interfaces/IValuesResult';
import BonusAP from './BonusAP';
import CharSelect from './CharSelect';
import Quests from './Quests';
import Result from './Result';
import SetItem from './SetItem';
import ShitftEquip from './ShitftEquip';
import Skills from './Skills';
import Status from './Status';
import Title from './Title';

interface ICharDetail {
    language: ILanguage,
    onCharChanged?: (char: IChar | undefined) => void
}

const radios = (values: string[]) => {
    return {
        indexChecked: 0,
        lastIndex: values.length - 1,
        name: 'Status',
        titles: values,
    }
}

class CharDetail extends React.Component<ICharDetail>{

    public state: { hasChar: boolean, language: ILanguage }
    private radios: { indexChecked: number, lastIndex: number, name: string, titles: string[] };
    private char: IChar | undefined;
    private charSelect : CharSelect | null;
    private bonus: { skills: IBonus[], quests: IBonus[], mixes: Array<{ item: string, mix: IMix }>, forces: Array<{ name: string, force: IForces }> };
    private itens: { kit: IItem[], set: IItem[], prim: IItem[], bonus: IItem[] }
    private detail: { status: Status | null, skills: Skills | null, result: Result | null }
    private sets: { kit: SetItem | null, pri: SetItem | null, set: SetItem | null, bonus: SetItem | null }

    constructor(props: ICharDetail) {
        super(props);
        this.bonus = { skills: [], quests: [], mixes: [], forces: [] };
        this.itens = { kit: [], set: [], prim: [], bonus: [] }
        this.detail = { status: null, skills: null, result: null }
        this.sets = { kit: null, pri: null, set: null, bonus: null }
        this.state = { hasChar: false, language: props.language };
        const translations = props.language.translations
        this.radios = radios([
            translations.titles.TwoHand, 
            translations.itens.Shield, 
            translations.itens.Orbital
        ]);
    }

    public setChar(newChar: IChar | undefined) {
        
        this.char = newChar;
        if (!this.state.hasChar) {
            this.setState({ hasChar: true });
            return;
        }
        this.updateChar();
    }

    public changeLanguage (newLang: ILanguage) {
        const translations = newLang.translations;
        this.radios = radios([
            translations.titles.TwoHand, 
            translations.itens.Shield, 
            translations.itens.Orbital
        ]);
        if (this.charSelect !== null){
            const select = this.charSelect.getValue();
            const name = select === undefined ? undefined : select.value;
            this.char = Script.charDetail(newLang, name);
        }
        this.setState({ hasChar: this.state.hasChar, language: newLang })
    }

    public render() {
        const language = this.state.language
        const chars: string[] = Script.nameChars(language);
        const forces: IForces[] = Script.forces(language);
        const another: IForces[] = Script.boostersAP(language);
        const quests: IQuest[] =  Script.quests(language);

        const details = () => {
            if (this.char === undefined){
                return null;
            }
            return <div>
                <Status
                    stats={Script.statsDesc(this.state.language)}
                    language={this.state.language}
                    ref={ref => this.detail.status = ref}
                    onStatusChanged={this.onStatusChanged} />
                <Skills
                    title={titles.Skills}
                    ref={ref => this.detail.skills = ref}
                    onSkillChanged={this.onSkillChanged} />
                <Quests
                    title={titles.Quests}
                    lastQuest={titles.LastQuest}
                    quests={quests}
                    onQuestsChanged={this.onQuestChanged} />
                <BonusAP
                    title={titles.BonusAP} 
                    forces={forces}
                    another={another}
                    onForceSelected={this.onForceSelected} />
            </div>
        }
        const titles = language.translations.titles;
        return (
            <div className="row" style={{ margin: 0 }}>
                <div className="block col-lg-2">
                    <Title title={titles.Char} />
                    <CharSelect
                        ref={ref => this.charSelect = ref}
                        title={titles.SelectChar}
                        name={titles.Char}
                        chars={chars} 
                        onCharSelect={this.onCharSelect}/>
                    { details() }
                </div>
                <div className="block col-lg-6">
                    <Title title={titles.Equips} />
                    <SetItem 
                        ref={ref => this.sets.kit = ref}
                        language={this.state.language}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                    <SetItem 
                        ref={ref => this.sets.set = ref}
                        language={this.state.language}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                    <ShitftEquip
                        name={radios.name}
                        titles={this.radios.titles}
                        default={this.radios.indexChecked}
                        onSelectedCallback={this.onSelectEquip} />
                    <SetItem 
                        ref={ref => this.sets.pri = ref}
                        language={this.state.language}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                </div>
                <div className="col-lg-2">
                    <Title title={titles.BonusAdds} />
                    <SetItem 
                        ref={ref => this.sets.bonus = ref}
                        language={this.state.language}
                        onItemChanged={this.itemChanged}
                        onMixSelected={this.mixSelected} />
                    <Title title={titles.Results} />
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

	private updateSkills = () => {
		const getSkillValues = (skills: ISkills[]): IBonus[] => {
			const bonus: IBonus[] = [];
			skills.forEach(s => {
				s.adds.forEach(v => {
					bonus.push({ cod: v.cod, value: v.values[0], percent: v.percent })
				});
			});
			return bonus;
		}
		if (this.detail.skills !== null) {
			const skills = this.char === undefined ? [] : this.char.skills;
			this.bonus.skills = getSkillValues(skills);
			this.detail.skills.setSkills(skills);
		}
	}

	private updateChar() {
        const getItens = (names: string[]): IItem[] => {
            const itens: IItem[] = [];
            names.forEach(n => {
                const item = Script.getItem(this.state.language, n);
                if (item !== undefined) {
                    itens.push(item);
                }
            })
            return itens;
        }
        this.updateSkills();

        if (this.detail.status !== null) {
            this.detail.status.setStatus(this.char === undefined ? undefined : this.char.stats);
        }
        const itensChar = this.state.language.translations.itens;
        if (this.sets.kit !== null) {
            const names = [itensChar.Amulet, itensChar.Rings];
            this.itens.kit = getItens(names);
			this.sets.kit.initState(this.itens.kit);
		}
		if (this.sets.set !== null) {
            const names = [itensChar.Armlet, itensChar.Gauntlets, itensChar.Boots ]
            this.itens.set = getItens(names)
			this.sets.set.initState(this.itens.set);
		}
		if (this.sets.pri !== null) {
            const names = [itensChar.Weapon, itensChar.Armor, this.radios.titles[this.radios.indexChecked]]
            this.itens.prim = getItens(names);
			this.sets.pri.initState(this.itens.prim);
        }
        const bonusAdds = this.state.language.translations.titles.BonusAdds;
		if (this.sets.bonus !== null) {
            const names = [bonusAdds];
            this.itens.bonus = getItens(names);
			this.sets.bonus.initState(this.itens.bonus);
        }
        this.setResult();
    }
    
    private onStatusChanged = (charStats: ICharacterStatus) => {
        if (this.char !== undefined) {
            this.char.stats = charStats;
            this.setResult();
        }
    }

	private onSkillChanged = (bonus: IBonus[]): boolean => {
		if (this.char === undefined) {
			return false;
		}
		if (this.bonus.skills.length === 0) {
			this.bonus.skills = bonus;
		} else {
			console.log(bonus);
			bonus.forEach(b => {
				const skill = this.bonus.skills.find(s => {
					return s.cod === b.cod;
				})
				console.log(this.bonus.skills);
				if (skill === undefined) {
					this.bonus.skills = bonus;
				} else {
					skill.value = b.value;
				}
			})
		}
		this.setResult();
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

        const questsDone = Script.questsAt(this.state.language, index);
        if (level < questsDone[index].level) {
            alert("Você ainda não possui level suficiente para realizar essa quest.");
            return false;
        }

        this.bonus.quests = [];
        questsDone.forEach(q => {
            q.bonus.forEach(b => {
                if (b.cod === Script.Codes.STS) {
                    newStats += b.value;
                }
                if (b.cod === Script.Codes.STSp) {
                    const dif = level - q.level;
                    newStats += dif * b.value + b.value;
                }
                if (b.cod === Script.Codes.HP || b.cod === Script.Codes.HPadd) {
                    this.bonus.quests.push(b);
                }
            })
        })
        this.detail.status.setQuestBonus(newStats);
        this.setResult();
        return true;
    }

    private onForceSelected = (name: string, force: IForces | undefined): boolean => {
        const item = this.bonus.forces.find(f => {
            return f.name === name;
        })

        if (item === undefined && force !== undefined) {
            this.bonus.forces.push({ "name": name, "force": force })
        } else if (item !== undefined && force === undefined) {
            this.bonus.forces.splice(this.bonus.forces.indexOf(item), 1);
        } else if (item !== undefined && force !== undefined) {
            item.force = force;
        }
        this.setResult();
        return true;
    }
    
    private onCharSelect = (name: string, index: number): boolean => {
      
        const newChar = Script.charDetail(this.props.language, name);
        if (this.props.onCharChanged !== undefined && newChar !== undefined) {
            this.props.onCharChanged(newChar);
        }
        this.setChar(newChar);
		return true;
	}

    private itemChanged = (title: string, attr: IAttr, oldValue: number) => {
        
        const item = this.getItem(title);
        if (item === undefined) { return };
        item.attrs.forEach((a, i, t) => {
            if (a.cod === attr.cod) {
                t[i] = attr;
            }
        });
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
        this.setResult();
    }

    private onSelectEquip = (value: string, oldValue?: string) => {
        
        if (oldValue !== undefined) {
            this.mixSelected(oldValue, undefined);
        }
        const item: IItem | undefined = Script.getItem(this.state.language, value);
		if (this.sets.pri !== null) {
            if (item === undefined) {
                this.sets.pri.removeItem(this.radios.lastIndex);
            } else {
                this.sets.pri.addItem(item, this.radios.lastIndex);
            }
		}
    }

    private setResult = () => {
        if (this.detail.result !== null) {
            const result = this.calculateResults()
            this.detail.result.setResult(result);
        }
    }

    private calculateResults = (): IStatusResult => {
        const codes = Script.Codes;
        const char = this.char;
        if (char === undefined || char.formula === undefined) {
            return Script.defaultResult(this.state.language);
        }
        const getStatsByCode = (code: number): number => {
            return code === codes.FOR ? char.stats.for 
                : code === codes.AGI ? char.stats.agi
                : code === codes.INT ? char.stats.int
                : code === codes.TAL ? char.stats.tal
                : code === codes.VIT ? char.stats.vit
                : -1;
        }
        const attrDivs = (attrDiv: number[]): number[] => {
            const result: number[] = []
            attrDiv.forEach(a => {
                const stat = getStatsByCode(a);
                if (stat !== -1){
                    result.push(stat)
                }
            });
            return result;
        }

        const stats = char.stats;
        const f = char.formula;

        const div = attrDivs(f.AP.attrDiv);
        const statAttr = getStatsByCode(f.AP.attrFator);
        const weapon = this.state.language.translations.itens.Weapon;
        const multi = (statAttr !== -1) ? (1 / f.AP.fFator * statAttr) : 0;
        const minArma = this.getAttrByCode(weapon, codes.APmin);
        const maxArma = this.getAttrByCode(weapon, codes.APmax);
        const maxArmaAdd = this.getAttrByCode(weapon, codes.APadd);
        const sumAttrs = div.reduce((d, i) => d + i , 0);
        
        const addPercent = (bonus: IBonus, attr: number) => {
            return bonus.percent ? attr * bonus.value / 100 : bonus.value;
        }

        const applyValues = (bonus: IBonus, itemName?: string) => {
            const attr = itemName === undefined ? 0 : this.getAttrByCode(itemName, bonus.cod);
            const add = addPercent(bonus, attr);
            switch (bonus.cod) {
                case codes.AR: values.AR += add; break;
                case codes.ARadd: values.AR += bonus.value > 0 ? stats.lvl / bonus.value : 0; break;
                case codes.APmin: values.APmin += add; break;
                case codes.APmax: values.APmax += add; break;
                case codes.DEF: values.DEF += add; break;
                case codes.DEFadd: values.DEF += add; break;
                case codes.ABS: values.ABS += add; break;
                case codes.ABSadd: values.ABS += add; break;
                case codes.HP: values.HP += bonus.value; break;
                case codes.HPadd: values.HP += bonus.value; break;
                case codes.MP: values.MP += bonus.value; break;
                case codes.MPadd: values.MP += bonus.value; break;
                case codes.RES: values.RES += bonus.value; break;
                case codes.RESadd: values.RES += bonus.value; break;
            }
        }
        
        const applySkills = (bonus: IBonus[]): IValuesResult => {
			const vals: IValuesResult = { ABS: 0, APmax: 0, APmin: 0, AR: 0, DEF: 0, HP: 0, MP: 0, RES: 0 }
            bonus.forEach(b => {
                if (b.cod === codes.AR) {
                    const arArma = this.getAttrByCode(weapon, codes.AR);
                    vals.AR += addPercent(b, arArma);
                } else if (b.cod === codes.ARtotal) {
                    const ARtotal = values.AR;
                    vals.AR += addPercent(b, ARtotal);
                } else if (b.cod === codes.AP) {
                    const min = this.getAttrByCode(weapon, codes.APmin);
                    const max = this.getAttrByCode(weapon, codes.APmax);
                    vals.APmin += addPercent(b, min);
                    vals.APmax += addPercent(b, max);
                } else if (b.cod === codes.HP || b.cod === codes.HPadd) {
                    vals.HP += addPercent(b, values.HP);
                } else if (b.cod === codes.MP || b.cod === codes.MPadd) {
                    vals.MP += addPercent(b, values.MP);
                } else if (b.cod === codes.RES || b.cod === codes.RESadd) {
                    vals.RES += addPercent(b, values.RES);
                }
            })
            return vals;
        }
        const applyForces = (forces: Array<{ name: string, force: IForces }>): { apmax: number, apmin: number } =>{
            let min = 0;
            let max = 0;
            forces.forEach(el => {
                el.force.bonus.forEach(b => {
                    min += addPercent(b, values.APmin);
                    max += addPercent(b, values.APmax);
                })
            })
            return { apmax: max, apmin: min }
        }

        const def = (stats.lvl * 1.4) + (stats.tal * 0.25) + (stats.agi * 0.5);
        const hp = f.HP.fFor !== undefined ? f.HP.fFor * stats.for 
                : f.HP.fAgi !== undefined ? f.HP.fAgi * stats.agi
                : f.HP.fInt !== undefined ? f.HP.fInt * stats.int
                : 0;
        const values: IValuesResult = {
            ABS: (stats.lvl * 0.1) + (stats.for * 0.025) + (stats.tal * 0.025) + (def / 100),
            APmax: f.AP.max + Math.trunc(stats.lvl / 6) + Math.trunc(sumAttrs / f.AP.fDiv) 
                    + Math.trunc(maxArmaAdd > 0 ? stats.lvl / maxArmaAdd : 0) + Math.trunc(multi * maxArma),
            APmin: f.AP.min + Math.trunc(stats.lvl / 6) + Math.trunc(sumAttrs / f.AP.fDiv) 
                    + Math.trunc((minArma + maxArma) / 16) + Math.trunc(multi * minArma),
            AR: (stats.lvl * 1.9) + (stats.tal * 1.5) + (stats.agi * 3.1),
            DEF: def,
            HP: (stats.lvl * f.HP.fLvl) + (hp) + (stats.vit * f.HP.fVit) + f.HP.add,
            MP: (stats.lvl * f.MP.fLvl) + (stats.int * f.MP.fInt) + f.MP.add,
            RES: (stats.lvl * 2.3) + (stats.for * 0.5) + (stats.tal * 0.5) + (stats.int) 
                    + (stats.vit * 1.4) + 80
        }
        this.getAllItens().forEach(i => i.attrs.forEach(a => applyValues({ cod: a.cod, value: a.value })));
        this.bonus.quests.forEach(q => applyValues(q));
        this.bonus.mixes.forEach(m => m.mix.bonus.forEach(b => applyValues(b, m.item)));

        const valSkills = applySkills(this.bonus.skills);
        const valForces = applyForces(this.bonus.forces);

        valSkills.APmin += valForces.apmin;
        valSkills.APmax += valForces.apmax;
        
        values.AR += valSkills.AR;
        values.APmin += valSkills.APmin;
        values.APmax += valSkills.APmax;
        values.DEF += valSkills.DEF;
        values.ABS += valSkills.ABS;
        values.HP += valSkills.HP;
        values.RES += valSkills.RES;

        return Script.defaultResult(this.state.language, values);
    }

    private getAllItens = (): IItem[] => {
        return this.itens.kit.concat(this.itens.set).concat(this.itens.prim).concat(this.itens.bonus);
    }

    private getItem = (name: string) => {
        const itens = this.getAllItens();
        return itens.find(i => {
            return i.name === name;
        })
    }

    private getAttrByCode = (itemName: string, code: number): number => {
        const item = this.getItem(itemName);
        if (item === undefined) {
            return 0;
        }
        const attr = item.attrs.find(a => {
            return a.cod === code;
        });
        return attr === undefined ? 0 : attr.value;
    }
}

export default CharDetail;