import React, { Component } from 'react';
import "./App.css";

class ManualEditor extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        book_content: props.content,
      };
    }
  
    onChangeBookContent(content) {
        this.setState({
          textareaValue: content
        })

        this.props.onChange(content);
      }
  
    preview(event) {
      event.preventDefault();
      let text_to_render = document.getElementById("editor_textarea").value;

      text_to_render = text_to_render.replace(/\n/g, "<br>");
    
      text_to_render = text_to_render.replace(/<script>/g, "");
      text_to_render = text_to_render.replace(/<\/script>/g, "");
    
      text_to_render = text_to_render.replace(/<link>/g, "");
      text_to_render = text_to_render.replace(/<\/link>/g, "");
    
      text_to_render = text_to_render.replace(/<div>/g, "");
      text_to_render = text_to_render.replace(/<\/div>/g, "");
    
      text_to_render = text_to_render.replace(/<p>/g, "");
      text_to_render = text_to_render.replace(/<\/p>/g, "");
    
      text_to_render = text_to_render.replace(/<span>/g, "");
      text_to_render = text_to_render.replace(/<\/span>/g, "");
    
      text_to_render = text_to_render.replace(/<style>/g, "");
      text_to_render = text_to_render.replace(/<\/style>/g, "");
    
      let render_div = document.getElementById("right_pane");
    
      render_div.innerHTML = text_to_render;
    }
  
    insertBold(event) { this.insertTag(event, "b"); }
    insertItalic(event) { this.insertTag(event, "i"); }
    insertUnderline(event) { this.insertTag(event, "u"); }
    insertFootnode(event) {
        this.insertTag(event, "a href");
    }

    insertTag(event, tag_name) {
      event.preventDefault();
      let editor_textarea = document.getElementById("editor_textarea");
  
      let selection = null;
      
      if (editor_textarea.selectionStart === editor_textarea.selectionEnd)
        selection = editor_textarea.selectionStart;
      else
        selection = editor_textarea.value.slice(editor_textarea.selectionStart, editor_textarea.selectionEnd);
      
      if (tag_name != null)
        editor_textarea.setRangeText(`<${tag_name}>${selection}</${tag_name}>`);

        this.onChangeBookContent(editor_textarea.value);
    }
  
    render() {
      return (
        <div className="App" id="page_container"> 
        <div id="left_pane">
        <span id="editor_controls">
                <button type="submit" onClick={(event) => this.preview(event)}>
                  Preview
                </button>
                <button
                  type="submit"
                  onClick={(event) => this.insertBold(event)}
                >
                  Bold
                </button>
                <button
                  type="submit"
                  onClick={(event) => this.insertItalic(event)}
                >
                  Italic
                </button>
                <button
                  type="submit"
                  onClick={(event) => this.insertUnderline(event)}
                >
                  Underline
                </button>
                <button
                  type="submit"
                  onClick={(event) => this.insertFootnode(event)}
                >
                  Footnote
                </button>
              </span>
          
              <textarea
              id="editor_textarea"
              placeholder="Type in your text here"
              value={this.props.book_content}
              onChange={(event) => this.onChangeBookContent(event.target.value)}
            ></textarea>

          </div>
 
          <div id="right_pane"></div>
        </div>
      );
    }
  }
  
  export default ManualEditor;