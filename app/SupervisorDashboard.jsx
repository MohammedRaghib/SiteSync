import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCheckInfo } from "./ExtraLogic/useUserContext";

const SupervisorDashboard = () => {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["Supervisor"] })) {
      navigation.navigate("CheckIn");
    }
  }, [user, loggedIn]);
  
  const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/";
  const [peopleData, setpeopleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const authResponse = await fetch(
        `${BACKEND_API_URL}api/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          body: JSON.stringify({
            username: "hussein",
            password: "Abdulqadir$2025",
          }),
        }
      );

      if (!authResponse.ok) {
        throw new Error(`Auth error: ${authResponse.status}`);
      }

      const authData = await authResponse.json();
      const access_token = authData.access;

      // console.log("Access Token:", access_token);

      const peopleResponse = await fetch(
        `${BACKEND_API_URL}sitesyncapplication/api/supervisordashboard/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!peopleResponse.ok) {
        throw new Error(`Data fetch error: ${peopleResponse.status}`);
      }

      const jsonpeopleData = await peopleResponse.json();
      // console.log("Fetched Data:", jsonpeopleData);

      setpeopleData(jsonpeopleData || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supervisor Dashboard</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>
      {loading ? <Text>Loading...</Text> : peopleData.length > 0 ? (
        peopleData.map((person) => (
          <View key={person.id} style={styles.item}>
            <Text style={styles.name}>{person.labourer_name}</Text>
            <Text style={styles.status}>{person.labourer_status}</Text>
          </View>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  },
  name: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default SupervisorDashboard;
