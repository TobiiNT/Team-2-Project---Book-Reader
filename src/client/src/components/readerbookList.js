import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { Link } from "react-router-dom";

const ReaderBook = (props) => (
  <tr>
    <td>{props.book.book_title}</td>
    <td>{props.book.book_author}</td>
    <td>{props.book.book_publishdate}</td>
    <td>
      <Link to={"/reader/read/" + props.book._id}> <button type="button"> Read </button> </Link>
    </td>
  </tr>
);

export default class ReaderBookList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }

  // This method will get the data from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/book/")
      .then((response) => {
        this.setState({ books: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  // This method will map out the users on the table
  bookList() {
    return this.state.books.map((currentbook) => {
      return (
        <ReaderBook
          book={currentbook}
          deleteBook={this.deleteBook}
          key={currentbook._id}
        />
      );
    });
  }

  // This following section will display the table with the books of individuals.
  render() {
    return (
      <div>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Publish Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.bookList()}</tbody>
        </table>
      </div>
    );
  }
}
