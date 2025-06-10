import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useCheckInfo from "./ExtraLogic/useUserContext";

function SupervisorPanel() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();
  const { t } = useTranslation();

  useEffect(() => {
    if (loggedIn && user?.role) {
      const hasAccessResult = hasAccess({ requiresLogin: true, allowedRoles: ["supervisor"] });
      if (!hasAccessResult) {
        navigation.navigate("CheckIn");
      }
    }
  }, [loggedIn, user?.role]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SupervisorDashboard")}
      >
        <Text style={styles.text}>{t("ui.dashboard")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Text style={styles.text}>{t("attendance.checkOut")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("CheckIn")}
      >
        <Text style={styles.text}>{t("attendance.checkIn")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SpecialReEntry")}
      >
        <Text style={styles.text}>{t("ui.specialReEntry")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
    backgroundColor: "#f5f5f5",
  },
  link: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});


export default SupervisorPanel;
