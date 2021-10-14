import React, { Component } from 'react';
import "./App.css";

class ManualEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            book_content: props.content,
        };
    }

    onChangeBookContent(data) {
        this.setState({
            book_content: data,
        });

        this.props.onChange(data);
    }

    preview() {
        console.log ("Preview");
    }

    insertTag(tag_name) {
        let editor_textarea = document.getElementById("editor_textarea");

        //let selection = null;
      //
        //if (editor_textarea.selectionStart === editor_textarea.selectionEnd)
        //  selection = editor_textarea.selectionStart;
        //else
        //  selection = editor_textarea.value.slice(editor_textarea.selectionStart, editor_textarea.selectionEnd);
        //
        //console.log(tag_name);
        //switch (tag_name) {
        //  case "strong":
        //    tag_name = "strong";
        //    break;
      //
        //  case "italic":
        //    tag_name = "i";
        //    break;
        //    
        //  case "footnote":
        //    tag_name = "a href";
        //    break;
        //  default:
        //    tag_name = null;
        //    break;
        //}
      //
        //if (tag_name != null)
        //  editor_textarea.setRangeText(`<${tag_name}>${selection}</${tag_name}>`);
    }

    render() {
        return (

            <div className="App">
                <div id="left_pane">
                    <div id="editor_controls">
                        <button id="preview" onclick={this.preview()}>Preview</button>
                        <button id="strong" onclick={this.insertTag("strong")}>BOLD</button>
                        <button id="italic" onclick={this.insertTag("italic")}>ITALIC</button>
                        <button id="footnode" onclick={this.insertTag("footnote")}>FOOTNOTE</button>
                    </div>
                    <textarea id="editor_textarea" placeholder="Type in your text here" data={this.props.book_content}></textarea>
                </div>

                <div id="right_pane"></div>
            </div>
        );
    }
}

export default ManualEditor;