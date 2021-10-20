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

  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    if (!(this.props.match.params.id in localStorage)) {
      var obj = {
        "scroll": "0px",
        "font_size": 64,
        "font": "Calibri",
        "bookmark": "0px"};
      localStorage.setItem(this.props.match.params.id, JSON.stringify(obj));
    } 
    let data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    let st = data.scroll;
    let font = data.font;
    let font_size=data.font_size;
    return (
    <div>
      <div>
        <div>
          <button type="button" onClick={() => this.updateFont( "Times New Roman")}>TimesNewRoman</button>
          <button type="button" onClick={() => this.updateFont( "Calibri")}>Calibri</button>
          <span style={{float:"right"}}>
            <button type="button" onClick={()=> this.setBookmark()}>Set bookmark</button>
            <button type="button" align="right" onClick={() => this.upTextSize()}><strong>+</strong></button>
            <button type="button" align="right" onClick={() => this.downTextSize()}><b>-</b></button>
          </span>
          <div>
            <button type="button" align="right" onClick={()=>this.toBookmark()}>To last saved bookmark</button>
          </div>
        </div>
        
      </div>
      <div ref={(e) => this.setScrollTop(st, e)} onScroll={(e) => this.updateScrollTop()} style={{overflow:"scroll", height:"45vw"}} id="contain" >
          <div className="form-group" id="read" style={{fontSize: font_size, fontFamily:font}}
          data-toggle="collapse" data-target="#setBookmarkButton">
            <div dangerouslySetInnerHTML={{__html: this.state.book_content}} />
          </div>
      </div>
    </div>
    );
  }
  setScrollTop (st){
    document.getElementById('contain').scrollTop = st;
  }
  updateScrollTop (id) {
    var ele = document.getElementById('contain');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.scroll = ele.scrollTop;
    localStorage.setItem(id, JSON.stringify(data));
  }
  setBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    for(var i=0; i<=pList.length; i++){      
      if(this.isInViewport(pList[i])){
        var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
        data.bookmark = i;
        console.log(data);
        localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
        break;
      }
    }
  }
  toBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var pIndex = parseInt(data.bookmark);
    console.log(pIndex);
    pList[pIndex].scrollIntoView(); 
  }
  updateScrollTop () {
    var ele = document.getElementById('contain');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.scroll = ele.scrollTop;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
  }
  updateFont (font) {
    var ele = document.getElementById('read');
    ele.style.fontFamily = font;
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font = font;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
  }
  
  upTextSize () {
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font_size *= 2;

    data.bookmark *= 2;
    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }

  downTextSize () {
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font_size *= 0.5;
    data.bookmark *=0.5;
    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}


// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our books.

export default withRouter(Read);
