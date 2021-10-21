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
      lastClickedP: 0,
      books: [],
    };
  }
  // This will get the book based on the id from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/book/" + this.props.match.params.id)
      .then((response) => {
        let arrays = response.data.book_content.split('\n');
        let paragraphtext = "";
        arrays.forEach(element => {
            paragraphtext += '<p>' + element + '</p>'
        });

        this.setState({
          book_title: response.data.book_title,
          book_author: response.data.book_author,
          book_content: paragraphtext,
          book_publishdate: response.data.book_publishdate,
        });
        this.toLastPosition();
        this.changeBookMarkList(JSON.parse(JSON.parse(localStorage.getItem(this.props.match.params.id)).bookmarkList))
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
        "bookmarkList": "{}"};
      localStorage.setItem(this.props.match.params.id, JSON.stringify(obj));
    } 
    let data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    let font = data.font;
    let font_size=data.font_size;
    return (
    <div>
      <div>
        <div>
          <button type="button" onClick={() => this.updateFont( "Times New Roman")}>TimesNewRoman</button>
          <button type="button" onClick={() => this.updateFont( "Calibri")}>Calibri</button>
          <span style={{float:"right"}}>
            <button type="button" onClick={()=> this.setBookmark()} id="setbookmark">SetBookMark({this.state.lastClickedP})</button>
            <button type="button" align="right" onClick={() => this.upTextSize()}><strong>+</strong></button>
            <button type="button" align="right" onClick={() => this.downTextSize()}><b>-</b></button>
          </span>
        </div>
        <div align="right">
          <button type="button" onClick={()=>this.showList()} id="showlist">Bookmark list v</button>
          <div><table id="bookmarklistbutton" style={{display:"none"}}></table></div>
        </div>
      </div>
      <div onScroll={(e) => this.updateLastPosition()} style={{overflow:"scroll", height:"85vh"}} id="contain" onClick={(event) => this.getClickedP(event)} >
          <div className="form-group" id="read" style={{fontSize: font_size, fontFamily:font}}
          data-toggle="collapse" data-target="#setBookmarkButton">
            <div dangerouslySetInnerHTML={{__html: this.state.book_content}} />
          </div>
      </div>
    </div>
    );
  }

  /**--------------------------------
   * Sessions for operating features*
   ---------------------------------*/

  //Show bookmarks set///////////////////////////////////////////////////////////////////
  showList(){
    var x = document.getElementById("bookmarklistbutton");
    if (x.style.display === "none") {
      x.style.display = "table";
      document.getElementById("showlist").innerHTML = "Bookmark list ^";
    } else {
      x.style.display = "none";
      document.getElementById("showlist").innerHTML = "Bookmark list v";
    }
  }

  //Get index of the clicked paragraph///////////////////////////////////////////////////
  getClickedP(event) {
    var clickX= event.clientX;
    var clickY= event.clientY;
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    for(var i=0; i<=pList.length; i++){      
      if(this.isClicked(pList[i],clickX,clickY)){
        this.setState({lastClickedP:i});
        break;
      }
    }
  }

  //Check if a paragraph is clicked//////////////////////////////////////////////////////
  isClicked(element,X,Y){
    if (element != null) {
      const rect = element.getBoundingClientRect();
      return (rect.top<=Y && rect.bottom>Y && rect.left<=X && rect.right>=X)
    }
  }

  //Set bookmark/////////////////////////////////////////////////////////////////////////
  setBookmark(){
    var name = prompt("Please enter the name of your bookmark","");
    if(name == null){return}
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList); 
    bookmarkList = this.addAndSort(bookmarkList, this.state.lastClickedP, name);
    data.bookmarkList = JSON.stringify(bookmarkList);
    //document.getElementById("bookmarklist").innerHTML = JSON.stringify(bookmarkList);
    this.changeBookMarkList(bookmarkList);
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  //Addition for setBookmark()
  addAndSort(bookmarkList, index, name) {
    var sortList = {};
    bookmarkList[index] = name;
    let keys = Object.keys(bookmarkList);
    keys.sort()
    for (var i = 0; i < keys.length; i++) {
      sortList[keys[i]] = bookmarkList[keys[i]];
    }
    return sortList;
  }

  //Make change on bookmark list when delete/add/////////////////////////////////////////
  changeBookMarkList(bookmarkList){
    let area = document.getElementById("bookmarklistbutton");
    while (area.firstChild) {
      area.firstChild.remove()
    }
    for (let key in bookmarkList){
      var bookmark = document.createElement("tr");
      var bookmarkInfo = document.createElement("td");
      bookmarkInfo.innerHTML = "Paragraph "+key+"| Note: "+bookmarkList[key];
      bookmarkInfo.style.backgroundColor = "yellow";
      bookmarkInfo.addEventListener("click", () => this.toBookmark(key));
      bookmark.appendChild(bookmarkInfo);
      var Option2 = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.style.backgroundColor = "red";
      deleteButton.addEventListener("click", () => this.deleteBookmark(key));
      Option2.appendChild(deleteButton)
      bookmark.appendChild(Option2)
      //btn.onClick = (e) => this.tooBookmark();
      area.appendChild(bookmark);  
    }
  }

  //To a bookmark////////////////////////////////////////////////////////////////////////
  toBookmark(index){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    if(index !== "None" && Object.keys(bookmarkList).length>0){
      pList[parseInt(index)].scrollIntoView();
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }
  
  //Delete a bookmark////////////////////////////////////////////////////////////////////
  deleteBookmark(pIndex){
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    var bookmarkList = JSON.parse(data.bookmarkList);
    var currentIndex = parseInt(data.currentBookmark);
    if(pIndex !== "None" && Object.keys(bookmarkList).length>0 && Object.keys(bookmarkList).indexOf(pIndex)>-1){
      if (currentIndex === parseInt(pIndex)){
        var newCurrent;
        const index = Object.keys(bookmarkList).indexOf(pIndex);
        if(Object.keys(bookmarkList).length === 1){
          newCurrent = "None";
        }
        else if(index === (Object.keys(bookmarkList).length - 1)){
          newCurrent = Object.keys(bookmarkList)[index-1];
        }
        else{
          newCurrent = Object.keys(bookmarkList)[index+1];
        }
        data.currentBookmark = newCurrent;
      }
      delete bookmarkList[pIndex];
      this.changeBookMarkList(bookmarkList);
      data.bookmarkList = JSON.stringify(bookmarkList);
      localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
      
    }
    console.log(localStorage.getItem(this.props.match.params.id));
  }

  //Check if an element is in sight(specific for paragraphs/elements in content viewer only)////////////
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const readRect=document.getElementById('contain').getBoundingClientRect();
    return (
      (rect.top > readRect.top && rect.top <= readRect.bottom) ||
      (rect.bottom > readRect.bottom/2)
    );
  }

  //Scroll to last autosave position
  toLastPosition (){
    var ele = document.getElementById('contain');
    var pList = ele.getElementsByTagName('p');
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    pList[parseInt(data.lastPosition)].scrollIntoView(); 
    console.log(localStorage.getItem(this.props.match.params.id));
  }

  //Autosave the last position///////////////////////////////////////////////////////////
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

  //Update font//////////////////////////////////////////////////////////////////////////
  updateFont (font) {
    var ele = document.getElementById('read');
    ele.style.fontFamily = font;
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font = font;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
  }
  
  //Increase text font size++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  upTextSize () {
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font_size *= 2;

    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }

  //Reduce text font size----------------------------------------------------------------
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