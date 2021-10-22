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
        this.highlightLocalStorageSelection();
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
    <div style={{backgroundColor:"rgba(150,165,35,0.5)"}}>
      <div id="extraNote" style={{position:"fixed", bottom: "50%", padding:"10px", maxWidth:"25%", overflow:"auto", display:"none", backgroundColor:"rgba(127,143,63,0.9)", border:"2px solid black"}}>
        <span>Bookmark</span><br/>
        <button type="button" style={{backgroundColor:"rgba(255,0,0,0.5)"}} onClick={() => this.deleteBookmark(-1)}>X</button>
      </div>
      <div>
        <div>
        <label for="font">Font: &nbsp;</label>
        <select name="font" id="font" onChange={() => this.updateFont(document.getElementById('font').value)}>
          <option value="Calibri">Calibri</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        &nbsp;
        <label>Font size: {font_size} &nbsp;</label>
            <button type="button" align="right" onClick={() => this.upTextSize()}><strong>+</strong></button>
            <button type="button" align="right" onClick={() => this.downTextSize()}><b>-</b></button>
          <span style={{float:"right"}}>
            <button type="button" align="right" onClick={() => this.highlightSelection()}><b>Highlight</b></button>
          </span>
        </div>
        <br/>
        <div align="right">
          <button type="button" onClick={()=> this.setBookmark()} id="setbookmark">SetBookMark({this.state.lastClickedP})</button>
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

 highlightRange(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
       "style",
       "background-color: yellow; display: inline;"
    );
    
    range.surroundContents(newNode);
}


 highlightSelection() {
  var selection = window.getSelection && window.getSelection();
   
   if (selection && selection.rangeCount > 0)
   {
    var userSelection = window.getSelection().getRangeAt(0);
    var safeRanges = this.getSafeRanges(userSelection);
    
    localStorage.setItem('highlight', safeRanges);

    for (var i = 0; i < safeRanges.length; i++) {
        this.highlightRange(safeRanges[i]);
    }
   }
    
  }

  highlightLocalStorageSelection() {
    var safeRanges = localStorage.getItem('highlight');
    for (var i = 0; i < safeRanges.length; i++) {
        this.highlightRange(safeRanges[i]);
    }
  }

 getSafeRanges(dangerous) {
   var response = null;
    var a = dangerous.commonAncestorContainer;
    // Starts -- Work inward from the start, selecting the largest safe range
    var s = new Array(0), rs = new Array(0);
    if (dangerous.startContainer != a)
        for(var i = dangerous.startContainer; i != a; i = i.parentNode)
            s.push(i)
    ;
    if (0 < s.length) for(var i = 0; i < s.length; i++) {
        var xs = document.createRange();
        if (i) {
            xs.setStartAfter(s[i-1]);
            xs.setEndAfter(s[i].lastChild);
        }
        else {
            xs.setStart(s[i], dangerous.startOffset);
            xs.setEndAfter(
                (s[i].nodeType == Node.TEXT_NODE)
                ? s[i] : s[i].lastChild
            );
        }
        rs.push(xs);
    }

    // Ends -- basically the same code reversed
    var e = new Array(0), re = new Array(0);
    if (dangerous.endContainer != a)
        for(var i = dangerous.endContainer; i != a; i = i.parentNode)
            e.push(i)
    ;
    if (0 < e.length) for(var i = 0; i < e.length; i++) {
        var xe = document.createRange();
        if (i) {
            xe.setStartBefore(e[i].firstChild);
            xe.setEndBefore(e[i-1]);
        }
        else {
            xe.setStartBefore(
                (e[i].nodeType == Node.TEXT_NODE)
                ? e[i] : e[i].firstChild
            );
            xe.setEnd(e[i], dangerous.endOffset);
        }
        re.unshift(xe);
    }

    // Middle -- the uncaptured middle
    if ((0 < s.length) && (0 < e.length)) {
        var xm = document.createRange();
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    }
    else {
        return [dangerous];
    }

    // Concat
    rs.push(xm);
    response = rs.concat(re);    

    // Send to Console
    return response;
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

    if (this.state.lastClickedP === parseInt(data.lastPosition)){
      document.getElementById("extraNote").style.display = "block";
      document.getElementById("extraNote").firstChild.innerHTML = "|Note: "+bookmarkList[this.state.lastClickedP];
    }

    data.bookmarkList = JSON.stringify(bookmarkList);
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
      bookmarkInfo.style.backgroundColor = "rgba(150,165,35,0.25)";
      bookmarkInfo.addEventListener("click", () => this.toBookmark(key));
      bookmarkInfo.style.cursor = "pointer";
      bookmark.appendChild(bookmarkInfo);
      var Option2 = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.style.backgroundColor = "rgba(200,0,0,0.5)";
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
    if (pIndex === -1){ //-1 is extra note
      pIndex = data.lastPosition;
    }
    if (pIndex === data.lastPosition){
      document.getElementById("extraNote").style.display = "none";
    }
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
        var bookmarkList = JSON.parse(data.bookmarkList);
        localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
        if(bookmarkList[i] !== undefined){
          document.getElementById("extraNote").firstChild.innerHTML = "|Note: "+bookmarkList[i];
          document.getElementById("extraNote").style.display = "block";
        }
        else{
          document.getElementById("extraNote").style.display = "none";
        }
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
    data.font_size += 1;

    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }

  //Reduce text font size----------------------------------------------------------------
  downTextSize () {
    var data = JSON.parse(localStorage.getItem(this.props.match.params.id));
    data.font_size -= 1;
    var ele = document.getElementById('read');
    ele.style.fontSize = data.font_size;
    localStorage.setItem(this.props.match.params.id, JSON.stringify(data));
    window.location.reload();
  }
}

export default withRouter(Read);
