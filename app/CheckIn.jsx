import CameraLocationComponent from "./CameraLocationComponent";
import { useTranslation } from 'react-i18next';
import { Alert, View, Text } from "react-native";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";

function CheckIn() {
  const { t } = useTranslation();
  const { recognizeFace } = useFaceRecognition();
  const { CheckInAttendance } = useAttendanceAndChecks();

  const handlePictureTaken = async (photo) => {
    try {
      const data = await recognizeFace(photo.uri);

      if (data.matchFound) {
        const send = {
          ...data.matched_worker,
          image: photo.uri,
          is_unauthorized: false
        }
        const checkIn = await CheckInAttendance(send);
        checkIn ? Alert.alert("Person checked in") : Alert.alert("Failed to check in");
      } else {
        const send = {
          image: photo.uri,
          is_unauthorized: true
        }
        const checkIn = await CheckInAttendance(send);
        Alert.alert("Unauthorized worker");
      }
    } catch (error) {
      console.error("Check-in process failed:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center" }}>{t("neutralExpression")}</Text>
      <CameraLocationComponent onPictureTaken={handlePictureTaken} />
    </View>
  );
}

export default CheckIn;