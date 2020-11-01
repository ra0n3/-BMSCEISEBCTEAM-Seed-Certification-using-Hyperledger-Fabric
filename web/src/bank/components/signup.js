import React, { useState, Component } from "react";

import "./signup.css";

class SignUpPage extends Component {
  //   createUser = () => {
  //     this.state;
  //   };

  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      firstName: "",
      lastName: "",
    };
  }

  handleUserChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
      console.log(event);
      console.log(this.state);
  }

  render() {
    const { firstName, lastName, userName } = this.state;
    return (
      <div>
        <div>
          <h1>
            This is {lastName},{firstName} using {userName}{" "}
          </h1>
        </div>
        <div className="block">
          <h1>Register Below!!</h1>
        </div>
        <div className="form">
          <div>
            <label>First Name : </label>
            <input
              type="text"
              name="firstName"
              onChange={this.handleUserChange}
            />
          </div>
          <div>
            <label> Last Name : </label>
            <input
              type="text"
              name="lastName"
              onChange={this.handleUserChange}
            />
          </div>
          <div>
            <label> UserName : </label>
            <input
              type="text"
              name="userName"
              onChange={this.handleUserChange}
            />
          </div>
          <div>
            <button onClick={this.handleSubmit}> Sing Up!! </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpPage;
