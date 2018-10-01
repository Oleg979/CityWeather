import React, { Component } from "react";
import store from "./store";
import { Provider } from "react-redux";
import Navigator from "./routes";

export default class App extends Component {
  state = {
    city: "Paris",
    history: ["Rome", "London"],
    homePage: false
  };

  addToHistory = city =>
    this.setState({ history: [...this.state.history], city });

  setSity = city => this.setState({ city });

  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}
