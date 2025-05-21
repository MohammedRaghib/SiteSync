import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useCheckInfo } from "./ExtraLogic/useUserContext";

const Login = () => {
  const navigation = useNavigation();
  const { user, setUser, loggedIn, setLoggedIn } = useCheckInfo();

  useEffect(() => {
    if (loggedIn) {
      navigation.navigate("CheckIn");
    }
  }, [loggedIn]);

  const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      const { person_id, role } = data;

      setUser({ id: person_id, role });
      setLoggedIn(true);

      if (user.role === "Supervisor") {
        navigation.navigate("SupervisorPanel");
      } else {
        navigation.navigate("CheckIn");
      }
      //   console.log('Login successful:', data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        id="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        id="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    color: "black",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Login;
