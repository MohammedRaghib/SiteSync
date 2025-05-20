import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCheckInfo } from "./AllContext";

function CheckIn() {
  const navigation = useNavigation();
  const { user, loggedIn } = useCheckInfo();

  if (!loggedIn && (user.role !== "Guard" || user.role !== "Supervisor")) {
    navigation.navigate("index");
    return;
  }

  return (
    <View style={styles.container}>
      <Text>CheckIn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default CheckIn;
