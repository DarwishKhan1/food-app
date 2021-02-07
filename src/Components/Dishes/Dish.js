import React, { Component } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { withRouter } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { firestore } from "../../Firebase/FirebaseConfig";
import Rating from "../Common/Rating";

class Dish extends Component {
  state = { dish: null, loading: true, user_reviews: [], restaurant: null };
  componentDidMount() {
    firestore
      .collection("dishes")
      .doc(this.props.match.params.id)
      .get()
      .then((snapshot) => {
        this.setState({
          dish: { uid: snapshot.id, ...snapshot.data() },
        });
        firestore
          .collection("dish_reviews")
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
          .collection("restaurants")
          .doc(snapshot.data().restaurant)
          .get()
          .then((snapshot) => {
            this.setState({ restaurant: snapshot.data(), loading: false });
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

  rendorReviews = () => {
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
  render() {
    const { loading, dish, restaurant } = this.state;
    return (
      <Sidebar>
        {loading ? (
          <Spinner />
        ) : (
          <div className="singal__restaurant mb-5">
            <img src={dish.image} />
            <Rating productRating={this.getRating()} />
            <div className="d-flex justify-content-between align-items-center  mt-5">
              <div className="d-flex align-items-center ">
                <i className="fa fa-utensils" style={{ fontSize: "25px" }}></i>
                <h3 className="pl-4 pt-2">{dish.name}</h3>
              </div>

              <div>
                <p>{dish.price}</p>
              </div>
            </div>

            <p>{dish.description}</p>

            <div className="d-flex align-items-center  mt-5">
              <i className="fa fa-star" style={{ fontSize: "25px" }}></i>
              <h3 className="pl-4 pt-1">Ingardients</h3>
            </div>
            <p>{dish.ingredient}</p>

            <div className="d-flex align-items-center  mt-5">
              <i className="fa fa-info-circle" style={{ fontSize: "25px" }}></i>
              <h3 className="pl-4 pt-1">Information</h3>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h6>
                Restaurant Name:{" "}
                {restaurant ? restaurant.name : "Vendor Deleted"}
              </h6>
              <h6>Category: {dish.menu}</h6>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="font-weight-bold">
                Phone: {restaurant ? restaurant.phone : "Vendor Deleted"}
              </h5>
              <h5 className="font-weight-bold">
                Mobile Phone:{" "}
                {restaurant ? restaurant.mobile_phone : "Vendor Deleted"}
              </h5>
            </div>

            <div className="d-flex align-items-center mt-5">
              <i
                className="fa fa-star-half-alt"
                style={{ fontSize: "25px" }}
              ></i>
              <h3 className="pl-4 pt-1">Reviews</h3>
            </div>
            {this.rendorReviews()}
          </div>
        )}
      </Sidebar>
    );
  }
}

export default withRouter(Dish);
