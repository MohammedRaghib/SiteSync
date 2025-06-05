import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, CheckBox, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import useCheckInfo from "./ExtraLogic/useUserContext";

function SupervisorTaskCheck() {
  // Hooks and state
  const route = useRoute();
  const { t } = useTranslation();
  const { faceData } = route.params || {};
  const navigation = useNavigation();
  const { user, hasAccess, loggedIn } = useCheckInfo();
  const { CheckOutAttendance } = useAttendanceAndChecks();

  const [state, setState] = useState({
    tasks: [],
    selectedTasks: [],
    returnedEquipment: [],
    loading: false,
    submitting: false,
    error: null,
    selectAll: false
  });

  const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

  // Fetch tasks
  const fetchTasks = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${BACKEND_API_URL}get_worker_tasks/${faceData.person_id}/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(t('fetchError'));
      }

      setState(prev => ({ ...prev, tasks: data.tasks || [] }));

    } catch (e) {
      setState(prev => ({ ...prev, error: e.message }));
      console.error('Fetch error:', e);
      
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Toggle helpers
  const toggleSelection = (type, id) => {
    const key = type === 'task' ? 'selectedTasks' : 'returnedEquipment';
    setState(prev => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter(itemId => itemId !== id)
        : [...prev[key], id],
      selectAll: false,
    }));
  };

  const toggleSelectAll = () => {
    setState(prev => {
      const newSelectAll = !prev.selectAll;
      const allTaskIds = prev.tasks.map(task => task.id);
      const allEquipmentIds = prev.tasks.flatMap(task =>
        task.equipment?.map(equip => equip.id) || []
      );

      return {
        ...prev,
        selectAll: newSelectAll,
        selectedTasks: newSelectAll ? allTaskIds : [],
        returnedEquipment: newSelectAll ? allEquipmentIds : [],
      };
    });
  };

  // Submit handler
  const handleSubmit = async () => {
    setState(prev => ({ ...prev, submitting: true }));
    try {
      const allTasksCompleted = state.tasks.length > 0 &&
        state.selectedTasks.length === state.tasks.length;

      const allEquipmentReturned = state.tasks?.equipment?.length > 0
        ? state.returnedEquipment.length === state.tasks.equipment.length
        : true;

      const success = await CheckOutAttendance({
        ...faceData,
        is_unauthorized: false,
        is_work_completed: allTasksCompleted,
        is_equipment_returned: allEquipmentReturned
      });

      Alert.alert(
        success ? t("checkoutSuccess") : t("checkoutFailure"),
        `Tasks: ${allTasksCompleted ? 'Completed' : 'Incomplete'}\nEquipment: ${allEquipmentReturned ? 'Returned' : 'Missing'}`
      );

      if (success) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(t("checkoutFailure"));
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  // Auth check
  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["supervisor"] })) {
      navigation.navigate("CheckIn");
    } else if (!faceData) {
      navigation.navigate("CheckOut");
    } else {
      fetchTasks();
    }
  }, [user, loggedIn, hasAccess, faceData]);

  // Render helpers
  const renderEquipment = (task) => {
    if (!task.equipment || task.equipment.length === 0) {
      return <Text style={styles.noData}>{t("noEquipment")}</Text>;
    }

    return task.equipment.map(equipment => (
      <View key={equipment.id} style={styles.item}>
        {/* <CheckBox
          value={state.returnedEquipment.includes(equipment.id)}
          onValueChange={() => toggleSelection('equipment', equipment.id)}
        /> */}
        <Text style={styles.equipment_name}>{equipment.name}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("dashboard")}</Text>
      <Text style={styles.name}>{faceData?.name || t("noName")}</Text>

      <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllContainer}>
        <CheckBox value={state.selectAll} onValueChange={toggleSelectAll} />
        <Text style={styles.selectAllText}>{t("selectAll")}</Text>
      </TouchableOpacity>

      {state.loading ? (
        <ActivityIndicator size="large" />
      ) : state.error ? (
        <Text style={styles.error}>{state.error}</Text>
      ) : state.tasks.length > 0 ? (
        <>
          {state.tasks.map(task => (
            <View key={task.id} style={styles.taskContainer}>
              <View style={styles.item}>
                {/* <CheckBox
                  value={state.selectedTasks.includes(task.id)}
                  onValueChange={() => toggleSelection('task', task.id)}
                /> */}
                <Text style={styles.task_name}>{task.name}</Text>
              </View>
              {renderEquipment(task)}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitButton, state.submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={state.submitting}
          >
            {state.submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>{t("submit")}</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noData}>{t("noData")}</Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 18,
    marginLeft: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: 10,
  },
  task_name: {
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 16,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
  noData: {
    fontSize: 16,
  },
  taskContainer: {
    width: '100%',
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default SupervisorTaskCheck;