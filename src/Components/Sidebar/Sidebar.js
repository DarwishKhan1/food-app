import React, { Component } from "react";
import logo from "../../Assets/logo.png";
import home from "../../Assets/Icons/home.png";
import food from "../../Assets/Icons/food.svg";
import { Link, withRouter, NavLink } from "react-router-dom";

class Sidebar extends Component {
  logout = () => {
    localStorage.removeItem("admin");
    window.location.reload();
  };

  render() {
    return (
      <div className="navbar__container">
        <div className="nav_icon">
          <i className="fa fa-bars" aria-hidden="true"></i>
        </div>

        <main className="main-section">{this.props.children}</main>

        <div id="sidebar">
          <div className="sidebar__title">
            <div className="sidebar__img">
              <Link to="/vendor/" className="link">
                <img src={logo}></img>

                <h3>Food Delivery </h3>
              </Link>
            </div>
            <i className="fa fa-times" id="sidebarIcon" aria-hidden="true"></i>
          </div>

          <div className="sidebar__menu">
            <NavLink
              className="sidebar__link"
              to="/"
              activeClassName="active_menu_link"
              exact
            >
              <img src={home} />
              Dashboard
            </NavLink>
            <NavLink
              className="sidebar__link"
              to="/restaurant-owners"
              activeClassName="active_menu_link"
              exact
            >
              <i className="fa fa-user"></i>
              Restaurant Owners
            </NavLink>
            <NavLink
              className="sidebar__link"
              to="/orders"
              activeClassName="active_menu_link"
              exact
            >
              <img src={food} />
              Orders
            </NavLink>

            <NavLink
              className="sidebar__link"
              to="/restaurants"
              activeClassName="active_menu_link"
              exact
            >
              <i className="fa fa-utensils"></i>
              Resturants
            </NavLink>
            <NavLink
              className="sidebar__link"
              to="/dishes"
              activeClassName="active_menu_link"
              exact
            >
              <i className="fa fa-check-circle"></i>
              Dishes
            </NavLink>
            <NavLink
              className="sidebar__link"
              to="/categories"
              activeClassName="active_menu_link"
              exact
            >
              <i className="fa fa-list"></i>
              Categories
            </NavLink>
            <NavLink
              className="sidebar__link"
              to="/notifications"
              activeClassName="active_menu_link"
              exact
            >
              <i className="fa fa-bell"></i>
              Notifications
            </NavLink>

            <div className="sidebar__logout" onClick={this.logout}>
              <i className="fa fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
