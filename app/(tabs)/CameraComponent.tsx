import React, { useRef, useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { useCameraDevice, Camera } from "react-native-vision-camera";

type CameraComponentProps = {
  onCapture: (photoUri: string) => void;
};

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePhoto();
      const imagePath = "file://" + photoData.path;
      setPhotoUri(imagePath);
      onCapture(imagePath);
    }
  }

  return (
    <View style={styles.container}>
      {device && <Camera isActive ref={cameraRef} device={device} style={styles.camera} photo />}
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
