import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class CkEditor extends Component {
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

    render() {
        return (
            <div className="App">
                <CKEditor
                    editor={ ClassicEditor }
                    data= { this.props.content }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.onChangeBookContent(data);
                    } }
                />
            </div>
        );
    }
}

export default CkEditor;