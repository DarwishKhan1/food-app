import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Order from "./Components/Orders/Order";
import Orders from "./Components/Orders/Orders";
import Restaurant from "./Components/Restaurants/Restaurant";
import Restaurants from "./Components/Restaurants/Restaurants";
import AddRestaurant from "./Components/Restaurants/AddRestaurant";
import EditRestaurant from "./Components/Restaurants/EditRestaurant";
import Dishes from "./Components/Dishes/Dishes";
import Dish from "./Components/Dishes/Dish";
import Categories from "./Components/Categories/Categories";
import AddDish from "./Components/Dishes/AddDish";
import EditDish from "./Components/Dishes/EditDish";
import Dashboard from "./Components/Dashboard/Dashboard";
import Notifications from "./Components/Notifications/Notifications";
import RestaurantOwners from "./Components/RestaurantOwners/RestaurantOwners";
import AddRestaurantOwner from "./Components/RestaurantOwners/AddRestaurantOwner";
import { messaging } from "./Firebase/FirebaseConfig";

class App extends Component {
  state = { admin: null };
  componentDidMount() {
    messaging
      .requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then((token) => {
        localStorage.setItem("token", token);
      })
      .catch((err) => {
        console.log(err);
      });
    const admin = localStorage.getItem("admin");

    this.setState({ admin });
  }
  render() {
    return this.state.admin ? (
      <Router>
        <Switch>
          <Route exact path="/">
            <Dashboard></Dashboard>
          </Route>
          <Route exact path="/restaurant-owners">
            <RestaurantOwners></RestaurantOwners>
          </Route>
          <Route exact path="/restaurant-owners/add">
            <AddRestaurantOwner></AddRestaurantOwner>
          </Route>
          <Route exact path="/orders">
            <Orders></Orders>
          </Route>
          <Route exact path="/order/:id">
            <Order></Order>
          </Route>
          <Route exact path="/restaurants">
            <Restaurants></Restaurants>
          </Route>
          <Route exact path="/edit_restaurant/:id">
            <EditRestaurant></EditRestaurant>
          </Route>
          <Route exact path="/restaurant/:id">
            <Restaurant></Restaurant>
          </Route>
          <Route exact path="/restaurants/add">
            <AddRestaurant></AddRestaurant>
          </Route>
          <Route exact path="/dishes">
            <Dishes></Dishes>
          </Route>
          <Route exact path="/dish/:id">
            <Dish></Dish>
          </Route>
          <Route exact path="/dishes/add">
            <AddDish></AddDish>
          </Route>
          <Route exact path="/edit_dish/:id">
            <EditDish></EditDish>
          </Route>
          <Route exact path="/categories">
            <Categories></Categories>
          </Route>
          <Route exact path="/notifications">
            <Notifications></Notifications>
          </Route>
        </Switch>
      </Router>
    ) : (
      <Fragment>
        <div className="App">
          <Login />
        </div>
      </Fragment>
    );
  }
}

export default App;
