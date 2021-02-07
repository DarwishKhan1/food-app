import React, { Component } from "react";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import profileImage from "../../Assets/profileImage.png";
import Input from "../Common/Input";
import Joi from "joi";
import Map from "../Common/Map";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { createRestaurant } from "../Common/Firebase";
import { withRouter } from "react-router-dom";
import { getRestaurantOwners } from "./../Common/Firebase";

class AddRestaurant extends Component {
  state = {
    loading: false,
    image: null,
    src: null,
    name: "",
    address: "",
    phone: "",
    mobile_phone: "",
    latitude: 0,
    longitude: 0,
    description: "",
    owner: "",
    openModal: false,
    restaurantOwners: [],
    errors: {},
  };

  async componentDidMount() {
    try {
      const restaurantOwners = await getRestaurantOwners();
      this.setState({
        loading: false,
        restaurantOwners,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
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

  restaurantSchema = {
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    mobile_phone: Joi.string().required(),
    description: Joi.string().required(),
    owner: Joi.string().required(),
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: this.restaurantSchema[name] };
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
      address,
      phone,
      mobile_phone,
      description,
      owner,
    } = this.state;
    const restaurantData = {
      name,
      address,
      phone,
      mobile_phone,
      description,
      owner,
    };
    const result = Joi.object(this.restaurantSchema).validate(restaurantData, {
      abortEarly: false,
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  register = async (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    if (this.state.image === null) {
      alert("Please select an image.");
    } else if (this.state.latitude === 0 || this.state.longitude === 0) {
      alert("Please select location.");
    } else {
      const {
        src,
        image,
        name,
        address,
        phone,
        mobile_phone,
        latitude,
        longitude,
        description,
        owner,
      } = this.state;
      try {
        this.setState({ loading: true });
        await createRestaurant(
          src,
          image,
          name,
          address,
          phone,
          mobile_phone,
          latitude,
          longitude,
          description,
          owner
        );
        this.setState({
          loading: false,
        });
        this.props.history.push("/restaurants");
      } catch (error) {
        this.setState({
          loading: false,
        });
        alert(error.message);
      }
    }
  };

  getCoords = (coords) => {
    this.setState({ latitude: coords.lat, longitude: coords.lng });
  };

  setModal = () => {
    this.setState({
      openModal: !this.state.openModal,
    });
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
                <h5>Add New Restaurant</h5>
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
              <div className="form-group row mt-3">
                <label
                  htmlFor="inputPassword"
                  className="col-sm-2 col-form-label"
                >
                  Select Owner:
                </label>
                <div className="col-sm-10">
                  <select
                    name="owner"
                    onChange={this.inputHandler}
                    className="form-control"
                  >
                    <option>Select Restaurant Owner: </option>
                    {this.state.restaurantOwners.map((e) => (
                      <option value={e.user_id}>
                        {e.first_name + " " + e.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                name="name"
                label="Restaurant Name"
                onChange={this.inputHandler}
                error={this.state.errors.name}
                type="text"
                placeholder="Enter Restaurant Name"
              />
              <Input
                name="address"
                label="Address"
                onChange={this.inputHandler}
                error={this.state.errors.address}
                type="text"
                placeholder="Enter Restaurant Address"
              />
              <Input
                name="phone"
                label="Phone Number"
                onChange={this.inputHandler}
                error={this.state.errors.phone}
                type="number"
                placeholder="Enter Restaurant Phone Number"
              />
              <Input
                name="mobile_phone"
                label="Mobile Number"
                onChange={this.inputHandler}
                error={this.state.errors.mobile_phone}
                type="number"
                placeholder="Enter Restaurant Mobile Number"
              />
              <Input
                name="description"
                label="Description"
                onChange={this.inputHandler}
                error={this.state.errors.description}
                type="text"
                placeholder="Description"
              />

              <div className="text-center my-2">
                <button onClick={this.setModal} className="btn btn-primary">
                  Select Location
                </button>
              </div>
              <Modal open={this.state.openModal} onClose={this.setModal}>
                <div style={{ width: "700px", marginTop: "30px" }}>
                  <Map selectArea={(coords) => this.getCoords(coords)} />
                </div>
              </Modal>
              <div className="btn-submit">
                <button onClick={this.register}>Save</button>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(AddRestaurant);
