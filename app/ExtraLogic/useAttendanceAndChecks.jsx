import useCheckInfo from "./useUserContext";
import * as Location from "expo-location";

const BACKEND_API_URL = "http://127.0.0.1:9000/api/";

const useAttendanceAndChecks = () => {
    const { user } = useCheckInfo();

    const getAttendanceInfo = async () => {
        try {
            const timestamp = new Date().toISOString();

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Location permission denied");
            }

            const { coords } = await Location.getCurrentPositionAsync({
                mayUseLastKnownLocation: true,
            });

            return {
                timestamp,
                location: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
            };
        } catch (error) {
            return null;
        }
    };

    const sendAttendanceRequest = async (endpoint, faceData, isCheckIn, additionalFields = {}) => {
        try {
            const attendanceInfo = await getAttendanceInfo();
            if (!attendanceInfo) throw new Error("Failed to retrieve attendance info");

            const base64Image = await fetch(faceData.image)
                .then(res => res.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }));

            const payload = {
                attendance_is_unauthorized: Boolean(faceData?.is_unauthorized),
                attendance_subject_id: faceData?.is_unauthorized ? null : faceData.id,
                attendance_monitor_id: user.id,
                attendance_timestamp: attendanceInfo.timestamp,
                attendance_location: attendanceInfo.location,
                attendance_is_check_in: isCheckIn,
                [`attendance_is_supervisor_check_${isCheckIn ? "in" : "out"}`]: user.role === "supervisor",
                attendance_photo: base64Image,
                ...additionalFields
            };

            /* Object.keys(additionalFields).forEach(key => {
                if (key.startsWith('attendance_is_') || key.startsWith('is_')) {
                    payload[key] = Boolean(additionalFields[key]);
                }
            }); */

            const response = await fetch(`${BACKEND_API_URL}${endpoint}/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                    `Failed to check ${isCheckIn ? "in" : "out"}: ${response.statusText}`
                );
            }

            return true;
        } catch (error) {
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
