import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { Link } from "react-router-dom";

const Book = (props) => (
  <tr>
    <td>{props.book.book_title}</td>
    <td>{props.book.book_author}</td>
    <td>{props.book.book_publishdate}</td>
    <td>
      <Link to={"/read/" + props.book._id}> <button type="button"> Read </button> </Link>
      <Link to={"/edit/" + props.book._id}> <button type="button"> Edit </button> </Link>
      <button type="button" href="/"
        onClick={() => {
          props.deleteBook(props.book._id);
        }} > Delete </button>
    </td>
  </tr>
);

export default class BookList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.deleteBook = this.deleteBook.bind(this);
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

  // This method will delete a book based on the method
  deleteBook(id) {
    axios.delete("http://localhost:5000/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      book: this.state.books.filter((el) => el._id !== id),
    });
  }

  // This method will map out the users on the table
  bookList() {
    return this.state.books.map((currentbook) => {
      return (
        <Book
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
