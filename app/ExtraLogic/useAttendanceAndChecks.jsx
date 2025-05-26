import useCheckInfo from "./useUserContext";
import * as Location from "expo-location";

const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

const useAttendanceAndChecks = () => {
    const { user } = useCheckInfo();

    const getAttendanceInfo = async () => {
        try {
            const timestamp = new Date().toISOString();

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Location permission denied");
            }

            const location = await Location.getCurrentPositionAsync({});
            const locationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            return { timestamp, location: locationData };
        } catch (error) {
            console.error("Error fetching attendance info:", error);
            return null;
        }
    };

    const CheckInAttendance = async (faceData) => {
        try {
            const attendanceInfo = await getAttendanceInfo();
            const ToSend = new FormData();
            const photoBlob = await fetch(faceData.image).then((res) => res.blob());
            ToSend.append("attendance_subject_id", faceData.id);
            ToSend.append("attendance_monitor", user.id);
            ToSend.append("attendance_timestamp", attendanceInfo?.timestamp);
            ToSend.append("attendance_location", JSON.stringify(attendanceInfo?.location));
            ToSend.append("attendance_is_check_in", true);
            ToSend.append("attendance_is_supervisor_check_in", user.role === "supervisor" ? true : false);
            ToSend.append("attendance_photo", photoBlob);

            const response = await fetch(`${BACKEND_API_URL}checkin/`, {
                method: "POST",
                body: ToSend,
            });

            if (!response.ok) {
                throw new Error(`Failed to check in: ${response.statusText}`);
            }

            return true;
        } catch (e) {
            return false;
        }
    };

    const CheckOutAttendance = async (faceData, workCompleted) => {
        try {
            const attendanceInfo = await getAttendanceInfo();

            const ToSend = {
                attendance_subject_id: faceData.id,
                attendance_monitor: user.role,
                timestamp: attendanceInfo?.timestamp,
                location: attendanceInfo?.location,
            };

            if (user.role === "supervisor") {
                ToSend["attendance_is_work_completed"] = workCompleted;
            }

            const response = await fetch(`${BACKEND_API_URL}checkout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ToSend),
            });

            if (!response.ok) {
                throw new Error(`Failed to check out: ${response.statusText}`);
            }

            return true;
        } catch (e) {
            return false;
        }
    };

    return { getAttendanceInfo, CheckInAttendance, CheckOutAttendance };
};

export default useAttendanceAndChecks;