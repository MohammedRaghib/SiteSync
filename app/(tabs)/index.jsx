import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import CameraComponent from "./CameraComponent";
import { detectFaces } from "./FaceDetection";
import { recognizeFace } from "./FaceRecognition";
import { initializeDatabase } from "./SQLiteDatabase";

export default function App() {
  const [recognizedPerson, setRecognizedPerson] = useState(null);

  async function handleImageCapture(photoUri) {
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
function extractFaceEncoding(imagePath){
  return [Math.random(), Math.random(), Math.random()]; // Replace with real encoding
}
