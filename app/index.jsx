import { StyleSheet, View } from "react-native";
import SwitchLanguage from "./Language/SwitchLanguage";
import Login from "./Login";

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
