import MeuEditor from './index.js';

const editor = new MeuEditor('editorjs');

window.salvarConteudo = async function() {
    const data = await editor.save();
    console.log("Conteúdo salvo:", data);
};
