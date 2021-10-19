import React, { Component } from 'react';
import "./App.css";
class ManualEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: props.content,
            html_display: ''
        };
    }

    onChangeBookContent(event, content) {
        event.preventDefault();

        this.setState({
            content: content
        })

        this.preview();
        this.props.onChange(content);
    }

    preview() {
        let text_to_render = this.state.content;

        let container = document.getElementById("editor_textarea");
        if (container != null)
            text_to_render = document.getElementById("editor_textarea").value;

        //text_to_render = text_to_render.replace(/\n/g, "<br>");
        //text_to_render = text_to_render.replace(/<p>(.*)<\/p>/g, "$1<br />"); //$1 here contains all the html between the <p> tags. So you can change this around to what you want it to be, example: <a>$1</a>

        let arrays = text_to_render.split('\n');
        
        let paragraphtext = "";
        arrays.forEach(element => {
            paragraphtext += '<p>' + element + '</p>'
        });
        this.setState({
            html_display: paragraphtext
        })
    }

    insertBold(event) { this.insertTag(event, "strong"); }
    insertItalic(event) { this.insertTag(event, "em"); }
    insertUnderline(event) { this.insertTag(event, "u"); }
    insertFootnode(event) {
        event.preventDefault();

        var refID = prompt("Enter reference ID: ");
        var reftext = prompt("Enter reference text: ");
        
        let editor_textarea = document.getElementById("editor_textarea");

        if (editor_textarea.selectionStart !== editor_textarea.selectionEnd) {
            let selection = editor_textarea.value.slice(editor_textarea.selectionStart, editor_textarea.selectionEnd);

            editor_textarea.setRangeText(selection + "<a id=\"reflink-" + refID + "\" href=\"#refid-" + refID + "\"><sup>[" + refID + "]</sup></a>");
            editor_textarea.value += "\r\n<li id=\"refid-" + refID + "\"> [<a href=\"reflink-" + refID + "\">" + refID + "</a>] " + reftext + "</li>";
        }
            
        this.onChangeBookContent(event, editor_textarea.value);
    }

    insertTag(event, tag_name) {
        event.preventDefault();
        let editor_textarea = document.getElementById("editor_textarea");

        let selection = null;

        if (editor_textarea.selectionStart === editor_textarea.selectionEnd)
            selection = editor_textarea.selectionStart;
        else
            selection = editor_textarea.value.slice(editor_textarea.selectionStart, editor_textarea.selectionEnd);

        if (tag_name != null && selection.length > 0)
            editor_textarea.setRangeText(`<${tag_name}>${selection}</${tag_name}>`);

        this.onChangeBookContent(event, editor_textarea.value);
    }

    render() {
        return (
            <div className="App" id="page_container">
                <div id="left_pane">
                    <span id="editor_controls">
                        <button id="bold"
                            type="submit"
                            onClick={(event) => this.insertBold(event)}
                        >
                        </button>
                        <button id="italics"
                            type="submit"
                            onClick={(event) => this.insertItalic(event)}
                        >
                        </button>
                        <button id="under"
                            type="submit"
                            onClick={(event) => this.insertUnderline(event)}
                        >
                        </button>
                        <button id="footnote"
                            type="submit"
                            onClick={(event) => this.insertFootnode(event)}
                        >
                        </button>
                    </span>

                    <textarea
                        id="editor_textarea"
                        placeholder="Type in your text here"
                        value={this.props.content}
                        rows='10'
                        onChange={(event) => this.onChangeBookContent(event, event.target.value)}
                    ></textarea>

                </div>
                <iframe title="previewer" id="left_pane" srcDoc={this.state.html_display} />
            </div>
        );
    }
}

export default ManualEditor;