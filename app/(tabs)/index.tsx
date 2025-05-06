/*import React, { useRef, useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { useCameraDevice, Camera } from "react-native-vision-camera";
import { CVMat, CVCascadeClassifier } from "react-native-opencv";

async function detectFaces(imagePath: string) {
  const mat = await CVMat.imread(imagePath);
  const grayMat = await mat.cvtColor("CV_BGR2GRAY"); 

  const faceCascade = await CVCascadeClassifier.load(
    "haarcascade_frontalface_default.xml"
  );

  const faces = await faceCascade.detectMultiScale(grayMat, 1.1, 5);

  console.log("Faces detected:", faces);
}

export default function App() {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back"); 
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePhoto();
      setPhotoUri("file://" + photoData.path);
    }
  }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          isActive
          ref={cameraRef}
          device={device}
          style={styles.camera}
          photo={true}
        />
      )}
      <Button title="Capture Image" onPress={takePicture} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  camera: { width: "100%", height: 400 },
  image: { width: 200, height: 200, marginTop: 10 },
});*/
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import CameraComponent from "./CameraComponent";
import { detectFaces } from "./FaceDetection";
import { recognizeFace } from "./FaceRecognition";
import { initializeDatabase } from "./SQLiteDatabase";

export default function App() {
  const [recognizedPerson, setRecognizedPerson] = useState<string | null>(null);

  async function handleImageCapture(photoUri: string) {
    const faces = await detectFaces(photoUri);

    if (faces.length > 0) {
      const encoding = extractFaceEncoding(photoUri);
      const name = await recognizeFace(encoding);
      setRecognizedPerson(name);
    }
  }
  useEffect(() => {
    initializeDatabase();
  }, []);
  return (
    <View>
      <CameraComponent onCapture={handleImageCapture} />
      {recognizedPerson && <Text>Recognized: {recognizedPerson}</Text>}
    </View>
  );
}

// Dummy function (use TensorFlow or FaceNet for real encoding) 
function extractFaceEncoding(imagePath: string): number[] {
  return [Math.random(), Math.random(), Math.random()]; // Replace with real encoding
}
