import { openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

let db: SQLiteDatabase | null = null;

export async function initializeDatabase(): Promise<SQLiteDatabase> {
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
  return db;
}

export async function saveFace(name: string, encoding: number[]) {
  const database = await initializeDatabase();

  database.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO faces (name, encoding) VALUES (?, ?);",
      [name, JSON.stringify(encoding)],
      () => console.log(`✅ Face stored: ${name}`),
      (error) => console.log("❌ Error storing face:", error)
    );
  });
}

export async function retrieveStoredEncodings(): Promise<{ name: string; encoding: number[] }[]> {
  const database = await initializeDatabase(); 

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM faces;",
        [],
        (_, { rows }) => {
          const faces = [];
          for (let i = 0; i < rows.length; i++) {
            faces.push({
              name: rows.item(i).name,
              encoding: JSON.parse(rows.item(i).encoding),
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
