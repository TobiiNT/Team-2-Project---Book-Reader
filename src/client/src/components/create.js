import React, { Component} from "react";
// This will require to npm install axios
import axios from 'axios';
import CKEditor from './ckeditor.js';

export default class Create extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);

    this.onChangeBookTitle = this.onChangeBookTitle.bind(this);
    this.onChangeBookAuthor = this.onChangeBookAuthor.bind(this);
    this.onChangeBookContent = this.onChangeBookContent.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      book_title: "",
      book_author: "",
      book_content:"",
    };
  }

  // These methods will update the state properties.
  onChangeBookTitle(e) {
    this.setState({
      book_title: e.target.value,
    });
  }

  onChangeBookAuthor(e) {
    this.setState({
      book_author: e.target.value,
    });
  }

  onChangeBookContent(data) {
    this.setState({
      book_content: data,
    });
  }

// This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();

    // When post request is sent to the create url, axios will add a new book(newbook) to the database.
    const newbook = {
        book_title: this.state.book_title,
        book_author: this.state.book_author,
        book_content: this.state.book_content,
    };

    axios
      .post("http://localhost:5000/book/add", newbook)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    this.setState({
      book_title: "",
      book_author: "",
      book_content: "",
    });
  }
  // This following section will display the form that takes the input from the user.
  render() {
    return (
      <div style={{ marginTop: 20 }} >
        <h3 align="center">Upload new book</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group" align="center">
            <input
              type="submit"
              value="Upload book"
              className="btn btn-primary"
            />
          </div>
          <div className="form-group">
            <label>Title of the book: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.book_title}
              onChange={this.onChangeBookTitle}
            />
          </div>
          <div className="form-group">
            <label>Author: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.book_author}
              onChange={this.onChangeBookAuthor}
            />
          </div>
          <div className="form-group">
            <CKEditor
              content={this.state.book_content}
              onChange={this.onChangeBookContent.bind(this)}
            />
          </div>
          
        </form>
      </div>
    );
  }
}
