import CameraLocationComponent from "./CameraLocationComponent";
import { useTranslation } from 'react-i18next';
import { Alert, View, Text } from "react-native";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import { useNavigation } from "@react-navigation/native";
import useCheckInfo from "./ExtraLogic/useUserContext";
import { useEffect } from "react";

function CheckIn() {
  const { t } = useTranslation();
  const { recognizeFace } = useFaceRecognition();
  const { CheckInAttendance } = useAttendanceAndChecks();
  const navigation = useNavigation();
  const { user, hasAccess, loggedIn } = useCheckInfo();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["guard", "supervisor"] })) {
      navigation.navigate("CheckIn");
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
        const checkIn = await CheckInAttendance(send);
        // console.log(checkIn);
        checkIn
          ? Alert.alert(t("checkinSuccess"))
          : console.log(t("checkinFailure"));
      } else {
        const send = {
          image: photo.uri,
          is_unauthorized: true
        }
        const checkIn = await CheckInAttendance(send);
        Alert.alert("Unauthorized worker");
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