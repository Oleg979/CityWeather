import { createStackNavigator } from "react-navigation";
import History from "./History";
import Home from "./Home";

export default createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: () => null
      }
    },
    History: {
      screen: History,
      navigationOptions: {
        headerTitle: "Your history"
      }
    }
  },
  {
    mode: "modal",
    headerMode: "screen"
  }
);
