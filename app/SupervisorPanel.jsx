import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCheckInfo } from "./ExtraLogic/useUserContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function SupervisorPanel() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();
  const { t } = useTranslation();

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
        <Text style={styles.text}>{t('dashboard')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Text style={styles.text}>{t('checkOut')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("CheckIn")}
      >
        <Text style={styles.text}>{t('checkIn')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("SpecialReEntry")}
      >
        <Text style={styles.text}>{t('specialReEntry')}</Text>
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
