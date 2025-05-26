import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import useCheckInfo from "./ExtraLogic/useUserContext";

function Checkout() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();
  const { t } = useTranslation();

  useEffect(() => {
    // console.log('checking access');
    if (
      !hasAccess({ requiresLogin: true, allowedRoles: ["guard", "supervisor"] })
    ) {
      navigation.navigate("index");
    }
  }, [user, loggedIn]);

  const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

  const { recognizeFace, sendPhotoToBackend } = useFaceRecognition();
  const { Audit, CheckOutAttendance } = useAttendanceAndChecks();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {t("cameraPermission")}
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>{t("grantPermission")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        const data = await recognizeFace(photo.uri);
        sendPhotoToBackend(photo.uri, user.role);

        console.log(data);

        if (data.matchFound) {
          const checkIn = await CheckOutAttendance(data.matched_worker);

          if (!checkIn) {
            Alert.alert("Failed to check in");
            throw new Error("Failed to check in");
          } else {
            Alert.alert("Person checked in");
          }
        } else {
          Alert.alert("Unauthourised worker");
        }
      } catch (e) {
        console.error("Error during check-in process:", e);
        Alert.alert("An error occurred, please try again.");
      }
    } else {
      console.log("Camera not available");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.info}>{t("neutralExpression")}</Text>
      <CameraView ref={cameraRef} style={styles.camera} />
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>{t("capturePhoto")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "100%",
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    paddingVertical: 20,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Checkout;