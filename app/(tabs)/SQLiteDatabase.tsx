import { openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

// @ts-ignore
const db: SQLiteDatabase = openDatabase({ name: "FaceDB.db", location: "default" });

export function initializeDatabase() {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS faces (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, encoding TEXT);",
      [],
      () => console.log("✅ Table initialized"),
      (error) => console.log("❌ Error initializing table:", error)
    );
  });
}

export function saveFace(name: string, encoding: number[]) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO faces (name, encoding) VALUES (?, ?);",
      [name, JSON.stringify(encoding)], // Store encoding as JSON
      () => console.log(`✅ Face stored: ${name}`),
      (error) => console.log("❌ Error storing face:", error)
    );
  });
}

// 📌 Retrieve all stored face encodings
export function retrieveStoredEncodings(): Promise<{ name: string; encoding: number[] }[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM faces;",
        [],
        (_, { rows }) => {
          const faces = [];
          for (let i = 0; i < rows.length; i++) {
            faces.push({
              name: rows.item(i).name,
              encoding: JSON.parse(rows.item(i).encoding), // Convert stored JSON back to array
            });
          }
          console.log("✅ Faces retrieved:", faces);
          resolve(faces);
        },
        (error) => {
          console.log("❌ Error retrieving faces:", error);
          reject(error);
        }
      );
    });
  });
}
