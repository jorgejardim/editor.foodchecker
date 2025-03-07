import EditorJS from '@editorjs/editorjs';
import customHtmlParser from './plugins/customHtmlParser.js';
import { editorJsPtBR } from './i18n/pt-BR.js';

import DOMPurify from 'dompurify';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Strikethrough from '@sotaproject/strikethrough';
import TextColorPlugin from 'editorjs-text-color-plugin';
import IndentTune from 'editorjs-indent-tune';
import AlignmentTuneTool from 'editor-js-alignment-tune';
import ChangeCase from 'editorjs-change-case';

class Editor {
    constructor(holderId, initialData, uploadByFile, onChangeCallback) {
        this.htmlParser = customHtmlParser;

        this.editor = new EditorJS({
            holder: holderId,
            tunes: ['alignmentTune', 'indentTune'],
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ['link', 'textColor', 'changeCase'],
                    config: {
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    },
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: ['link', 'bold', 'italic', 'marker', 'underline', 'strikethrough', 'textColor', 'changeCase'],
                },
                list: {
                    class: List,
                    inlineToolbar: ['link', 'bold', 'italic', 'marker', 'underline', 'strikethrough', 'textColor', 'changeCase'],
                    config: {
                        defaultStyle: 'unordered',
                        counterTypes: ['numeric', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha'],
                        allowedStyles: ['ordered', 'unordered']
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: uploadByFile
                        }
                    }
                },
                table: Table,

                // INLINE

                marker: {
                    class: Marker,
                },
                underline: {
                    class: Underline,
                },
                strikethrough: {
                    class: Strikethrough,
                },
                textColor: {
                    class: TextColorPlugin,
                    config: {
                        colorCollections: [
                            "#000000", "#003366", "#806000", "#804000", "#660000", "#006600", "#330066", "#800040", "#663300",
                            "#808080", "#0066FF", "#CC9900", "#E67300", "#990000", "#00FF00", "#6600FF", "#E60066", "#662200",
                            "#A6A6A6", "#3385FF", "#FFB300", "#FF8000", "#CC0000", "#33FF33", "#8533FF", "#FF1A80", "#85331A",
                            "#BFBFBF", "#66A3FF", "#FFD633", "#FF9933", "#FF0000", "#66FF66", "#A366FF", "#FF4D99", "#A3664D",
                            "#D9D9D9", "#99C2FF", "#FFEB66", "#FFB366", "#FF3333", "#99FF99", "#C299FF", "#FF80B3", "#C29980",
                            "#F2F2F2", "#CCE0FF", "#FFF299", "#FFD699", "#FF6666", "#CCFFCC", "#E0CCFF", "#FFB3CC", "#E0CCB3",
                            "#FFFFFF", "#E6F2FF", "#FFF7CC", "#FFE6CC", "#FF9999", "#E6FFE6", "#F2E6FF", "#FFD9E6", "#F2E6D9",
                            "#FF0000", "#FF6600", "#FFFF00", "#99CC00", "#33CC33", "#00CC99", "#0066CC", "#0000FF", "#660099",
                        ],
                        type: 'text',
                    }
                },
                indentTune: {
                    class: IndentTune,
                    version: EditorJS.version,
                    config: {
                        handleShortcut: false,
                    }
                },
                alignmentTune: {
                    class: AlignmentTuneTool,
                    config:{
                        default: "left"
                    },
                },
                changeCase: {
                    class: ChangeCase,
                    config: {
                        title: 'Alterar Caixa',
                        showLocaleOption: false,
                        locale: 'pt-BR'
                    }
                }
            },
            data: initialData,
            onChange: async () => {
                if (onChangeCallback) {
                    onChangeCallback();
                }
            },
            i18n: {
                messages: editorJsPtBR
            },
        });
    }

    async save() {
        const data = await this.editor.save();

        // Sanitizar cada bloco de texto antes de salvar
        data.blocks = data.blocks.map(block => {
            if (block.type === "paragraph" || block.type === "list") {
                block.data.text = this.cleanHtml(block.data.text);
            }
            return block;
        });

        return data;
    }

    async saveHtml() {
        const data = await this.save();
        const htmlOutput = this.htmlParser.parse(data);

        if (Array.isArray(htmlOutput)) {
            return htmlOutput.join('');
        }

        return htmlOutput;
    }

    cleanHtml(inputHtml) {
        let sanitized = DOMPurify.sanitize(inputHtml, {
            ALLOWED_TAGS: ['p', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
            ALLOWED_ATTR: ['href'],
        });

        sanitized = sanitized.replace(/&nbsp;/g, ' ');
        sanitized = sanitized.replace(/\n{2,}/g, '\n');
        sanitized = sanitized.replace(/\s{2,}/g, ' ');
        sanitized = sanitized.replace(/>\s+</g, '><');

        return sanitized.trim();
    }
}

export { Editor as default };
