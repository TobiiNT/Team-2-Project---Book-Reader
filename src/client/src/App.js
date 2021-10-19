import React from "react";

// We use Route in order to define the different routes of our application
// We import all the components we need in our app
import {Switch,Route} from "react-router-dom";

import Reader from "./components/Reader";
import Writer from "./components/Writer";
import Navbar from "./components/navbar";
const App = () => {
  return (
    <div >
     <Navbar/>
      <Switch>
    <Route exact path="/">
    <h1 align="center" >Welcome To E-Book Reader</h1>
    <h2 align="center" > Please choose your user role</h2>
    </Route>
    <Route path="/Reader">
        <Reader/>
    </Route>
    <Route path="/Writer">
        <Writer/>
    </Route>
    </Switch>
    </div>
  );
};

/*
const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/">
        <RecordList />
      </Route>
      
      <Route path="/edit/:id" component={Edit} />
      <Route path="/create">
        <Create />
      </Route>
    </div>
  );
};
*/

export default App;
