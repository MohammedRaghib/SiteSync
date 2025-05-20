import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useCheckInfo } from "./AllContext";
import { useNavigation } from "@react-navigation/native";

function SupervisorCheckout() {
  const navigation = useNavigation();
  const { user } = useCheckInfo();

  if (user.role !== "Supervisor") {
    navigation.navigate("CheckIn");
    return;
  }
  
  return (
    <View style={styles.container}>
      <Text>SupervisorCheckout</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default SupervisorCheckout;
