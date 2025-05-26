import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useCheckInfo from "./ExtraLogic/useUserContext";

const Login = () => {
  const navigation = useNavigation();
  const { setUser, loggedIn, setLoggedIn } = useCheckInfo();
  const { t } = useTranslation();

  const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/api/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage(t("errorRequired"));
      return;
    }
    // console.log(navigation.getState());
    setErrorMessage('');
    setLoading(true);
    try {
      const tokenResponse = await fetch(`${BACKEND_API_URL}token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!tokenResponse.ok) {
        // console.log(tokenResponse);
        throw new Error(t("errorLoginFailed"));
      }

      const tokenData = await tokenResponse.json();
      // console.log(tokenData);
      if (!tokenData.access || !tokenData.refresh) {
        throw new Error(t("errorLoginFailed"));
      }

      const userResponse = await fetch(`${BACKEND_API_URL}login?username=${username}&password=${password}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${tokenData.access}`,
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!userResponse.ok) {
        throw new Error(t("errorLoginFailed"));
      }
      setErrorMessage("");
      const userData = await userResponse.json();
      const { person_id, role_name } = userData;
      // console.log(role_name);
      const newUser = {
        id: person_id,
        role: role_name,
        access: tokenData.access,
        refresh: tokenData.refresh
      }
      setLoggedIn(true);
      setUser((prevUser) => ({
        ...prevUser,
        ...newUser,
      }));

      navigation.navigate("SupervisorPanel");
      // Alert.alert(t("successLogin"));
    } catch (error) {
      setErrorMessage(error.message);
    }finally {
      setLoading(false);
    }
  };


  return (
    <>
      {!loggedIn ? (
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
          <Text style={styles.buttonText}>{loading ? t("loading") : (t("login"))}</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>
      ) : (
        <View style={styles.container}>
          <Text>{t("alreadyLoggedIn")}</Text>
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
