import * as React from 'react';

import Script from '../assets/js/Script';
import IAttr from '../interfaces/IAttr';
import ILanguage from '../interfaces/ILanguage';
import IMix from '../interfaces/IMix';
import Image from './Image'
import InputText from './InputText';
import Mixing from './Mixing';

interface IItem { 
    name: string, 
    titles: string[], 
    language: ILanguage,
    onlyImage?: boolean
    onChangeValue?: (title: string, attr: IAttr, oldValue: number) => void,
    onMixSelected?: (cod: string, mix: IMix | undefined) => void,
};

class Item extends React.Component<IItem>{

    constructor (props: IItem){
        super(props);
    }

    public render() {
        const inputs = () => {
            return this.props.titles.map((t, i) => {
                return <InputText 
                    key={i} 
                    title={t + ":"} 
                    onChangeValue={this.onChangeValue} />
            })
        };
        const mixes = Script.mixesByItem(this.props.language, this.props.name);
        let attrClass = this.props.titles.length > 0 ? "padding" : "";
        attrClass += this.hasImage(this.props.name) ? " inner-border" : "";

        return <div className={"item-size background outter-border padding"}>
            <Image 
                language={this.props.language}
                item={this.props.name} />
            {(() => {
                if (this.props.onlyImage) {
                    return null;
                }
                return <div>
                    <Mixing 
                        name={this.props.name} 
                        mixes={mixes !== undefined ? mixes.type : []}
                        onMixSelected={this.onMixSelected} />
                    <div className={attrClass}>
                        { inputs() }
                    </div>
                </div>
            })()}
        </div>
    }

    private onChangeValue = (attrName: string, val: number, oldValue: number) => {
        if(this.props.onChangeValue === undefined){
            return;
        }
        attrName = attrName.replace(":", "");
        const code = Script.codByAttr(this.props.language, attrName);
        if (code !== undefined) {
            const attr: IAttr = { cod: code, title: attrName, value: val }
            this.props.onChangeValue(this.props.name, attr, oldValue);
        }
    }

    private onMixSelected = (name: string, mix: IMix) => {
        if (this.props.onMixSelected !== undefined) {
            this.props.onMixSelected(name, mix);
        }
    }

    private hasImage = (name: string): boolean => {
        return Image.setImage(this.props.language, name) !== undefined
    }
}

export default Item;