import * as React from 'react';

import Script from '../assets/js/Script';
import IChar from '../interfaces/IChar';
import IItem from '../interfaces/IItem';
import IQuest from '../interfaces/IQuest';
import IStatusInput from '../interfaces/IStatusInput';
import IStatusResult from '../interfaces/IStatusResult';
import CharDetail from './CharDetail';
import CharSelect from './CharSelect';
import Footer from './Footer';
import Result from './Result';
import SetItem from './SetItem';
import ShitftEquip from './ShitftEquip';
import Title from './Title';

import '../assets/css/App.css';

const radioTitles = ['Arma', 'Escudo', 'Orbital'];
const radios = {
	indexChecked: 0,
	lastIndex: radioTitles.length - 1,
	name: 'Status',
	titles: radioTitles,
}

class App extends React.Component {

	private script: Script;
	private itensPrimario: SetItem | null;
	private itensKit: SetItem | null;
	private itensSet: SetItem | null;
	private charDetail: CharDetail | null;
	private result: Result | null;

	constructor(props: {}) {
		super(props);
		this.script = new Script();
	}

	public render() {

		const chars: IChar[] = this.script.getChars();
		const quests: IQuest[] = this.script.getQuests();

		return (
			<div>
				<div className="row">
					<div className="block col-lg-2">
						<Title title="Personagens" />
						<CharSelect
							title={"Selecione um personagem:"}
							name={"Personagens"}
							chars={chars}
							onCharSelect={this.onCharSelect} />
						<CharDetail
							ref={ref => this.charDetail = ref}
							quests={quests}
							onCalculateResult={this.onCalculate} />
					</div>
					<div className="block col-lg-5">
						<Title title="Equipamentos" />
						<SetItem 
							ref={ref => this.itensKit = ref} 
							onItemChanged={this.onItemChanged} />
						<SetItem 
							ref={ref => this.itensSet = ref}
							onItemChanged={this.onItemChanged} />
						<ShitftEquip
							name={radios.name}
							titles={radios.titles}
							default={radios.indexChecked}
							onSelectedCallback={this.onSelectEquip} />
						<SetItem 
							ref={ref => this.itensPrimario = ref}
							onItemChanged={this.onItemChanged} 
							onInputValues={this.onInputValues} />
					</div>
					<div className="block col-lg-2">
						<Title title="Resultados" />
						<Result ref={ref => this.result = ref} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}

	public componentDidMount() {
		this.initComponents();
		this.setTitle();
	}

	private setTitle = (charName?: string) => {
		const title = charName === undefined ? "" : "[" + charName + "] ";
		document.title = title + "Priston Calculator";
	}

	private onCharSelect = (name: string, index: number, char: IChar | undefined): boolean => {

		const charName = char === undefined ? undefined : char.name;
		this.setTitle(charName);
		const newChar = this.script.getCharDetail(charName);
		if (this.charDetail !== null && newChar !== undefined) {
			this.charDetail.setChar(newChar);
		}
		return true;
	}

	private onCalculate = (results: IStatusResult) => {
		
		if (this.result !== null && this.result !== undefined) {
			this.result.setResult(results);
		}
	}

	private onInputValues = (inputs: IStatusInput[]) => {
		if (this.charDetail !== null) {
			this.charDetail.addInputValues(inputs);
		}
	}

	private onSelectEquip = (index: number) => {
		const item: IItem | undefined = this.script.getItem(radios.titles[index]);
		if (item !== undefined && this.itensPrimario !== null) {
			this.itensPrimario.addItem(item, radios.lastIndex);
		}
	}

	private onItemChanged = (title: string, value: number, oldValue: number) => {
		if (this.charDetail !== null) {
			this.charDetail.itemChanged(title, value, oldValue);
		}
	}

	private initComponents = () => {
		if (this.result !== null) {
			this.result.setResult(Script.defResult());
		}

		if (this.itensKit !== null) {
			this.itensKit.initState(this.script.getSetByName(Script.sets.kit));
		}
		if (this.itensSet !== null) {
			this.itensSet.initState(this.script.getSetByName(Script.sets.set));
		}
		if (this.itensPrimario !== null) {
			const primario = this.script.getSetByName(Script.sets.primario);
			const item: IItem | undefined = this.script.getItem(radios.titles[radios.indexChecked]);
			if (item !== undefined) {
				primario.push(item);
			}
			this.itensPrimario.initState(primario);
		}
	}
}

export default App;