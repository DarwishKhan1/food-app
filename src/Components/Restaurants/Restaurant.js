import React, { Component } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { withRouter } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { firestore } from "../../Firebase/FirebaseConfig";
import Rating from "../Common/Rating";

class Restaurant extends Component {
  state = { restaurant: null, loading: true, user_reviews: [], dishes: [] };
  componentDidMount() {
    firestore
      .collection("restaurants")
      .doc(this.props.match.params.id)
      .get()
      .then((snapshot) => {
        this.setState({
          restaurant: { uid: snapshot.id, ...snapshot.data() },
        });
        firestore
          .collection("restaurant_reviews")
          .doc(snapshot.id)
          .collection("user_reviews")
          .get()
          .then((snapshot) => {
            let reviews = [];
            snapshot.docs.map((rev) => {
              reviews.push({ uid: rev.id, ...rev.data() });
            });
            this.setState({ user_reviews: reviews });
          })
          .catch((err) => {
            this.setState({ loading: false });
            alert(err.message);
          });

        firestore
          .collection("dishes")
          .get()
          .then((snapshot) => {
            let dishes = [];
            snapshot.docs.map((rev) => {
              dishes.push({ uid: rev.id, ...rev.data() });
            });
            this.setState({ dishes, loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false });
            alert(err.message);
          });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert(err.message);
      });
  }

  getRating = () => {
    let totalRating = 0;
    let totalprdrating = 0;
    const { user_reviews } = this.state;
    user_reviews.length > 0 &&
      user_reviews.map((rat, i) => {
        totalprdrating = i + 1;
        return (totalRating = totalRating + parseFloat(rat.stars));
      });

    if ((totalRating / totalprdrating).toString() === "NaN") {
      return 0;
    } else {
      return totalRating / totalprdrating;
    }
  };

  rendorDishses = (id) => {
    const dishes = this.state.dishes.filter((dish) => dish.restaurant === id);

    return (
      <div className="row">
        {dishes.length > 0 ? (
          dishes.map((dish) => {
            return (
              <div className="col-sm-3">
                <div className="singal__dish">
                  <img src={dish.image} />

                  <div className="d-flex justify-content-between align-items-center px-1">
                    <h5>{dish.name}</h5>
                    <h5>$ {dish.price}</h5>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <h5 className="d-flex justify-content-center align-items-center">
              <span>There is no dishes</span>
            </h5>
          </div>
        )}
      </div>
    );
  };

  rendorReviewa = () => {
    const { user_reviews } = this.state;
    return user_reviews.length > 0 ? (
      user_reviews.map((rev) => (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="singal__review">
              <div className="d-flex">
                <img src={rev.user_image} />
                <h5 className="p-2 font-weight-bold">{rev.user_name}</h5>
              </div>

              <p>{rev.review}</p>
            </div>
            <p>
              <span className="badge badge-dark">
                {rev.stars} <i className="fa fa-star"></i>
              </span>
            </p>
          </div>
        </div>
      ))
    ) : (
      <h5 className="d-flex justify-content-center align-items-center">
        <span>There is no reviews</span>
      </h5>
    );
  };

  restaurantStatusClicked = (status, id) => {
    firestore
      .collection("restaurants")
      .doc(id)
      .update({ status: !status })
      .then((res) => {
        alert("Updated")
        const rest = { ...this.state.restaurant };
        rest.status = !status;
        this.setState({
          restaurant: rest,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  render() {
    const { loading, restaurant } = this.state;
    return (
      <Sidebar>
        {loading ? (
          <Spinner />
        ) : (
          <div className="singal__restaurant mb-5">
            <img src={restaurant.image} />
            <Rating productRating={this.getRating()} />
            <div className="d-flex align-items-center">
              <i className="fa fa-utensils" style={{ fontSize: "25px" }}></i>
              <h3 className="pl-4 pt-2">{restaurant.name}</h3>
            </div>

            <p>{restaurant.description}</p>

            <div className="d-flex align-items-center  mt-5">
              <i className="fa fa-info-circle" style={{ fontSize: "25px" }}></i>
              <h3 className="pl-4 pt-1">Information</h3>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h5 className="font-weight-bold">Phone: {restaurant.phone}</h5>
              <h5 className="font-weight-bold">
                Mobile Phone: {restaurant.mobile_phone}
              </h5>
            </div>

            <button
              className={
                restaurant.status ? "success__status" : "danger__status"
              }
              onClick={() =>
                this.restaurantStatusClicked(restaurant.status, restaurant.uid)
              }
            >
              {restaurant.status ? "Enabled" : "Disabled"}
            </button>

            <div className="d-flex align-items-center mt-5">
              <i className="fa fa-star" style={{ fontSize: "25px" }}></i>
              <h3 className="pl-4 pt-1">Dishes</h3>
            </div>

            {this.rendorDishses(restaurant.uid)}

            <div className="d-flex align-items-center mt-5">
              <i
                className="fa fa-star-half-alt"
                style={{ fontSize: "25px" }}
              ></i>
              <h3 className="pl-4 pt-1">Reviews</h3>
            </div>
            {this.rendorReviewa()}
          </div>
        )}
      </Sidebar>
    );
  }
}

export default withRouter(Restaurant);
