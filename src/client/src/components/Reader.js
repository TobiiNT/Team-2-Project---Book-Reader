import React from "react"; 
import { Route } from "react-router-dom";

import Read from "./read";
import ReaderBookList from "./readerbookList";



const Reader = () => {
    return (
      <div>
        <Route exact path="/reader">
      <ReaderBookList />
        </Route>
        <Route exact path="/reader/read/:id" component={Read} />
      </div>
    );
  };


  export default Reader;