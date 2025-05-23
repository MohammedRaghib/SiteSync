import { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useCheckInfo } from "./ExtraLogic/useUserContext";

const Login = () => {
  const navigation = useNavigation();
  const { setUser, loggedIn, setLoggedIn } = useCheckInfo();
  const { t } = useTranslation();

  useEffect(() => {
    if (loggedIn) {
      navigation.navigate("CheckIn");
    }
  }, [loggedIn]);

  const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/api/login?username=hussein&password=somepassword";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage(t("errorRequired"));
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
        throw new Error(t("errorLoginFailed") + `: ${response.statusText}`);
      }

      const data = await response.json();
      const { person_id, role } = data;

      setUser({ id: person_id, role });
      setLoggedIn(true);

      navigation.navigate(role === "Supervisor" ? "SupervisorPanel" : "CheckIn");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder={t("password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("login")}</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    width: "80%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
});

export default Login;
