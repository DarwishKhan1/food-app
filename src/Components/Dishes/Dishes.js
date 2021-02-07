import React, { Component } from "react";
import { firestore } from "../../Firebase/FirebaseConfig";
import Sidebar from "../Sidebar/Sidebar";
import { withRouter, Link } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { deleteDish } from "../Common/Firebase";

class Dishes extends Component {
  state = {
    dishes: [],
    restaurents: [],
    restaurent: null,
    loading: true,
    name: "",
  };

  componentDidMount() {
    firestore
      .collection("dishes")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          let dishes = [];
          snapshot.docs.map((dish) => {
            dishes.push({ uid: dish.id, ...dish.data() });
          });
          this.setState({ dishes });
        }
        firestore
          .collection("restaurants")
          .get()
          .then((snapshot) => {
            let restaurents = [];
            snapshot.docs.map((rest) => {
              restaurents.push({ uid: rest.id, ...rest.data() });
            });
            this.setState({ restaurents, loading: false });
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

  handleChange = (e) => {
    this.setState({
      restaurent: e.target.value,
    });
  };

  dishClicked = (id) => {
    this.props.history.push(`/dish/${id}`);
  };
  delete = async (id) => {
    this.setState({ loading: true });

    try {
      await deleteDish(id);
      const dishes = this.state.dishes.filter((dish) => dish.id !== id);
      this.setState({
        dishes,
        loading: false,
      });
    } catch (error) {
      this.setState({ loading: false });
      alert(error.message);
    }
  };

  editDish = (id) => {
    this.props.history.push(`/edit_dish/${id}`);
  };

  render() {
    const { dishes: allDishes, restaurent, name } = this.state;

    let filterdDishes = allDishes;
    if (restaurent) {
      filterdDishes = allDishes.filter(
        (dish) => dish.restaurant === restaurent
      );
    }

    if (name) {
      const searchedDishes = filterdDishes.filter(
        (dish) =>
          dish.name &&
          dish.name.toLowerCase().includes(this.state.name.toLowerCase(), 0)
      );
      filterdDishes = searchedDishes;
    }

    return (
      <Sidebar>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div>
            <button className="add__restaurant__button">
              <Link to="/dishes/add">Add Dish</Link>
            </button>
            <div className="form-group row mt-3 px-2">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Select Resturant:
              </label>
              <div className="col-sm-10">
                <select
                  name="restaurent"
                  onChange={this.handleChange}
                  className="form-control"
                >
                  {" "}
                  <option>Search Restaurant</option>
                  {this.state.restaurents.map((e) => (
                    <option value={e.uid}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group row mt-3 px-2">
              <label
                htmlFor="inputPassword"
                className="col-sm-2 col-form-label"
              >
                Search Dish:
              </label>
              <div className="col-sm-10">
                <input
                  name="restaurent"
                  onChange={(e) => this.setState({ name: e.target.value })}
                  placeholder="Search Dish By Name"
                  className="form-control"
                />
              </div>
            </div>
            {filterdDishes.map((dish) => {
              return (
                <div key={dish.id} className="restaurant__list__item">
                  <span onClick={() => this.dishClicked(dish.id)}>
                    <img src={dish.image} />

                    <div className="row justify-content-between px-4 mb-3 mt-1">
                      <h3 className="pl-1 pt-1">{dish.name}</h3>
                    </div>

                    <div className="row justify-content-between px-4">
                      <p>{dish.description}</p>

                      <p>{dish.price}</p>
                    </div>
                  </span>

                  <div className="row justify-content-between px-4 mb-3 mt-1">
                    <button
                      className="btn btn-success"
                      onClick={() => this.editDish(dish.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => this.delete(dish.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Sidebar>
    );
  }
}

export default withRouter(Dishes);
