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
          book_content: response.data.book_content,
          book_publishdate: response.data.book_publishdate,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <MarkdownArea 
              content={this.state.book_content}
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
