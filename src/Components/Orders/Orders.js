import React, { Component } from "react";
import { firestore } from "../../Firebase/FirebaseConfig";
import Sidebar from "../Sidebar/Sidebar";
import { withRouter } from "react-router-dom";
import Spinner from "../Common/Spinner";

class Orders extends Component {
  state = { orders: [], restaurents: [], restaurent: null, loading: true };

  componentDidMount() {
    firestore
      .collection("orders")
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          let orders = [];
          snapshot.docs.map((order) => {
            orders.push({ uid: order.id, ...order.data() });
          });
          this.setState({ orders });
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

  orderClicked = (id) => {
    this.props.history.push(`/order/${id}`);
  };
  render() {
    const { orders: allOrders, restaurent,loading } = this.state;

    let filterdOrders = allOrders;
    if (restaurent) {
      filterdOrders = allOrders.filter(
        (order) => order.restaurant_id === restaurent
      );
    }
    return (
      <Sidebar>
        {loading ? (
          <Spinner />
        ) : (
          <div className="orders__list mb-5">
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
            {filterdOrders.map((order) => {
              return (
                <div
                  className="orders__list__item"
                  onClick={() => this.orderClicked(order.uid)}
                >
                  <div className="row justify-content-between">
                    <div>
                      Order ID #{" "}
                      <span className="strong">
                        {order.uid.substring(0, 4)}
                      </span>
                    </div>
                    <div>
                      Price: ${" "}
                      <span className="strong">{order.total_price}</span>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div>
                      Time <span className="strong">{order.time}</span>
                    </div>
                    <div>
                      <span className="strong">{order.delivery_type}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      Customer Name:{" "}
                      <span className="strong">{order.customer_name}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <i className="fa fa-map-marker-alt pr-2"></i>
                      <span className="strong">{order.address}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      Status: <span className="strong">{order.status}</span>
                    </div>
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

export default withRouter(Orders);
