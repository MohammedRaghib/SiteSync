import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, CheckBox, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import useCheckInfo from "./ExtraLogic/useUserContext";

function SupervisorTaskCheck() {
  const route = useRoute();
  const { t } = useTranslation();
  const { faceData } = route.params || {};
  const navigation = useNavigation();
  const { user, hasAccess, loggedIn } = useCheckInfo();
  const { CheckOutAttendance } = useAttendanceAndChecks();

  const [state, setState] = useState({
    tasks: [],
    loading: false,
    submitting: false,
    error: null,
    allTasksCompleted: false,
    allEquipmentReturned: false
  });

  const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

  const fetchTasks = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${BACKEND_API_URL}get_worker_tasks/${faceData.person_id}/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(t('errors.fetchError'));
      }

      setState(prev => ({ ...prev, tasks: data.tasks || [] }));

    } catch (e) {
      setState(prev => ({ ...prev, error: e.message }));
      console.error('Fetch error:', e);

    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const toggleSelection = (type) => {
    setState(prev => {
      const newState = { ...prev };
      if (type === 'allTasks') {
        newState.allTasksCompleted = !prev.allTasksCompleted;
      } else if (type === 'allEquipment') {
        newState.allEquipmentReturned = !prev.allEquipmentReturned;
      }
      return newState;
    });
  };

  const toggleSelectAll = () => {
    setState(prev => ({
      ...prev,
      allTasksCompleted: !prev.allTasksCompleted,
      allEquipmentReturned: !prev.allEquipmentReturned,
    }));
  };

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, submitting: true }));
    try {
      const success = await CheckOutAttendance({
        ...faceData,
        is_unauthorized: false,
        is_work_completed: state.allTasksCompleted,
        is_equipment_returned: state.allEquipmentReturned,
        is_incomplete_checkout: !state.allTasksCompleted || !state.allEquipmentReturned
      });

      Alert.alert(success);

      navigation.goBack();
      
    } catch (error) {
      console.error("Checkout submission error:", error);
      Alert.alert(t("errors.checkoutFailure"), error.message || t("errors.serverError"));
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["supervisor"] })) {
      navigation.navigate("CheckIn");
    } else if (!faceData) {
      navigation.navigate("CheckOut");
    } else {
      fetchTasks();
    }
  }, [user, loggedIn, hasAccess, faceData]);

  const renderEquipment = (task) => {
    if (!task.equipment || task.equipment.length === 0) {
      return <Text style={styles.noEquipmentText}>{t("ui.noEquipment")}</Text>;
    }

    return task.equipment.map(equipment => (
      <View key={equipment.id} style={styles.equipmentItem}>
        <Text style={styles.equipmentName}>{equipment.name}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("attendance.supervisorTaskCheck")}</Text>
      <Text style={styles.workerName}>{faceData?.name || t("errors.noName")}</Text>

      <View style={styles.globalCheckboxes}>
        <TouchableOpacity style={styles.checkboxOption} onPress={toggleSelectAll}>
          <CheckBox
            value={state.allTasksCompleted && state.allEquipmentReturned}
            onValueChange={toggleSelectAll}
          />
          <Text style={styles.checkboxLabel}>{t("ui.selectAll")}</Text>
        </TouchableOpacity>

        <View style={styles.inlineCheckboxes}>
          <TouchableOpacity style={styles.checkboxOption} onPress={() => toggleSelection('allTasks')}>
            <CheckBox
              value={state.allTasksCompleted}
              onValueChange={() => toggleSelection('allTasks')}
            />
            <Text style={styles.checkboxLabel}>{t("ui.allTasksCompleted")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkboxOption} onPress={() => toggleSelection('allEquipment')}>
            <CheckBox
              value={state.allEquipmentReturned}
              onValueChange={() => toggleSelection('allEquipment')}
            />
            <Text style={styles.checkboxLabel}>{t("ui.allEquipmentReturned")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollViewContent}>
        {state.loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
        ) : state.error ? (
          <Text style={styles.errorText}>{state.error}</Text>
        ) : state.tasks.length > 0 ? (
          state.tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.equipmentHeader}>{t("ui.equipment")}:</Text>
              {renderEquipment(task)}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>{t("ui.noData")}</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, state.submitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={state.submitting}
      >
        {state.submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{t("ui.submit")}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  workerName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 25,
  },
  globalCheckboxes: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '0.5rem',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    maxWidth: '100%',
  },
  inlineCheckboxes: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#555',
  },
  scrollViewContent: {
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  equipmentHeader: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 10,
  },
  equipmentName: {
    fontSize: 15,
    color: '#555',
  },
  noEquipmentText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0c7ff',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default SupervisorTaskCheck;