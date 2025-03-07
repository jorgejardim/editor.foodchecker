export default class Editor {
    constructor(
        holderId: string,
        initialData?: any,
        uploadByFile?: Function,
        onChangeCallback?: Function
    );

    save(): Promise<any>;
    saveHtml(): Promise<string>;
}
