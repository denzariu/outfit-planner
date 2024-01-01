import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ClothingItem } from "../models";
import { tableName_ClothingItem as tableName } from "../db-service";


export const createClothingTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adjective TEXT,
    type TEXT,
    subtype TEXT,
    seasons TEXT,
    image TEXT
  )`;

  await db.executeSql(query);
};


// ++ Gets & Sets ++
export const getClothingItems = async (db: SQLiteDatabase, type?: string): Promise<ClothingItem[]> => {
  try {
    const clothingItems: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, adjective, type, subtype, seasons, image FROM ${tableName}
      ${type ? `WHERE type = '${type}'` : ``}
      `
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        clothingItems.push(result.rows.item(index))
      }
    });
    return clothingItems;
  } catch (error) {
    console.error(error);
    throw Error(`Failed to get ${tableName}!`);
  }
};

export const saveClothingItems = async (db: SQLiteDatabase, clothingItem: ClothingItem[]) => {

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName} (adjective, type, subtype, seasons, image) VALUES` +
    clothingItem.map(i => `('${i.adjective}', '${i.type}', '${i.subtype}', '${i.seasons}', '${i.image}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteClothingItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with id ${id}`))
};


