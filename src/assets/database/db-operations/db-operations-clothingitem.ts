import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ClothingItem } from "../models";
import { tableName_ClothingItem as tableName } from "../db-service";


export const createClothingTable = async (db: SQLiteDatabase) => {
  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adjective TEXT,
    type TEXT,
    subtype TEXT,
    seasons TEXT,
    image TEXT,
    aspect_ratio FLOAT
  )`;

  await db.executeSql(query);
};

// ++ Gets & Sets ++
// Get items from DB
export const getClothingItems = async (db: SQLiteDatabase, type?: string): Promise<ClothingItem[]> => {
  try {
    const clothingItems: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, adjective, type, subtype, seasons, image, aspect_ratio FROM ${tableName}
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

// Save items to DB
export const saveClothingItems = async (db: SQLiteDatabase, clothingItems: ClothingItem[]) => {

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName} (adjective, type, subtype, seasons, image, aspect_ratio) VALUES` +
    clothingItems.map(i => `('${i.adjective}', '${i.type}', '${i.subtype}', '${i.seasons}', '${i.image}', '${i.aspect_ratio}')`).join(',');

  return db.executeSql(insertQuery);
};

// Delete from DB - single item
export const deleteClothingItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with id ${id}`))
};

// Delete from DB - multiple items
export const deleteClothingItems = async (db: SQLiteDatabase, ids: Array<number | null>) => {
  if (ids.length < 1) throw Error('No items selected for deletion.');

  let ids_stringified = ids.reduce((acc, current, index) => {
    if (!current) return acc
    return index == 0 ? current.toString() : acc.concat(', ' + current.toString())
  }, '');

  console.log(ids_stringified);
  
  const deleteQuery = `DELETE from ${tableName} where rowid IN (${ids})`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with ids: ${ids}`))
};


