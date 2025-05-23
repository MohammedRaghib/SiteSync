import { View } from "react-native";
import { StyleSheet } from "react-native";
import Login from "./Login";
import SwitchLanguage from "./Language/SwitchLanguage";
import CheckIn from "./CheckIn";
import SupervisorDashboard from "./SupervisorDashboard";
import SupervisorPanel from "./SupervisorPanel";
import SpecialReEntry from "./SpecialReEntry";
import Checkout from "./Checkout";

export default function Index() {
  // console.log('render')
  return (
    <View style={styles.container}>
      <SwitchLanguage />
      <Login />
      {/* <CheckIn /> */}
      {/* <SupervisorDashboard /> */}
      {/* <SupervisorPanel /> */}
      {/* <SpecialReEntry /> */}
      {/* <Checkout /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    color: "black",
  },
});
