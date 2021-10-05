import React,  {Component}  from "react";
// This will require to npm install axios
import axios from "axios";
import { withRouter } from "react-router";
import { TextField } from "@material-ui/core";

class Edit extends Component {
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
      book_publishdate: "",
      book_content: "",
      books: [],
    };
  }
  // This will get the book based on the id from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/book/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          book_title: response.data.book_title,
          book_author: response.data.book_author,
          book_publishdate: response.data.book_publishdate,
          book_content: response.data.book_content,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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

  onChangeBookContent(e) {
    this.setState({
      book_content: e.target.value,
    });
  }

  // This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();
    const newEditedbook = {
      book_title: this.state.book_title,
      book_author: this.state.book_author,
      book_publishdate: this.state.book_publishdate,
      book_content: this.state.book_content,
    };
    console.log(newEditedbook);

    // This will send a post request to update the data in the database.
    axios
      .post(
        "http://localhost:5000/update/" + this.props.match.params.id,
        newEditedbook
      )
      .then((res) => console.log(res.data));

    this.props.history.push("/");
  }

  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
      <div>
        <h3 align="center">Update Book</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group" align="center">
            <input
              type="submit"
              value="Update book"
              className="btn btn-primary"
            />
          </div>
          <div className="form-group">
            <label>Book title: </label>
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
            <label>Content: </label>
            <TextField
              multiline={true}
              type="text"
              className="form-control"
              value={this.state.book_content}
              onChange={this.onChangeBookContent}
            />
          </div>
        </form>
      </div>
    );
  }
}

// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our books.

export default withRouter(Edit);
