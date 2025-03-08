export default class PlaceholderTool {

    static get isInline() {
        return true;
    }

    get state() {
        return this._state;
    }

    constructor({ config, api }) {
        this.api = api;
        this.button = null;
        this.optionButtons = [];
        this._state = true;
        this.selectedText = null;
        this.range = null;
        this._settings = config;

        this.CSS = {
            actions: 'placeholder-action',
            toolbarLabel: 'placeholder-toolbar__label',
            tool: 'placeholder-tool',
            toolbarBtnActive: this.api.styles.settingsButtonActive,
            inlineButton: this.api.styles.inlineToolButton
        };

        // Lista de placeholders disponíveis
        this.placeholders = {
            'nome-fantasia-contratante': '#NOME-FANTASIA-DO-CONTRATANTE#',
            'razao-social-contratante': '#RAZAO-SOCIAL-DO-CONTRATANTE#',
            'cnpj-contratante': '#CNPJ-DO-CONTRATANTE#',
            'endereco-contratante': '#ENDERECO-DO-CONTRATANTE#',
            'nome-responsavel-contratante': '#NOME-DO-RESPONSAVEL-DO-CONTRATANTE#',
            'nome-contratado': '#NOME-DO-CONTRATADO#',
            'cnpj-contratado': '#CNPJ-DO-CONTRATADO#',
            'cpf-contratado': '#CPF-DO-CONTRATADO#',
            'valor': '#VALOR#'
        };
    }

    set state(state) {
        this._state = state;
        this.button.classList.toggle(this.CSS.toolbarBtnActive, state);
    }

    get title() {
        return 'Inserir Placeholder';
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 100 100" fill="black">
                <path d="M25 10 H75 A5 5 0 0 1 80 15 V85 L50 65 L20 85 V15 A5 5 0 0 1 25 10 Z"/>
                <circle cx="50" cy="30" r="5" fill="white"/>
            </svg>`;
        this.button.classList.add(this.CSS.inlineButton);

        this.button.title = this.title;

        return this.button;
    }

    checkState(selection) {
        const text = selection.anchorNode;
        if (!text) return;
    }

    insertPlaceholder(range, placeholder) {
        if (!range) return;
        const clone = range.cloneContents();
        if (!clone) return;

        clone.childNodes.forEach(node => {
            if (node.nodeName === '#text') {
                node.textContent = placeholder;
            }
        });

        range.extractContents();
        range.insertNode(clone);
        this.api.inlineToolbar.close();
    }

    surround(range) {
        this.selectedText = range.cloneContents();
        this.actions.hidden = !this.actions.hidden;
        this.range = !this.actions.hidden ? range : null;
        this.state = !this.actions.hidden;
    }

    renderActions() {
        this.actions = document.createElement('div');
        this.actions.classList.add(this.CSS.actions);

        const actionsToolbar = document.createElement('div');
        actionsToolbar.classList.add(this.CSS.toolbarLabel);
        actionsToolbar.innerHTML = 'Inserir Placeholder';

        this.actions.appendChild(actionsToolbar);

        this.optionButtons = Object.keys(this.placeholders).map(option => {
            const btnOption = document.createElement('div');
            btnOption.classList.add(this.CSS.tool);
            btnOption.dataset.mode = option;
            btnOption.innerHTML = this.placeholders[option];
            return btnOption;
        });

        for (const btnOption of this.optionButtons) {
            this.actions.appendChild(btnOption);
            this.api.listeners.on(btnOption, 'click', () => {
                this.insertPlaceholder(this.range, this.placeholders[btnOption.dataset.mode]);
            });
        }

        this.actions.hidden = true;
        return this.actions;
    }

    destroy() {
        for (const btnOption of this.optionButtons) {
            this.api.listeners.off(btnOption, 'click');
        }
    }
}
