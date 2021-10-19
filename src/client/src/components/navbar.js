import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
import BookImg from "./styles/book.png";
// Here, we display our Navbar
const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <img src = {BookImg} 
            alt = "BookIcon"
            id = "booklogo" />
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <NavLink className="nav-link" to="/">Home <span className="sr-only">(current)</span></NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/Writer">Writer</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/Reader">Reader</NavLink>
      </li>
      <li className="nav-item">
      <NavLink className="nav-link" to="/writer/create">Create New Book</NavLink>
      </li>
    </ul>
  </div>
</nav>
    </div>
  );
};

export default Navbar;
