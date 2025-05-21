import { useCheckInfo } from "./ExtraLogic/useUserContext";
import { Alert } from "react-native";

const BACKEND_API_URL = "https://django.angelightrading.com/home/angeligh/djangoapps/";

const useAttendanceAndChecks = () => {
    const { user } = useCheckInfo();

    const Audit = async (action) => {
        try {
            const response = await fetch(`${BACKEND_API_URL}audit/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: action, action_performed_by_id: user.id }),
            });

            if (!response.ok) {
                throw new Error(`Failed to audit: ${response.statusText}`);
            }
        } catch (e) {
            console.error("Audit error:", e);
        }
    };

    const CheckInAttendance = async (faceData) => {
        try {
            const response = await fetch(`${BACKEND_API_URL}checkin/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendance_subject_id: faceData.id, attendance_monitor: user.role }),
            });

            if (!response.ok) {
                throw new Error(`Failed to check in: ${response.statusText}`);
            }

            await Audit("Check-In");
        } catch (e) {
            Alert.alert("Person not checked in");
        }
    };

    const CheckOutAttendance = async (faceData) => {
        try {
            const response = await fetch(`${BACKEND_API_URL}checkout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendance_subject_id: faceData.id, attendance_monitor: user.role }),
            });

            if (!response.ok) {
                throw new Error(`Failed to check out: ${response.statusText}`);
            }

            await Audit("Check-Out");
        } catch (e) {
            Alert.alert("Person not checked out");
        }
    };

    return { CheckInAttendance, CheckOutAttendance, Audit };
};

export default useAttendanceAndChecks;