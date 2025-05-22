import { useNavigation } from "@react-navigation/native";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCheckInfo } from "./ExtraLogic/useUserContext";
import { useEffect } from "react";

function SupervisorPanel() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();

  useEffect(() => {
      if (!hasAccess({ requiresLogin: true, allowedRoles: ["Supervisor"] })) {
        navigation.navigate("CheckIn");
      }
    }, [user, loggedIn]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SupervisorDashboard")}
      >
        <Text style={styles.text}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SupervisorCheckout")}
      >
        <Text style={styles.text}>Check Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SupervisorCheckIn")}
      >
        <Text style={styles.text}>Check In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SpecialReEntry")}
      >
        <Text style={styles.text}>Special Re-Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    overflowX: "hidden",
  },
  link: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    backgroundColor: "#007AFF",
    width: width * 0.8,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: height * 0.01,
  },
  text: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});

export default SupervisorPanel;
