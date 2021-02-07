import React, { Component } from "react";
import { getDishes, getOrders, getRestaurants } from "../Common/Firebase";
import Spinner from "../Common/Spinner";
import Sidebar from "../Sidebar/Sidebar";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";


class Dashboard extends Component {
  state = {
    loading: false,
    orders: [],
    restaurants: 0,
    dishes: 0,
  };

  getEarnings = (orders) => {
    let total = 0;
    orders.map((order) => {
      total = total + parseInt(order.total_price);
    });

    return total;
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const orders = await getOrders();
      const rest = await getRestaurants();
      const dishes = await getDishes();
      this.setState({
        orders,
        restaurants: rest.length,
        dishes: dishes.length,
        loading: false,
      });
    } catch (error) {
      this.setState({ loading: false });
      alert(error.message);
    }
  }
  render() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let monthlyRevenue = [];

    this.state.orders.forEach((order) => {
      const orderDate = new Date(order.date);

      const index = monthlyRevenue.findIndex((e) => {
        return (
          e.name ==
          monthNames[orderDate.getMonth()] + " " + orderDate.getFullYear()
        );
      });

      if (index >= 0) {
        monthlyRevenue[index]["Revenu"] =
          monthlyRevenue[index]["Revenu"] + parseInt(order.total_price);
      } else {
        monthlyRevenue.push({
          name:
            monthNames[orderDate.getMonth()] + " " + orderDate.getFullYear(),
          Revenu: parseInt(order.total_price),
        });
      }
    });
    return (
      <Sidebar>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <div className="text-center my-5">
              <h2>Dashboard</h2>
            </div>
            <div className="row">
              <div className="col-md-6 text-center">
                <div className="card d-flex justify-content-center align-items-center py-5  my-1">
                  <p className="font-weight-bold">
                    $ {this.getEarnings(this.state.orders)}
                  </p>
                  <span>Total Earnings</span>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="card d-flex justify-content-center align-items-center py-5 my-1">
                  <p className="font-weight-bold">{this.state.orders.length}</p>
                  <span>Orders</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 text-center">
                <div className="card d-flex justify-content-center align-items-center py-5  my-1">
                  <p className="font-weight-bold">{this.state.restaurants}</p>
                  <span>Total Restaurants</span>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="card d-flex justify-content-center align-items-center py-5 my-1">
                  <p className="font-weight-bold">{this.state.dishes}</p>
                  <span>Total Dishes</span>
                </div>
              </div>
            </div>
            <div className="my-3 text-center">
              <h3 className="my-2">Total Revenue</h3>
            
              <LineChart
                width={900}
                height={400}
                data={monthlyRevenue}
                margin={{
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Revenu"
                  stroke="#82ca9d"
                  activeDot={{ r: 10 }}
                />
                <Legend margin={{ top: 40 }} />
              </LineChart>
            </div>
          </div>
        )}
      </Sidebar>
    );
  }
}

export default Dashboard;
