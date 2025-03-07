import Editor from './editor.js';

// Timeout para salvamento debounce
let saveTimeout;

// Carrega o conteúdo salvo no localStorage
const savedData = localStorage.getItem('editorJsContentTest');
const initialData = savedData ? JSON.parse(savedData) : null;

// Elementos de saída
const outputJson = document.getElementById("content-json");
const outputHtml = document.getElementById("content-html");

// Função para salvar o conteúdo do editor
window.contentSave = async function() {

    const dataJson = await editor.save();
    const dataHtml = await editor.saveHtml();

    outputJson.innerHTML = JSON.stringify(dataJson, null, 2);
    outputHtml.innerHTML = dataHtml;

    localStorage.setItem('editorJsContentTest', JSON.stringify(dataJson));
    // console.log("Conteúdo salvo:", dataJson);
    // console.log("HTML salvo:", dataHtml);
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

// Inicializa o editor
const editor = new Editor('editorjs', initialData, byFile, debouncedSave);
