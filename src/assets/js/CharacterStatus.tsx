import IChar from "../../interfaces/IChar";
import ICharacterStatus from "../../interfaces/ICharacterStatus";
import ILanguage from "../../interfaces/ILanguage";
import IStatus from "../../interfaces/IStatus";
import Codes from './Codes';

export default class CharacterStatus {
    
    public static chars(language: ILanguage): IChar[] {
        const names = language.translations.chars;
        return [
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 130, attrFator: Codes.AGI, attrDiv: [Codes.TAL], min: 4, max: 6 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fAgi: 0.5, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.6, fInt: 2.2, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 0, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.AS,
                skills: [
                    { codBonus: Codes.AP, name: "Mestra do Tiro", percent: true, values: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
                    { codBonus: Codes.AR, name: "Olho de Dion", percent: true, values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }, // Taxa do Arco
                ],
                stats: { lvl: 1, for: 17, int: 11, tal: 21, agi: 27, vit: 23 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 130, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 2, max: 4 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.7, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.6, fInt: 2.2, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.ASS,
                skills: [
                    { codBonus: Codes.AP, name: "Maestria em Adagas", percent: true, values: [0, 5, 7, 9, 11, 14, 17, 20, 23, 27, 31] },
                    { codBonus: Codes.ARtotal, name: "Maestria do Ataque", percent: true, values: [0, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62] },
                    { codBonus: -1, name: "Maestria Fatal", values: [] },
                ],
                stats: { lvl: 1, for: 25, int: 10, tal: 22, agi: 20, vit: 22 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 130, attrFator: Codes.AGI, attrDiv: [Codes.TAL], min: 4, max: 6 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fAgi: 0.5, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.9, fInt: 2.7, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.ATS,
                skills: [
                    { codBonus: Codes.AP, name: "Maestra do Arremesso", percent: true, values: [0, 18, 22, 26, 30, 34, 38, 41, 44, 47, 50] }
                ],
                stats: { lvl: 1, for: 23, int: 15, tal: 19, agi: 19, vit: 23 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 130, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 2, max: 4 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.7, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.9, fInt: 2.7, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.KS,
                skills: [
                    { codBonus: Codes.RES, name: "Treinamento Físico", percent: true, values: [0, 5, 8, 11, 14, 17, 20, 23, 26, 28, 30] },
                    { codBonus: Codes.AP, name: "Mestre das Espadas", percent: true, values: [0, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38] },
                ],
                stats: { lvl: 1, for: 26, int: 13, tal: 17, agi: 19, vit: 24 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 130, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 2, max: 4 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.8, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.6, fInt: 2.2, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.WS,
                skills: [ 
                    { codBonus: Codes.AP, name: "Maestria em Força", percent: true, values: [0, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46] },
                    { codBonus: Codes.RES, name: "Maestria em Resistência", percent: true, values: [0, 6, 12] }
                ],
                stats: { lvl: 1, for: 26, int: 9, tal: 20, agi: 20, vit: 24}
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: -1, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 3, max: 5 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.8, fVit: 2.4, add: -10 },
                    MP: { fLvl: 0.6, fInt: 2.2, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.FS,
                skills: [
                    { codBonus: Codes.AP, name: "Mestre das Armas", percent: true, values: [0, 6, 10, 14, 18, 21, 24, 26, 28, 30, 32] },
                    // { codBonus: Codes.HP, name: "Bônus de Vitalidade", values: [] },
                ],
                stats: { lvl: 1, for: 28, int: 6, tal: 21, agi: 17, vit: 27 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: -1, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 3, max: 5 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 1.5, fInt: 0.5, fVit: 2.2, add: -10 },
                    MP: { fLvl: 1.5, fInt: 3.8, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.MGS,
                skills: [
                    { codBonus: Codes.MP, name: "Mestre da Mente", percent: true, values: [0, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32] }
                ],
                stats: { lvl: 1, for: 16, int: 29, tal: 19, agi: 14, vit: 21 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: -1, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 3, max: 5 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.6, fVit: 2.2, add: -5 },
                    MP: { fLvl: 0.9, fInt: 2.7, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.MS,
                skills: [
                    { codBonus: Codes.AP, name: "Mestre dos Mecânicos", percent: true, values: [0, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41] }
                ],
                stats: { lvl: 1, for: 24, int: 8, tal: 25, agi: 18, vit: 24 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: -1, attrFator: Codes.FOR, attrDiv: [Codes.TAL, Codes.AGI], min: 3, max: 5 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 2.1, fFor: 0.8, fVit: 2.4, add: -5 },
                    MP: { fLvl: 0.6, fInt: 2.2, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.PS,
                skills: [],
                stats: { lvl: 1, for: 26, int: 9, tal: 20, agi: 19, vit: 25 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: 170, attrFator: Codes.INT, attrDiv: [Codes.AGI, Codes.TAL], min: 1, max: 3 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 1.5, fInt: 0.5, fVit: 2.2, add: -10 },
                    MP: { fLvl: 1.5, fInt: 3.8, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.PRS,
                skills: [],
                stats: { lvl: 1, for: 15, int: 28, tal: 21, agi: 15, vit: 20 },
            },
            {
                asSkills: CharacterStatus.toSkills,
                formula: {
                    ABS: { fLvl: 0.1, fFor: 0.025, fTal: 0.025, add: 0 },
                    AP: { fFator: -1, attrFator: Codes.INT, attrDiv: [Codes.TAL], min: 1, max: 3 },
                    AR: { fLvl: 1.9, fTal: 1.5, fAgi: 3.1, add: 0 },
                    DEF: { fLvl: 1.4, fTal: 0.25, fAgi: 0.5, add: 0 },
                    HP: { fLvl: 1.5, fInt: 0.5, fVit: 2.2, add: -10 },
                    MP: { fLvl: 1.5, fInt: 3.8, add: 0 },
                    RES: { fLvl: 2.3, fFor: 0.5, fInt: 1, fTal: 0.5, fVit: 1.4, add: 80 }
                },
                name: names.XS,
                skills: [
                    { codBonus: Codes.MP, name: "Paz Interior", percent: true, values: [0, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31] },
                    { codBonus: Codes.HP, name: "Vida Divina", percent: true, values: [0, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32] },
                ],
                stats: { lvl: 1, for: 15, int: 27, tal: 20, agi: 15, vit: 22 },
            },
        ]
    }

    private static toSkills = (stats: ICharacterStatus): IStatus[] => {
        /*return Script.translations.status.map(s => {
                const defValue = s.cod === Codes.LVL ? stats.lvl
                    : s.cod === Codes.FOR ? stats.for
                    : s.cod === Codes.INT ? stats.int
                    : s.cod === Codes.AGI ? stats.agi
                    : s.cod === Codes.TAL ? stats.tal
                    : s.cod === Codes.VIT ? stats.vit
                    : -1;
                return {
                    default: defValue,
                    disable: (s.cod === Codes.STS),
                    name: s.title,
                }
            })
        }*/ 
        return [];
    }
}
