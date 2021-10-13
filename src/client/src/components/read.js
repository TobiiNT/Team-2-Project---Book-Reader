import React,  {Component}  from "react";
// This will require to npm install axios
import axios from "axios";
import { withRouter } from "react-router";

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
  render() {
    if (!(this.props.match.params.id in localStorage)) {
      localStorage.setItem(this.props.match.params.id, "0px");
    } 
    let st = localStorage.getItem(this.props.match.params.id);
    console.log(st);
    return (
      <div ref={(e) => this.func6(st, e)} onScroll={(e) => this.func5(this.props.match.params.id, e)} style={{overflow:"scroll", height:"45vw"}} id="contain" >
          <div className="form-group" id="read" style={{fontSize:"50px",fontFamily:"Calibri"}}>
            <div dangerouslySetInnerHTML={{__html: this.state.book_content}} />
          </div>
      </div>
    );
  }
  func6(st){
    document.getElementById('contain').scrollTop = st;
  }
  func5 (id) {
    var ele = document.getElementById('contain');
    localStorage.setItem(id, ele.scrollTop);
    console.log(ele.scrollTop);
  }
  
}

// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our books.

export default withRouter(Read);
