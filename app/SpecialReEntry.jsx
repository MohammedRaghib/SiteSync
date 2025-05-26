import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import useCheckInfo from "./ExtraLogic/useUserContext";

function SpecialReEntry() {
  const navigation = useNavigation();
  const { user, hasAccess, loggedIn } = useCheckInfo();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["Supervisor"] })) {
      navigation.navigate("CheckIn");
    }
  }, [user, loggedIn]);

  return (
    <View style={styles.container}>
      <Text>SpecialReEntry</Text>
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
export default SpecialReEntry;
