import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';

export default class MeuEditor {
    
  constructor(holderId) {
    this.editor = new EditorJS({
      holder: holderId,
      tools: {
        header: Header,
        list: List,
        image: ImageTool,
        table: Table,
        paragraph: Paragraph
      }
    });
  }

  save() {
    return this.editor.save();
  }
}
