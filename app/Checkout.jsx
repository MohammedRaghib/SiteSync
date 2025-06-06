import CameraLocationComponent from "./CameraLocationComponent";
import { useTranslation } from 'react-i18next';
import { Alert, View, Text } from "react-native";
import useFaceRecognition from "./ExtraLogic/useFaceRecognition";
import useAttendanceAndChecks from "./ExtraLogic/useAttendanceAndChecks";
import { useNavigation } from "@react-navigation/native";
import useCheckInfo from "./ExtraLogic/useUserContext";
import { useEffect } from "react";

function CheckOut() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { recognizeFace } = useFaceRecognition();
  const { CheckOutAttendance } = useAttendanceAndChecks();
  const { user, hasAccess, loggedIn } = useCheckInfo();

  useEffect(() => {
    if (!hasAccess({ requiresLogin: true, allowedRoles: ["guard", "supervisor"] })) {
      navigation.navigate("CheckIn");
    }
  }, [user, loggedIn]);

  const handlePictureTaken = async (photo) => {
    try {
      const data = await recognizeFace(photo.uri);

      if (data.matchFound) {
        if (user.role === "supervisor") navigation.navigate("SupervisorTaskCheck", { faceData: { ...data.matched_worker, image: photo.uri } });

        const send = {
          ...data.matched_worker,
          image: photo.uri,
          is_unauthorized: false,
          is_work_completed: data.matched_worker.is_work_completed,
          is_equipment_returned: data.matched_worker.is_equipment_returned
        };
        const checkOut = await CheckOutAttendance(send);
        checkOut
          ? Alert.alert(t("checkoutSuccess"))
          : Alert.alert(t("checkoutFailure"));
      } else {
        const send = {
          image: photo.uri,
          is_unauthorized: true
        };
        const checkOut = await CheckOutAttendance(send);
        Alert.alert(t("unauthorizedWorker"));
      }
    } catch (error) {
      Alert.alert(error.message);
      console.error("Check-out process failed:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center" }}>{t("neutralExpression")}</Text>
      <CameraLocationComponent onPictureTaken={handlePictureTaken} />
    </View>
  );
}

export default CheckOut;
