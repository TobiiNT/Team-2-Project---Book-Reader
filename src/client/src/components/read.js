import React,  {Component}  from "react";
// This will require to npm install axios
import axios from "axios";
import { withRouter } from "react-router";
import MarkdownArea from "./markdownarea";

class Read extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);

    this.state = {
      book_title: "",
      book_author: "",
      book_content: "",
      book_publishdate: "",
      text_size: 0,
      books: [],
    };
  }
  
  uploadTextSize() {
    const newEditedbook = {
      book_title: this.state.book_title,
      book_author: this.state.book_author,
      book_publishdate: this.state.book_publishdate,
      book_content: this.state.book_content,
      text_size: this.state.text_size,
    };

    axios
      .post(
        "http://localhost:5000/update/" + this.props.match.params.id,
        newEditedbook
      )
  }
  // This will get the book based on the id from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/book/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          book_title: response.data.book_title,
          book_author: response.data.book_author,
          book_content: response.data.book_content,
          book_publishdate: response.data.book_publishdate,
          text_size: response.data.text_size,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  increaseTextSize() {
    axios
      .get("http://localhost:5000/book/" + this.props.match.params.id)
      .then((response) => {
        var TextSize = response.data.text_size;
        TextSize+=10;
        this.setState({
          text_size: TextSize,
        });
        this.uploadTextSize();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  decreaseTextSize() {
    axios
      .get("http://localhost:5000/book/" + this.props.match.params.id)
      .then((response) => {
        var TextSize = response.data.text_size;
        TextSize-=10;
        this.setState({
          text_size: TextSize,
        });
        this.uploadTextSize();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getTextSize() {
    return ("--default-size "+toString(this.text_size));
  }

  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
      <div>
        <div>
          <button 
          type="button"
          onClick={() => {
            this.increaseTextSize();
          }}>+</button>
          <button
          type="button"
          onClick={() => {
            this.decreaseTextSize();
          }}>-</button>
        </div>
        <form>
          <div className="form-group">
            <MarkdownArea content={this.state.book_content} size={this.state.text_size}
            />
          </div>
        </form>
      </div>
    );
  }
}

// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our books.

export default withRouter(Read);
