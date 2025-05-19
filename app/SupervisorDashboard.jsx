import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

const SupervisorDashboard = () => {
  const [peopleData, setpeopleData] = useState([]);

  const fetchPeople = async () => {
    try {
      // Step 1: Fetch authentication token
      const authResponse = await fetch(
        "https://django.angelightrading.com/home/angeligh/djangoapps/api/token/",
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
        "https://django.angelightrading.com/home/angeligh/djangoapps/sitesyncapplication/api/supervisordashboard/",
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

      {peopleData.length > 0 ? (
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
