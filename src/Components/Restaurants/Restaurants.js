import React, { Component } from "react";
import { firestore } from "../../Firebase/FirebaseConfig";
import Spinner from "../Common/Spinner";
import { deleteRestaurant, getRestaurantUserReviews } from "../Common/Firebase";
import Sidebar from "../Sidebar/Sidebar";
import { withRouter, Link } from "react-router-dom";

class Restaurants extends Component {
  state = { restaurents: [], loading: true, lastRestaurant: 0 };

  async componentDidMount() {
    firestore
      .collection("restaurants")
      .limit(5)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          let restaurents = [];
          snapshot.docs.map(async (rest) => {
            restaurents.push({ uid: rest.id, ...rest.data() });
          });
          const lastRestaurant = snapshot.docs[snapshot.docs.length - 1];
          this.setState({ restaurents, loading: false, lastRestaurant });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert(err.message);
      });
  }

  restaurantClicked = (id) => {
    this.props.history.push(`/restaurant/${id}`);
  };

  editRestaurant = (id) => {
    this.props.history.push(`/edit_restaurant/${id}`);
  };

  delete = async (id) => {
    try {
      this.setState({
        loading: true,
      });
      await deleteRestaurant(id);
      const restaurents = this.state.restaurents.filter(
        (rest) => rest.restaurant_id !== id
      );
      this.setState({
        loading: false,
        restaurents,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      alert(error.message);
    }
  };

  fetchMore = () => {
    firestore
      .collection("restaurants")
      .startAfter(this.state.lastRestaurant)
      .limit(5)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          let restaurents = [];
          snapshot.docs.map(async (rest) => {
            restaurents.push({ uid: rest.id, ...rest.data() });
          });
          const lastRestaurant = snapshot.docs[snapshot.docs.length - 1];
          const oldRestaurants = [...this.state.restaurents];
          this.setState({
            restaurents: [...oldRestaurants, ...restaurents],
            loading: false,
            lastRestaurant,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert(err.message);
      });
  };
  render() {
    return (
      <Sidebar>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div>
            <button className="add__restaurant__button">
              <Link to="/restaurants/add">Add Restaurant</Link>
            </button>
            {this.state.restaurents.map((restaurant) => {
              return (
                <div key={restaurant.uid} className="restaurant__list__item">
                  <span onClick={() => this.restaurantClicked(restaurant.uid)}>
                    <img src={restaurant.image} />

                    <div className="row justify-content-between px-4 mb-3 mt-1">
                      <h3 className="pl-1 pt-1">{restaurant.name}</h3>
                      <button
                        className={
                          restaurant.status
                            ? "success__status"
                            : "danger__status"
                        }
                      >
                        {restaurant.status ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    <div className="row justify-content-between px-4">
                      <div>
                        <p>{restaurant.address}</p>
                        <p>{restaurant.mobile_phone}</p>
                      </div>
                      <div></div>
                    </div>
                  </span>

                  <div className="row justify-content-between px-4 mb-3 mt-1">
                    <button className="btn btn-primary">Dishes List</button>
                    <button
                      className="btn btn-success"
                      onClick={() => this.editRestaurant(restaurant.uid)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => this.delete(restaurant.uid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="text-center my-3 pb-5">
              <button onClick={this.fetchMore} className="btn btn-primary px-5">
                More Restaurants
              </button>
            </div>
          </div>
        )}
      </Sidebar>
    );
  }
}

export default withRouter(Restaurants);
