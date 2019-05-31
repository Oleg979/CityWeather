import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { changeCity } from "./actions";

const ListItem = ({ text, press }) => (
  <View>
    <TouchableHighlight underlayColor="grey" onPress={() => press(text)}>
      <View style={styles.row}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableHighlight>
    <Separator />
  </View>
);

const Separator = () => <View style={styles.separator} />;

class History extends Component {
  onPress = city => {
    this.props.dispatch(changeCity(city));
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <StatusBar hidden={true} />
          <ImageBackground
            style={styles.image}
            source={require("./assets/clear.png")}
          >
            <ScrollView>
              {this.props.cities.map((city, idx) => (
                <ListItem
                  text={city}
                  press={city => this.onPress(city)}
                  key={idx}
                />
              ))}
            </ScrollView>
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(71, 66, 66, 0.4)"
  },
  text: {
    fontSize: 16,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    fontSize: 20,
    fontWeight: "600"
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    marginLeft: 0,
    backgroundColor: "grey"
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});

const mapStateToProps = state => ({
  cities: [...state.cities].reverse()
});

export default connect(mapStateToProps)(History);
