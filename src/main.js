import Editor from './editor.js';

let saveTimeout;
let editor;

// Função para salvar o conteúdo do editor
window.contentSave = async function() {

    const dataJson = await editor.save();
    const dataHtml = await editor.saveHtml();

    localStorage.setItem('editorJsContentTest', JSON.stringify(dataJson));
    console.log("Conteúdo salvo:", dataJson);
    console.log("HTML salvo:", dataHtml);

    // Enviar atualização para a janela pai
    window.parent.postMessage({ type: "update", data: dataJson, dataHtml: dataHtml }, "*");
};

// Função para salvar o conteúdo do editor com debounce
const debouncedSave = async function() {

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        contentSave();
    }, 2000);
}

// Simulação de upload de imagem
async function byFile(file) {
    console.log("Simulando upload de imagem:", file);
    return new Promise((resolve) => {
        setTimeout(() => {
            const imageUrl = URL.createObjectURL(file); // Simula o retorno de uma URL
            resolve({
                success: 1,
                file: { url: imageUrl }
            });
        }, 1000);
    });
}

// Função para inicializar o editor
function inicializarEditor(initialData) {
    if (editor) {
        editor.destroy();
    }
    editor = new Editor('editorjs', initialData, byFile, debouncedSave);

    // Adiciona um listener para mudanças no conteúdo do Editor.js
    setInterval(contentHeight, 500);
}

// Evento para receber mensagens do iframe
window.addEventListener("message", (event) => {
    if (event.data.type === "init") {
        inicializarEditor(event.data.data);
    }
    if (event.data.type === "get") {
        contentSave();
    }
});

// Função para enviar a altura atual do iframe para a janela pai
function contentHeight() {
    const height = document.body.scrollHeight;
    const width = document.body.scrollWidth;

    window.parent.postMessage({ type: "resize", width: width, height: height }, "*");
}

// Verifica se está em modo de desenvolvimento e carrega o conteúdo salvo
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('dev') || import.meta.env.MODE === 'development') {
    const savedData = localStorage.getItem('editorJsContentTest');
    const initialData = savedData ? JSON.parse(savedData) : null;
    inicializarEditor(initialData);

// Solicita o conteúdo para a janela pai
} else {
    window.parent.postMessage({ type: "get" }, "*");
}
