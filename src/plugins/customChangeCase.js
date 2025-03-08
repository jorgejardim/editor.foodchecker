import ChangeCase from 'editorjs-change-case';

export default class CustomChangeCase extends ChangeCase {

    constructor({ config, api }) {
        super({ config, api });

        this.caseOptions = {
            'titleCase': 'Título Capitalizado',
            'lowerCase': 'letras minúsculas',
            'upperCase': 'LETRAS MAIÚSCULAS',
            // 'localeLowerCase': 'minúsculas localizadas',
            // 'localeUpperCase': 'MAIÚSCULAS LOCALIZADAS',
            'sentenceCase': 'Frase capitalizada',
            'toggleCase': 'iNVERTER cASE'
        };
    }

    get title() {
        return 'Mudar Caixa';
    }

    renderActions() {
        const actionsElement = super.renderActions();

        const titleElement = actionsElement.querySelector(`.${this.CSS.toolbarLabel}`);
        if (titleElement) {
            titleElement.innerHTML = this.title;
        }

        return actionsElement;
    }
}
