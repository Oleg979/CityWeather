import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import { connect } from "react-redux";
import { pushToHistory } from "./actions";

class Home extends React.Component {
  state = {
    city: null,
    cityId: null,
    fetching: true,
    weather: null,
    temp: null,
    text: "",
    placeholder: "Search any city",
    image: null,
    error: false
  };

  cityCodes = {};

  componentDidMount = async () => {
    await this.setState({ city: this.props.city || "Rio" });
    await this.loadInfo();
  };

  componentWillReceiveProps = async nextProps => {
    if (nextProps.city != this.props.city) {
      await this.setState({ city: nextProps.city });
      await this.loadInfo();
    }
  };

  loadInfo = async () => {
    this.setState({ fetching: true, error: false });
    let id;
    if (this.cityCodes[this.state.city.toLowerCase()]) {
      id = this.cityCodes[this.state.city.toLowerCase()];
    } else {
      id = await this.fetchCityCodeByName();
      this.cityCodes[this.state.city.toLowerCase()] = id;
    }

    if (id == -1) {
      this.setState({
        fetching: false,
        error: true
      });
      return;
    }
    const data = await this.fetchTempInfo(id);

    this.setState({
      error: false,
      fetching: false,
      cityId: id,
      temp: data.the_temp,
      weather: data.weather_state_name.trim()
    });
  };

  fetchCityCodeByName = async () => {
    const response = await fetch(
      `https://www.metaweather.com/api/location/search/?query=${
        this.state.city
      }`
    );
    const data = await response.json();
    if (data.length == 0) return -1;

    const id = data[0].woeid;

    return id;
  };

  fetchTempInfo = async id => {
    const response = await fetch(
      `https://www.metaweather.com/api/location/${id}/`
    );
    const data = await response.json();

    let imgs = await fetch(
      `https://pixabay.com/api/?key=10267376-d43a0099fa6ef7d3b92a73fa3&q=${
        this.state.city
      }+city&image_type=photo&pretty=true`
    );
    imgs = await imgs.json();
    if (imgs.totalHits > 0)
      await this.setState({
        image: imgs.hits[0].largeImageURL
      });
    else await this.setState({ image: null });
    return data.consolidated_weather[0];
  };

  getImage = type => {
    const images = {
      Clear: require("./assets/clear.png"),
      Hail: require("./assets/hail.png"),
      "Heavy Cloud": require("./assets/heavy-cloud.png"),
      "Light Cloud": require("./assets/light-cloud.png"),
      "Heavy Rain": require("./assets/heavy-rain.png"),
      "Light Rain": require("./assets/light-rain.png"),
      Showers: require("./assets/showers.png"),
      Sleet: require("./assets/sleet.png"),
      Snow: require("./assets/snow.png"),
      Thunder: require("./assets/thunder.png")
    };
    if (this.state.image)
      return {
        uri: this.state.image
      };
    return images[type];
  };

  onSubmitEditing = async () => {
    await this.setState({ city: this.state.text });
    this.props.dispatch(pushToHistory(this.state.text));
    await this.loadInfo();
  };

  onPress = () => this.props.navigation.navigate("History");
  /* Alert.alert(
      "Weather App",
      "Developed by SiltStrider. For more information visit my GitHub page."
    ); */

  onChangeText = text => this.setState({ text });

  render = () => {
    const {
      city,
      fetching,
      weather,
      temp,
      text,
      placeholder,
      error
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <KeyboardAvoidingView behavior="padding">
            <ImageBackground
              style={styles.image}
              source={this.getImage(weather)}
            >
              <View style={styles.info}>
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.onPress}
                  >
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require("./assets/menu-4-32.png")}
                    />
                  </TouchableOpacity>
                </View>
                {!fetching &&
                  !error && (
                    <View>
                      <Text style={styles.city}>{city}</Text>
                      <Text style={styles.weather}>{weather}</Text>
                      <Text style={styles.temp}>
                        {temp.toFixed(1)}
                        °C
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        underlineColorAndroid="transparent"
                        onSubmitEditing={this.onSubmitEditing}
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
                        autoCapitalize="words"
                      />
                    </View>
                  )}
                {error && (
                  <View>
                    <Text style={styles.error}>{city} doesn't exist</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={placeholder}
                      underlineColorAndroid="transparent"
                      onSubmitEditing={this.onSubmitEditing}
                      onChangeText={this.onChangeText}
                      autoCorrect={false}
                      autoCapitalize="words"
                    />
                  </View>
                )}
                {fetching && <Text style={styles.loading}>Loading...</Text>}
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {},
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  city: {
    color: "white",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    fontSize: 60,
    marginTop: 170,
    fontWeight: "600"
  },
  loading: {
    color: "white",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 30,
    marginTop: 270
  },
  weather: {
    color: "white",
    fontWeight: "100",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 20,
    marginTop: 10
  },
  temp: {
    color: "white",
    fontWeight: "300",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 55,
    marginTop: 10
  },
  error: {
    color: "red",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    textAlign: "center",
    fontSize: 35,
    marginTop: 270
  },
  info: {
    padding: 30,
    backgroundColor: "rgba(71, 66, 66, 0.5)",
    height: Dimensions.get("window").height
  },
  input: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: "white",
    fontSize: 25,
    marginTop: 80,
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto"
  },
  header: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  icon: {
    marginLeft: 35,
    paddingLeft: 10,
    width: 18
  }
});

const mapStateToProps = state => ({
  city: state.city
});

export default connect(mapStateToProps)(Home);
