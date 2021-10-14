import React, { Component } from 'react';
import "./App.css";

class ManualEditor extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        book_content: props.content,
        html_display: ''
      };
    }
  
    onChangeBookContent(event, content) {
        this.setState({
            book_content: content
        })

        this.preview(event);
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
    
      //let render_div = document.getElementById("right_pane");
    
    console.log(text_to_render);

      //render_div.innerHTML = 

        this.setState({
            html_display: '<html><body>' + text_to_render +  '</body></html>'
        })
    }
  
    insertBold(event) { this.insertTag(event, "strong"); }
    insertItalic(event) { this.insertTag(event, "em"); }
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

        this.onChangeBookContent(event, editor_textarea.value);
    }
  
    render() {
      return (
        <div className="App" id="page_container"> 
        <div id="left_pane">
        <span id="editor_controls">
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
              rows='10'
              onChange={(event) => this.onChangeBookContent(event, event.target.value)}
            ></textarea>

          </div>
          <iframe id="left_pane" srcDoc={this.state.html_display} />
        </div>
      );
    }
  }
  
  export default ManualEditor;