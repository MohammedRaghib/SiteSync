import { CVMat, CVCascadeClassifier } from "react-native-opencv";

export async function detectFaces(imagePath: string) {
  const mat = await CVMat.imread(imagePath);
  const grayMat = await mat.cvtColor("CV_BGR2GRAY");

  const faceCascade = await CVCascadeClassifier.load("haarcascade_frontalface_default.xml");

  const faces = await faceCascade.detectMultiScale(grayMat, 1.1, 5);

  console.log("Faces detected:", faces);
  return faces;
}
