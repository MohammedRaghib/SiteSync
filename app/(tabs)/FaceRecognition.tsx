import { retrieveStoredEncodings } from "./SQLiteDatabase";

export async function recognizeFace(imageEncoding: number[]) {
  const storedFaces = await retrieveStoredEncodings();
  let recognizedPerson = null;

  storedFaces.forEach(({ name, encoding }) => {
    const similarity = compareFaces(imageEncoding, encoding);
    if (similarity > 0.8) recognizedPerson = name;
  });

  console.log("Recognized:", recognizedPerson || "Unknown Face");
  return recognizedPerson;
}

function compareFaces(face1: number[], face2: number[]) {
  return Math.random(); // Replace with cosine similarity or Euclidean distance
}
