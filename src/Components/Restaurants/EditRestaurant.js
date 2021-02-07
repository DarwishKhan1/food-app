import React, { Component } from "react";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import profileImage from "../../Assets/profileImage.png";
import Input from "../Common/Input";
import Joi from "joi";
import Map from "../Common/Map";
import { firestore } from "../../Firebase/FirebaseConfig";
import { withRouter } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { editRestaurant } from "../Common/Firebase";

class EditRestaurant extends Component {
  state = {
    loading: false,
    openModal: false,
    data: {
      id: "",
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
    },
    errors: {},
  };

  componentDidMount() {
    const restaurant_id = this.props.match.params.id;
    firestore
      .collection("restaurants")
      .doc(restaurant_id)
      .get()
      .then((rest) => {
        const restaurant = { ...this.state.data };
        restaurant.id = rest.data().restaurant_id;
        restaurant.src = rest.data().image;
        restaurant.name = rest.data().name;
        restaurant.address = rest.data().address;
        restaurant.phone = rest.data().phone;
        restaurant.mobile_phone = rest.data().mobile_phone;
        restaurant.description = rest.data().description;
        restaurant.owner = rest.data().owner;
        restaurant.latitude = rest.data().latitude;
        restaurant.longitude = rest.data().longitude;

        this.setState({
          data: restaurant,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  fileInputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.files[0],
    });
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const restaurant = { ...this.state.data };
        restaurant.src = reader.result;
        restaurant.image = e.target.files[0];
        this.setState({ data: restaurant });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  restaurantSchema = {
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    mobile_phone: Joi.string().required(),
    description: Joi.string().required(),
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
    let restaurant = { ...this.state.data };
    restaurant[e.target.name] = e.target.value;
    this.setState({
      data: restaurant,
      errors,
    });
  };

  validate = () => {
    const { name, address, phone, mobile_phone, description } = this.state.data;
    const restaurantData = {
      name,
      address,
      phone,
      mobile_phone,
      description,
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

    if (this.state.data.image === null && this.state.data.src === null) {
      alert("Please select an image.");
    } else if (
      this.state.data.latitude === 0 ||
      this.state.data.longitude === 0
    ) {
      alert("Please select location.");
    } else {
      const {
        id,
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
      } = this.state.data;
      try {
        this.setState({ loading: true });
        await editRestaurant(
          id,
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
    const data = { ...this.state.data };
    data.latitude = coords.lat;
    data.longitude = coords.lng;
    this.setState({ data });
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
                <h5>Edit Restaurant</h5>
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
                label="Restaurant Name"
                onChange={this.inputHandler}
                value={this.state.data.name}
                error={this.state.errors.name}
                type="text"
                placeholder="Enter Restaurant Name"
              />
              <Input
                name="address"
                label="Address"
                onChange={this.inputHandler}
                value={this.state.data.address}
                error={this.state.errors.address}
                type="text"
                placeholder="Enter Restaurant Address"
              />
              <Input
                name="phone"
                label="Phone Number"
                onChange={this.inputHandler}
                value={this.state.data.phone}
                error={this.state.errors.phone}
                type="number"
                placeholder="Enter Restaurant Phone Number"
              />
              <Input
                name="mobile_phone"
                label="Mobile Number"
                onChange={this.inputHandler}
                error={this.state.errors.mobile_phone}
                value={this.state.data.mobile_phone}
                type="number"
                placeholder="Enter Restaurant Mobile Number"
              />
              <Input
                name="description"
                label="Description"
                onChange={this.inputHandler}
                value={this.state.data.description}
                error={this.state.errors.description}
                type="text"
                placeholder="Description"
              />
              <div className="text-center my-2">
                <button onClick={this.setModal} className="btn btn-primary">
                  Edit Location
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

export default withRouter(EditRestaurant);
