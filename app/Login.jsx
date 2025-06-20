import { useNavigation } from "@react-navigation/native";
import {useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useCheckInfo from "./ExtraLogic/useUserContext";

const Login = () => {
  const navigation = useNavigation();
  const { setUser, loggedIn, setLoggedIn, user } = useCheckInfo();
  const { t } = useTranslation();

  const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage(t("errors.errorRequired"));
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username)
      formData.append('password', password)

      const userResponse = await fetch(`${BACKEND_API_URL}login/`, {
        method: "POST",
        body: formData
      });

      if (!userResponse.ok) {
        throw new Error(t("errors." + userResponse.error_type));
      }

      setErrorMessage("");
      const userData = await userResponse.json();
      const { person_id, role_name } = userData;

      const newUser = {
        id: person_id,
        role: role_name,
      }
      setLoggedIn(true);
      setUser((prevUser) => ({
        ...prevUser,
        ...newUser,
        // refresh: tokenData.refresh,
        // access: tokenData.access,
      }));

      navigation.navigate("SupervisorPanel");
      // Alert.alert(t("successLogin"));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {!loggedIn ? (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={t("auth.username")}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={t("auth.password")}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{loading ? t("ui.loading") : (t("auth.login"))}</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
      ) : (
        <View style={styles.container}>
          <Text>{t("auth.alreadyLoggedIn")}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(user.role === "supervisor" ? "Supervisor/SupervisorPanel" : "Check/CheckIn")}>
            <Text style={styles.buttonText}>{t("ui.dashboard")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
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
