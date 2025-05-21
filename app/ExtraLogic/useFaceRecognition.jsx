import { useState } from "react";
import { Alert } from "react-native";
import useAttendanceAndChecks from "./useAttendanceAndChecks";

const FACE_API_KEY = "YOUR_FACE_API_KEY";
const BACKEND_API_URL = "your_backend_url";
const FACE_API_ENDPOINT = "https://YOUR_REGION.api.cognitive.microsoft.com";
const PERSON_GROUP_ID = "your-workers-group-id";

const useFaceRecognition = () => {
    const [matchedWorker, setMatchedWorker] = useState(null);
    const [loading, setLoading] = useState(false);

    const convertImageUriToBlob = async (imageUri) => {
        const response = await fetch(imageUri);
        return response.blob();
    };

    const recognizeFace = async (imageUri) => {
        try {
            setLoading(true);
            setMatchedWorker(null);

            const imageBlob = await convertImageUriToBlob(imageUri);

            const detectRes = await fetch(
                `${FACE_API_ENDPOINT}/face/v1.0/detect?returnFaceId=true`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Ocp-Apim-Subscription-Key": FACE_API_KEY,
                    },
                    body: imageBlob,
                }
            );

            const detectData = await detectRes.json();
            if (!detectData[0]?.faceId) {
                Alert.alert("No face detected!");
                setLoading(false);
                return { matchFound: false };
            }

            const faceId = detectData[0].faceId;

            const identifyRes = await fetch(
                `${FACE_API_ENDPOINT}/face/v1.0/identify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": FACE_API_KEY,
                    },
                    body: JSON.stringify({
                        personGroupId: PERSON_GROUP_ID,
                        faceIds: [faceId],
                        maxNumOfCandidatesReturned: 1,
                        confidenceThreshold: 0.7,
                    }),
                }
            );

            const identifyData = await identifyRes.json();
            const candidate = identifyData[0]?.candidates[0];

            if (candidate) {
                const personId = candidate.personId;

                const personRes = await fetch(
                    `${FACE_API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}/persons/${personId}`,
                    {
                        method: "GET",
                        headers: {
                            "Ocp-Apim-Subscription-Key": FACE_API_KEY,
                        },
                    }
                );

                const faceData = await personRes.json();
                setMatchedWorker(faceData);

                return { matchedWorker: faceData, matchFound: true };
            } else {
                return { matchFound: false };
            }
        } catch (error) {
            console.error("Recognition error:", error);
            return { matchFound: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const sendPhotoToBackend = async (imageUri, role) => {
        try {
            const imageBlob = await convertImageUriToBlob(imageUri);
            const formData = new FormData();
            formData.append("image", imageBlob);
            formData.append("attendance_monitor", role);

            const response = await fetch(`${BACKEND_API_URL}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error sending photo:", error.message);
        }
    };

    return { matchedWorker, recognizeFace, loading, sendPhotoToBackend };
};

export default useFaceRecognition;