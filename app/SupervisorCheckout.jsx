import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useCheckInfo } from "./ExtraLogic/useUserContext";
import { useEffect } from "react";

function SupervisorCheckout() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();

  useEffect(() => {
      if (!hasAccess({ requiresLogin: true, allowedRoles: ["Supervisor"] })) {
        navigation.navigate("CheckIn");
      }
    }, [user, loggedIn]);

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
