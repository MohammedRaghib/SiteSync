import React, { useRef, useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { useCameraDevice, Camera } from "react-native-vision-camera";
// P@33Word
export default function App() {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back"); // Use front if needed
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePhoto();
      setPhotoUri("file://" + photoData.path); // Store photo path
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
});
