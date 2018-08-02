import * as React from 'react';

import Script from '../assets/js/Script';
import IChar from '../interfaces/IChar';
import CharDetail from './CharDetail';
import Footer from './Footer';
import SwitchLanguage from './SwitchLanguage';

import '../assets/css/App.css';

class App extends React.Component {
	public render() {

		return <div>
			<SwitchLanguage values={Script.getLangs()}/>
			<CharDetail onCharChanged={this.charChanged}/>
			<Footer />
		</div>
	}

	public componentDidMount () {
		this.charChanged(undefined);
	}

	private charChanged = (char: IChar | undefined) => {
		const charName = char === undefined ? "" : char.name + " | ";
		document.title = charName + "Priston Calculator";
	}
}

export default App;