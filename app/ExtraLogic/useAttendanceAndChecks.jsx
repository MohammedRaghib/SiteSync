import useCheckInfo from "./useUserContext";
import * as Location from "expo-location";

const BACKEND_API_URL = "http://127.0.0.1:8000/api/";

const useAttendanceAndChecks = () => {
    const { user } = useCheckInfo();

    const getAttendanceInfo = async () => {
        try {
            const timestamp = new Date().toISOString();

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") throw new Error("Location permission denied");

            const { coords } = await Location.getCurrentPositionAsync({});
            return { timestamp, location: { latitude: coords.latitude, longitude: coords.longitude } };
        } catch (error) {
            console.error("Error fetching attendance info:", error);
            return null;
        }
    };

    const sendAttendanceRequest = async (endpoint, faceData, isCheckIn, additionalFields = {}) => {
        try {
            const attendanceInfo = await getAttendanceInfo();
            if (!attendanceInfo) throw new Error("Failed to retrieve attendance info");

            const photoBlob = await fetch(faceData.image).then(res => res.blob());

            const formData = new FormData();
            formData.append("attendance_is_unauthorized", faceData?.is_unauthorized);
            formData.append("attendance_subject_id", faceData?.is_unauthorized ? null : faceData.id);
            formData.append("attendance_monitor_id", user.id);
            formData.append("attendance_timestamp", attendanceInfo.timestamp);
            formData.append("attendance_location", JSON.stringify(attendanceInfo.location));
            formData.append("attendance_is_check_in", isCheckIn);
            formData.append("attendance_is_supervisor_check_" + (isCheckIn ? "in" : "out"), user.role === "supervisor");
            formData.append("attendance_photo", photoBlob);

            Object.entries(additionalFields).forEach(([key, value]) => formData.append(key, value));

            const response = await fetch(`${BACKEND_API_URL}${endpoint}/`, { method: "POST", body: formData });
            if (!response.ok) throw new Error(`Failed to check ${isCheckIn ? "in" : "out"}: ${response.statusText}`);

            return true;
        } catch (error) {
            console.error("Attendance request error:", error);
            return false;
        }
    };

    const CheckInAttendance = (faceData) => sendAttendanceRequest("attendance", faceData, true);
    const CheckOutAttendance = (faceData) => sendAttendanceRequest("attendance", faceData, false, {
        attendance_is_work_completed: faceData?.is_work_completed,
        attendance_is_incomplete_checkout: !faceData?.is_work_completed,
        attendance_equipment_returned: faceData?.is_equipment_returned,
    });
    const SpecialReEntry = (faceData) => sendAttendanceRequest("attendance", faceData, true, {
        attendance_is_entry_permitted: faceData?.is_entry_permitted,
    });

    return { getAttendanceInfo, CheckInAttendance, CheckOutAttendance, SpecialReEntry };
};

export default useAttendanceAndChecks;
