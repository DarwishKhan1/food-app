import React, { Component } from "react";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import profileImage from "../../Assets/placeholder.png";
import Input from "../Common/Input";
import Joi from "joi";
import "react-responsive-modal/styles.css";
import { createDish, getCategories, getRestaurants } from "../Common/Firebase";
import { withRouter } from "react-router-dom";

class AddDish extends Component {
  state = {
    loading: false,
    image: null,
    src: null,
    name: "",
    price: "",
    ingredient: "",
    menu: "",
    discount_price: "",
    description: "",
    restaurant: "",
    categories: [],
    restaurants: [],
    errors: {},
  };

  async componentDidMount() {
    try {
      const categories = await getCategories();
      const restaurants = await getRestaurants();

      this.setState({
        categories,
        restaurants,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  fileInputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.files[0],
    });
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  dishSchema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    discount_price: Joi.string().required(),
    price: Joi.string().required(),
    ingredient: Joi.string().required(),
    menu: Joi.string().required(),
    restaurant: Joi.string().required(),
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: this.dishSchema[name] };
    const { error } = Joi.object(propertySchema).validate(obj);
    return error ? error.details[0].message : null;
  };
  inputHandler = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);
    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else {
      delete errors[e.target.name];
    }
    this.setState({
      [e.target.name]: e.target.value,
      errors,
    });
  };

  validate = () => {
    const {
      name,
      description,
      discount_price,
      price,
      ingredient,
      restaurant,
      menu,
    } = this.state;
    const dishData = {
      name,
      description,
      discount_price,
      price,
      ingredient,
      restaurant,
      menu,
    };
    const result = Joi.object(this.dishSchema).validate(dishData, {
      abortEarly: false,
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  create = async (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    if (this.state.image === null) {
      alert("Please select an image.");
    } else {
      const {
        image,
        name,
        description,
        discount_price,
        price,
        ingredient,
        menu,
        restaurant,
      } = this.state;
      try {
        this.setState({ loading: true });
        await createDish(
          image,
          name,
          description,
          discount_price,
          price,
          ingredient,
          menu,
          restaurant
        );
        this.setState({
          loading: false,
        });
        this.props.history.push("/dishes");
      } catch (error) {
        this.setState({
          loading: false,
        });
        alert(error.message);
      }
    }
  };

  render() {
    return (
      <Sidebar>
        <div>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div className="vendor-card">
              <div className="vendor-card-header">
                <h5>Add New Dish</h5>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="profile-image">
                  <img
                    src={this.state.src ? this.state.src : profileImage}
                  ></img>
                </div>
                <div className="form-group mt-2">
                  <input
                    className="btn btn-primary"
                    name="image"
                    accept="image/*"
                    onChange={this.fileInputHandler}
                    type="file"
                  />
                </div>
              </div>
              <Input
                name="name"
                label="Dish Name"
                onChange={this.inputHandler}
                error={this.state.errors.name}
                type="text"
                placeholder="Enter Dish Name"
              />
              <div className="form-group row my-2">
                <label
                  htmlFor="inputPassword"
                  className="col-sm-2 col-form-label"
                >
                  Select Resturant:
                </label>
                <div className="col-sm-10">
                  <select
                    name="restaurant"
                    onChange={this.inputHandler}
                    className="form-control"
                  >
                    {" "}
                    <option>Search Restaurant</option>
                    {this.state.restaurants.map((e) => (
                      <option value={e.restaurant_id} key={e.restaurant_id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                {this.state.errors.restaurant && (
                  <span className="error-message">
                    {this.state.errors.restaurant}
                  </span>
                )}
              </div>

              <Input
                name="price"
                label="Price"
                onChange={this.inputHandler}
                error={this.state.errors.price}
                type="number"
                placeholder="Enter Price of Dish."
              />
              <Input
                name="discount_price"
                label="Discount Price"
                onChange={this.inputHandler}
                error={this.state.errors.discount_price}
                type="number"
                placeholder="Enter Discount Price"
              />
              <Input
                name="ingredient"
                label="Ingradients"
                onChange={this.inputHandler}
                error={this.state.errors.ingredient}
                type="text"
                placeholder="Enter Ingradients"
              />
              <div className="form-group row my-2">
                <label
                  htmlFor="inputPassword"
                  className="col-sm-2 col-form-label"
                >
                  Select Menu:
                </label>
                <div className="col-sm-10">
                  <select
                    name="menu"
                    onChange={this.inputHandler}
                    className="form-control"
                  >
                    {" "}
                    <option>Search Menu</option>
                    {this.state.categories.map((e) => (
                      <option value={e.name} key={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                {this.state.errors.ingredient && (
                  <span className="error-message">
                    {this.state.errors.ingredient}
                  </span>
                )}
              </div>
              <Input
                name="description"
                label="Description"
                onChange={this.inputHandler}
                error={this.state.errors.description}
                type="text"
                placeholder="Description"
              />

              <div className="btn-submit">
                <button onClick={this.create}>Save</button>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(AddDish);
