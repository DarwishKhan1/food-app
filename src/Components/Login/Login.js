import React, { Component } from "react";
import Logo from "../../Assets/logo.png";
import emailIcon from "../../Assets/Icons/email.png";
import passwordIcon from "../../Assets/Icons/pass.png";
import { auth, firestore } from "../../Firebase/FirebaseConfig";
class Login extends Component {
  state = { email: "", password: "" };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  login = () => {
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        firestore
          .collection("super_admin")
          .doc(res.user.uid)
          .get()
          .then((snapshot) => {
            localStorage.setItem("admin", JSON.stringify(snapshot.data()));
            window.location.reload("/");
          })
          .catch((err) => {
            alert(err.message);
          });
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  render() {
    return (
      <div>
        <div className="container ">
          <div className="logo">
            <img src={Logo}></img>
          </div>

          <form className="loginAdmin">
            <h1>Admin Login</h1>
            <div class="input-group my-4">
              <span>
                <img src={emailIcon} />
              </span>
              <div class="input-group-inner">
                <label htmlFor="exampleInputEmail1">Email ID</label>
                <input
                  name="email"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.email}
                  type="email"
                  id="exampleInputEmail1"
                  placeholder="youremail@gmail.com"
                />
              </div>
            </div>
            <div class="input-group my-3">
              <span>
                <img src={passwordIcon} />
              </span>
              <div class="input-group-inner">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.password}
                  type="password"
                  id="password"
                  placeholder="********"
                />
              </div>
            </div>

            <button
              onClick={this.login}
              type="button"
              className="btn btn-login btn-block"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
