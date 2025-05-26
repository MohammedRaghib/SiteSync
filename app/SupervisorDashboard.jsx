import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import useCheckInfo from "./ExtraLogic/useUserContext";

const SupervisorDashboard = () => {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();
  const { t } = useTranslation();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["supervisor"] })) {
      navigation.navigate("CheckIn");
    }
  }, [user, loggedIn]);

  const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/";

  const [peopleData, setPeopleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPeople = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const authResponse = await fetch(`${BACKEND_API_URL}api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({ username: "hussein", password: "Abdulqadir$2025" }),
      });

      if (!authResponse.ok) {
        throw new Error(t("authError"));
      }

      const authData = await authResponse.json();
      const access_token = authData.access;

      const peopleResponse = await fetch(
        `${BACKEND_API_URL}sitesyncapplication/api/supervisordashboard/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            Authorization: `Bearer ${access_token}`,
            supervisorid: user.id,
          },
        }
      );

      if (!peopleResponse.ok) {
        setErrorMessage(t("fetchError"));
        throw new Error(t("fetchError"));
      }

      const jsonPeopleData = await peopleResponse.json();
      setPeopleData(jsonPeopleData || []);
    } catch (error) {
      console.error("Error fetching data:", error);      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("dashboard")}</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>{t("name")}</Text>
        <Text style={styles.headerText}>{t("status")}</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>{t("loading")}</Text>
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : peopleData.length > 0 ? (
        peopleData.map((person) => (
          <View key={person.id} style={styles.item}>
            <Text style={styles.name}>{person.labourer_name}</Text>
            <Text style={styles.status}>{person.labourer_status}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>{t("noData")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  name: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  loading: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
  },
  error: {
    fontSize: 16,
    color: "red",
    marginVertical: 10,
  },
  noData: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
  },
});

export default SupervisorDashboard;