import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { firestore } from "../../Firebase/FirebaseConfig";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";

class Order extends Component {
  state = { order: null, loading: true };

  componentDidMount() {
    firestore
      .collection("orders")
      .doc(this.props.match.params.id)
      .get()
      .then((snapshot) => {
        this.setState({
          order: { uid: snapshot.id, ...snapshot.data() },
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert(err.message);
      });
  }

  getsubtotal = (dishes) => {
    let subttoal = 0;
    dishes.map((dish) => {
      subttoal = subttoal + parseInt(dish.price) * parseInt(dish.quantity);
    });
    return subttoal;
  };
  render() {
    const { order, loading } = this.state;
    return (
      <Sidebar>
        {!loading ? (
          <div>
            <div className="orders__list__item">
              <div className="row justify-content-between">
                <div>
                  Order ID #{" "}
                  <span className="strong">{order.uid.substring(0, 4)}</span>
                </div>
                <div>
                  Price: $ <span className="strong">{order.total_price}</span>
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
                  Distance: <span className="strong">{order.distance}</span>
                </div>
              </div>
              <div className="row">
                <div>
                  <i className="fa fa-map-marker-alt pr-2"></i>
                  <span className="strong">{order.address}</span>
                </div>
              </div>
            </div>
            <div className="row my-1 mx-3 justify-content-between">
              <div>
                Status: <span className="strong">{order.status}</span>
              </div>
              <div>
                Driver: <span className="strong">{order.driver_name}</span>
              </div>
            </div>
            <hr />

            <div className="row my-1 mx-3 justify-content-between">
              <div>
                Customer Name:{" "}
                <span className="strong">{order.customer_name}</span>
              </div>
              <div>
                Customer Phone:{" "}
                <span className="strong">{order.customer_phone}</span>
              </div>
            </div>

            {order.order_dishes.length > 0 && (
              <div className="orders__list__item">
                <h4>Order Details</h4>
                {order.order_dishes.map((dish) => {
                  return (
                    <div className="row justify-content-between my-2">
                      <div className="dish__image">
                        <img src={dish.image} />
                      </div>
                      <div>
                        <p>{dish.name}</p>
                        <p>
                          $ {dish.price} x {dish.quantity} ={" $"}
                          {parseInt(dish.price) * parseInt(dish.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="row justify-content-between my-2">
                  <div></div>
                  <div>
                    <p>SubTotal: ${this.getsubtotal(order.order_dishes)}</p>
                    <p>Shipping cost: $ 20</p>
                    <p className="font-weight-bold">
                      Total: ${this.getsubtotal(order.order_dishes) + 20}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </Sidebar>
    );
  }
}

export default withRouter(Order);
