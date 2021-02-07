import React, { Component } from "react";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import profileImage from "../../Assets/profile.png";
import Input from "../Common/Input";
import Joi from "joi";
import "react-responsive-modal/styles.css";
import { createRestaurantOwner} from "../Common/Firebase";
import { withRouter } from "react-router-dom";

class AddRestaurantOwner extends Component {
  state = {
    loading: false,
    image: null,
    src: null,
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    errors: {},
  };

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

  ownerSchema = {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: this.ownerSchema[name] };
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
    const { first_name, last_name, phone, email, password } = this.state;
    const ownerData = {
      first_name,
      last_name,
      phone,
      email,
      password,
    };
    const result = Joi.object(this.ownerSchema).validate(ownerData, {
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
        first_name,
        last_name,
        phone,
        email,
        password,
      } = this.state;
      try {
        this.setState({ loading: true });
        await createRestaurantOwner(
          image,
          first_name,
          last_name,
          phone,
          email,
          password,
        );
        this.setState({
          loading: false,
        });
        this.props.history.push("/restaurant-owners");
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
                <h5>Create New Restaurant Owner</h5>
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
                name="first_name"
                label="First Name"
                onChange={this.inputHandler}
                error={this.state.errors.first_name}
                type="text"
                placeholder="Enter First Name"
              />
              <Input
                name="last_name"
                label="Last Name"
                onChange={this.inputHandler}
                error={this.state.errors.last_name}
                type="text"
                placeholder="Enter Last Name"
              />

              <Input
                name="phone"
                label="Phone Number"
                onChange={this.inputHandler}
                error={this.state.errors.phone}
                type="number"
                placeholder="Enter Phone Number"
              />
              <Input
                name="email"
                label="Email"
                onChange={this.inputHandler}
                error={this.state.errors.email}
                type="email"
                placeholder="Enter Your Email"
              />
              <Input
                name="password"
                label="Password"
                onChange={this.inputHandler}
                error={this.state.errors.password}
                type="password"
                placeholder="Enter Password"
              />
              <div className="btn-submit">
                <button onClick={this.create}>Sumbit Registration</button>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(AddRestaurantOwner);
