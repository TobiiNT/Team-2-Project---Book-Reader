import React from "react"; 
import { Route } from "react-router-dom";
import Read from "./read";
import Edit from "./edit";
import Create from "./create";
import WriterBookList from "./writerbookList";


const Writer = () => {
    return (
      <div>
        <Route exact path="/writer">
          <WriterBookList />  
        </Route>
        <Route path="/writer/read/:id" component={Read} />
        <Route path="/writer/edit/:id" component={Edit} />
        <Route path="/writer/create/"> 
         <Create/>
        </Route>
      </div>
    );
  };


  export default Writer;