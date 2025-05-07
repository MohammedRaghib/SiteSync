import { openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

let db: SQLiteDatabase | null = null; // Declare a variable for database reference

// Function to initialize the database
export async function initializeDatabase() {
  if (!db) {
    db = await openDatabase({ name: "FaceDB.db", location: "default" });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS faces (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, encoding TEXT);",
        [],
        () => console.log("✅ Table initialized"),
        (error) => console.log("❌ Error initializing table:", error)
      );
    });
  }
}

// Function to store a face in the database
export async function saveFace(name: string, encoding: number[]) {
  if (!db) {
    await initializeDatabase();
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO faces (name, encoding) VALUES (?, ?);",
        [name, JSON.stringify(encoding)],
        () => console.log(`✅ Face stored: ${name}`),
        (error) => console.log("❌ Error storing face:", error)
      );
    });
  }
}

// Function to retrieve stored face encodings
export async function retrieveStoredEncodings(): Promise<
  { name: string; encoding: number[] }[]
> {
  // Ensure the database is initialized
  if (!db) {
    await initializeDatabase();
  }
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
    } else {
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
    }
  });
}
