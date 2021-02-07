import React, { Component } from "react";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import profileImage from "../../Assets/placeholder.png";
import Input from "../Common/Input";
import Joi from "joi";
import "react-responsive-modal/styles.css";
import {
  editDish,
  getCategories,
  getDish,
  getRestaurants,
} from "../Common/Firebase";
import { withRouter } from "react-router-dom";

class EditDish extends Component {
  state = {
    loading: false,
    data: {
      id: "",
      image: null,
      src: null,
      name: "",
      price: "",
      ingredient: "",
      menu: "",
      discount_price: "",
      description: "",
      restaurant: "",
    },
    categories: [],
    restaurants: [],
    errors: {},
  };

  async componentDidMount() {
    this.setState({
      loading: true,
    });
    try {
      const dish = await getDish(this.props.match.params.id);
      const categories = await getCategories();
      const restaurants = await getRestaurants();

      const data = { ...this.state.data };
      data.id = dish.id;
      data.src = dish.image;
      data.name = dish.name;
      data.price = dish.price;
      data.ingredient = dish.ingredient;
      data.menu = dish.menu;
      data.restaurant = dish.restaurant;
      data.discount_price = dish.discount_price;
      data.description = dish.description;

      this.setState({
        categories,
        restaurants,
        data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      alert(error.message);
    }
  }

  fileInputHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const dish = { ...this.state.data };
        dish.src = reader.result;
        dish.image = e.target.files[0];
        this.setState({ data: dish });
      });
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
    let dish = { ...this.state.data };
    dish[e.target.name] = e.target.value;
    this.setState({
      data: dish,
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
      menu,
      restaurant,
    } = this.state.data;
    const dishData = {
      name,
      description,
      discount_price,
      price,
      ingredient,
      menu,
      restaurant,
    };
    const result = Joi.object(this.dishSchema).validate(dishData, {
      abortEarly: false,
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  editDishData = async (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    if (this.state.image === null) {
      alert("Please select an image.");
    } else {
      const {
        id,
        src,
        image,
        name,
        description,
        discount_price,
        price,
        ingredient,
        menu,
        restaurant,
      } = this.state.data;
      try {
        this.setState({ loading: true });
        await editDish(
          id,
          src,
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
                    src={
                      this.state.data.src ? this.state.data.src : profileImage
                    }
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
                value={this.state.data.name}
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
                value={this.state.data.price}
                type="number"
                placeholder="Enter Price of Dish."
              />
              <Input
                name="discount_price"
                label="Discount Price"
                onChange={this.inputHandler}
                error={this.state.errors.discount_price}
                value={this.state.data.discount_price}
                type="number"
                placeholder="Enter Discount Price"
              />
              <Input
                name="ingredient"
                label="Ingredient"
                onChange={this.inputHandler}
                error={this.state.errors.ingredient}
                value={this.state.data.ingredient}
                type="text"
                placeholder="Enter Ingradient"
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
                    name="ingredient"
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
                value={this.state.data.description}
                type="text"
                placeholder="Description"
              />

              <div className="btn-submit">
                <button onClick={this.editDishData}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(EditDish);
