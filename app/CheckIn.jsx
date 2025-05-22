import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import { useCheckInfo } from "./ExtraLogic/useUserContext";

function CheckIn() {
  const navigation = useNavigation();
  const { user, loggedIn, hasAccess } = useCheckInfo();

  useEffect(() => {
    // console.log('checking access');
    if (
      !hasAccess({ requiresLogin: true, allowedRoles: ["Guard", "Supervisor"] })
    ) {
      navigation.navigate("index");
    }
  }, [user, loggedIn]);

  const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

  const { recognizeFace, sendPhotoToBackend } = useFaceRecognition();
  const { Audit, CheckInAttendance } = useAttendanceAndChecks();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [faceData, setFaceData] = useState(null);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need permission to access the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);

      const data = await recognizeFace(photo.uri);
      sendPhotoToBackend(photo.uri, user.role);

      if (data.matchFound) {
        setFaceData(data.matchedWorker);
        await CheckInAttendance(faceData)
      } else {
        Alert.alert("Unauthourised worker");
        await Audit('Failed - Check-In');
      }
    } else {
      console.log("Camera not available");
    }

  };


  return (
    <View style={styles.container}>
      <Text style={styles.info}>Take clear pictures for best recognition</Text>
      <CameraView ref={cameraRef} style={styles.camera} />
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>Capture Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
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

// export default React.memo(CheckIn);
export default CheckIn;