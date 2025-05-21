import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Login from "./Login";
import CheckIn from "./CheckIn";

export default function Index() {
  const navigation = useNavigation();
  // console.log('render')
  return (
    <View style={styles.container}>
      <Login />
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
