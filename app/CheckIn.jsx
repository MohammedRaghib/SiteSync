import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Text, View } from "react-native";
import CameraLocationComponent from "./CameraLocationComponent";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import useCheckInfo from "./ExtraLogic/useUserContext";

function CheckIn() {
  const { t } = useTranslation();
  const { recognizeFace } = useFaceRecognition();
  const { CheckInAttendance } = useAttendanceAndChecks();
  const navigation = useNavigation();
  const { user, hasAccess, loggedIn } = useCheckInfo();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["guard", "supervisor"] })) {
      navigation.navigate("Login");
    }
  }, [user, loggedIn]);
  const handlePictureTaken = async (photo) => {
    try {
      const data = await recognizeFace(photo.uri);

      if (data.success) {
        const send = {
          ...data.matched_worker,
          image: photo.uri,
          is_unauthorized: false
        }
        const checkIn = CheckInAttendance(send);
        Alert.alert(t(checkIn));
      } else {
        const send = {
          image: photo.uri,
          is_unauthorized: true
        }
        const checkIn = CheckInAttendance(send);
        Alert.alert(t(checkIn));
      }
    } catch (error) {
      Alert.alert(error.message);
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
