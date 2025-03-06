import EditorJsHtml from 'editorjs-html';

const defaultParser = EditorJsHtml();

const parseBlock = (block) => {
    let parsed = defaultParser.parse({ blocks: [block] });
    return Array.isArray(parsed) ? parsed.join('') : parsed;
};

const customHtmlParser = EditorJsHtml({

    header: (block) => {
        const alignment = block.tunes?.alignmentTune?.alignment || 'left';
        const indentLevel = block.tunes?.indentTune?.indentLevel || 0;
        return `<div style="text-align: ${alignment}; padding-left: ${indentLevel * 20}px;">${parseBlock(block)}</div>`;
    },

    paragraph: (block) => {
        const alignment = block.tunes?.alignmentTune?.alignment || 'left';
        const indentLevel = block.tunes?.indentTune?.indentLevel || 0;
        return `<div style="text-align: ${alignment}; padding-left: ${indentLevel * 20}px;">${parseBlock(block)}</div>`;
    },

    list: (block) => {
        const alignment = block.tunes?.alignmentTune?.alignment || 'left';
        const indentLevel = block.tunes?.indentTune?.indentLevel || 0;
        return `<div style="text-align: ${alignment}; padding-left: ${indentLevel * 20}px;">${parseBlock(block)}</div>`;
    },

    table: (block) => {
        const alignment = block.tunes?.alignmentTune?.alignment || 'left';
        const isStretched = block.data.stretched ? 'width: 100%;' : 'width: auto;';
        const indentLevel = block.tunes?.indentTune?.indentLevel || 0;

        let tableStyle = `border-collapse: collapse; ${isStretched}`;

        if (alignment === 'center') {
            tableStyle += ' margin: auto; display: table;';
        } else if (alignment === 'right') {
            tableStyle += ' float: right;';
        } else {
            tableStyle += ' float: left;';
        }

        let tableHtml = `<div style="overflow: auto; padding-left: ${indentLevel * 20}px;">
                                    <table style="${tableStyle}">`;

        if (block.data.withHeadings) {
            tableHtml += `<thead><tr>`;
            block.data.content[0].forEach(cell => {
                tableHtml += `<th>${cell.trim()}</th>`;
            });
            tableHtml += `</tr></thead><tbody>`;

            block.data.content.slice(1).forEach(row => {
                tableHtml += `<tr>`;
                row.forEach(cell => {
                    tableHtml += `<td>${cell.trim()}</td>`;
                });
                tableHtml += `</tr>`;
            });

            tableHtml += `</tbody>`;
        } else {
            block.data.content.forEach(row => {
                tableHtml += `<tr>`;
                row.forEach(cell => {
                    tableHtml += `<td>${cell.trim()}</td>`;
                });
                tableHtml += `</tr>`;
            });
        }

        tableHtml += `</table></div>`;
        return tableHtml;
    },

    image: (block) => {
        if (!block.data.file || !block.data.file.url) {
            return '';
        }

        const { file, caption, withBorder, withBackground, stretched } = block.data;
        const alignment = block.tunes?.alignmentTune?.alignment || 'left';
        const indentLevel = block.tunes?.indentTune?.indentLevel || 0;

        let imageStyles = `display: block; margin: auto;`;
        if (alignment === 'left') imageStyles = `float: left;`;
        if (alignment === 'right') imageStyles = `float: right;`;

        let borderStyle = withBorder ? 'border: 1px solid black;' : '';
        let backgroundStyle = withBackground ? 'background-color: lightgray; padding: 5px;' : '';
        let stretchStyle = stretched ? 'width: 100%; display: block;' : '';

        return `
            <div style="text-align: ${alignment}; padding-left: ${indentLevel * 20}px; ${backgroundStyle}">
                <img src="${file.url}" alt="${caption || ''}" style="${imageStyles} ${borderStyle} ${stretchStyle}">
                ${caption ? `<small style="text-align: center; display: block;">${caption}</small>` : ''}
            </div>
        `;
    },

});

export default customHtmlParser;
