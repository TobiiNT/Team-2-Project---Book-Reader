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
        this.toLastPosition()
      })
      .catch(function (error) {
        console.log(error);
      });

      
  }
  render() {
    if (!(this.props.match.params.id in localStorage)) {
      var obj = {
        "lastPosition": 0,
        "font_size": 64,
        "font": "Calibri",
        "bookmarkList": "[]",
        "currentBookmark":"None"};
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
          <button type="button" onClick={()=>this.upBookmark()}>^</button>
          <button type="button" onClick={()=>this.toBookmark()}>Current</button>
          <button type="button" onClick={()=>this.downBookmark()}>v</button>
          <span>   BookmarkList:<span id="bookmarklist">{data.bookmarkList}</span></span>
          <span>   CurrentBookmark:<span id="currentbookmark">{data.currentBookmark}</span></span>
          <span style={{float:"right"}}>
            <button type="button" onClick={()=> this.deleteBookmark()}>DelBookMark</button>
            <button type="button" onClick={()=> this.setBookmark()}>SetBookMark</button>
            <button type="button" align="right" onClick={() => this.upTextSize()}><strong>+</strong></button>
            <button type="button" align="right" onClick={() => this.downTextSize()}><b>-</b></button>
          </span>
        </div>
        
      </div>
      <div onScroll={(e) => this.updateLastPosition()} style={{overflow:"scroll", height:"85vh"}} id="contain" >
          <div className="form-group" id="read" style={{fontSize: font_size, fontFamily:font}}
          data-toggle="collapse" data-target="#setBookmarkButton">
            <div dangerouslySetInnerHTML={{__html: this.state.book_content}} />
          </div>
      </div>
    </div>
    );
  }
  
  setBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    for(var i=0; i<=pList.length; i++){      
      if(this.isInViewport(pList[i])){
        var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
        var bookmarkList = JSON.parse(data.bookmarkList);
        bookmarkList = this.addAndSort(bookmarkList, i);
        data.bookmarkList = JSON.stringify(bookmarkList);
        data.currentBookmark = i;
        document.getElementById("bookmarklist").innerHTML = JSON.stringify(bookmarkList);
        document.getElementById("currentbookmark").innerHTML = i;
        localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
        break;
      }
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  addAndSort(arr, val) {
    if(arr.indexOf(val) === -1) {
      arr.push(val);
    }
    for (var i = arr.length - 1; i > 0 && arr[i] < arr[i-1]; i--) {
        var tmp = arr[i];
        arr[i] = arr[i-1];
        arr[i-1] = tmp;
    }
    return arr;
  }
  toBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    var pIndex = parseInt(data.currentBookmark);
    if(pIndex !== "None" && bookmarkList.length>0){
      pList[parseInt(pIndex)].scrollIntoView(); 
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  upBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    var pIndex = parseInt(data.currentBookmark);
    if(pIndex !== "None" && bookmarkList.indexOf(pIndex)>0){
      var e = (bookmarkList.indexOf(pIndex)-1);
      pList[bookmarkList[e]].scrollIntoView();
      data.currentBookmark = bookmarkList[e];
      localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
      document.getElementById("currentbookmark").innerHTML = bookmarkList[e];
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  downBookmark(){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    var pIndex = parseInt(data.currentBookmark);
    if(pIndex !== "None" && bookmarkList.indexOf(pIndex)<(bookmarkList.length-1)){
      var e = (bookmarkList.indexOf(pIndex)+1);
      pList[bookmarkList[e]].scrollIntoView();
      data.currentBookmark = bookmarkList[e];
      localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
      document.getElementById("currentbookmark").innerHTML = bookmarkList[e];
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  deleteBookmark(){
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    var pIndex = parseInt(data.currentBookmark);
    if(pIndex !== "None" && bookmarkList.length>0){
      const index = bookmarkList.indexOf(pIndex);
      var newCurrent;
      if(bookmarkList.length === 1){
        newCurrent = "None";
      }
      else if(index === (bookmarkList.length - 1)){
        newCurrent = bookmarkList[index-1];
      }
      else{
        newCurrent = bookmarkList[index+1];
      }
      data.currentBookmark = newCurrent;
      if (index > -1) {
        bookmarkList.splice(index, 1);
      }
      bookmarkList =  JSON.stringify(bookmarkList);
      data.bookmarkList = bookmarkList;
      localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
      
      document.getElementById("bookmarklist").innerHTML = data.bookmarkList;
      document.getElementById("currentbookmark").innerHTML = data.currentBookmark;
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const readRect=document.getElementById('contain').getBoundingClientRect();
    return (
      (rect.top > readRect.top && rect.top <= readRect.bottom) ||
      (rect.bottom > readRect.bottom/2)
    );
  }
  toLastPosition (){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    pList[parseInt(data.lastPosition)].scrollIntoView(); 
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  updateLastPosition () {
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    for(var i=0; i<=pList.length; i++){      
      if(this.isInViewport(pList[i])){
        var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
        data.lastPosition = JSON.stringify(i);
        localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
        break;
      }
    }
    console.log(localStorage.getItem(this.props.match.params.id));
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

    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }

  downTextSize () {
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font_size *= 0.5;
    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }
}

export default withRouter(Read);