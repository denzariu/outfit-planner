import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ClothingItem } from "../models";
import { tableName_ClothingItem as tableName, tableName_Item_Outfit } from "../db-service";


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
export const getClothingItems = async (db: SQLiteDatabase, type?: string, ids?: number[]): Promise<ClothingItem[]> => {
  try {
    const searchCriteria = 
      (type && ids) ? `WHERE type = '${type}' AND id IN (${ids})` 
      : type ? `WHERE type = '${type}'`
      : ids ? `WHERE id IN (${ids})` 
      : ``
    const clothingItems: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, adjective, type, subtype, seasons, image, aspect_ratio FROM ${tableName} ` +
      searchCriteria
      
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

// Update items of DB
export const updateClothingItem = async (db: SQLiteDatabase, id: number, newItem: ClothingItem) => {
  const updateQuery =
  `
    UPDATE ${tableName}
    SET adjective = '${newItem.adjective}', type = '${newItem.type}', subtype = '${newItem.subtype}', seasons = '${newItem.seasons}', image = '${newItem.image}', aspect_ratio = ${newItem.aspect_ratio}
    WHERE id = ${id};
  `

  return db.executeSql(updateQuery)
}

// Delete from DB - single item
export const deleteClothingItem = async (db: SQLiteDatabase, id: number) => {
  const deleteFromOutfits = `DELETE from ${tableName_Item_Outfit} where id_item = ${id}`
  await db.executeSql(deleteFromOutfits)
    .catch((err) => Error(`Failed to delete item from outfits`))
  
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with id ${id}`))
};

// Delete from DB - multiple items
export const deleteClothingItems = async (db: SQLiteDatabase, ids: Array<number | null>) => {
  if (ids.length < 1) throw Error('No items selected for deletion.');

  
  const deleteFromOutfits = `DELETE from ${tableName_Item_Outfit} where id_item IN (${ids})`
  await db.executeSql(deleteFromOutfits)
    .catch((err) => Error(`Failed to delete item from outfits`))

  const deleteQuery = `DELETE from ${tableName} where rowid IN (${ids})`;
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with ids: ${ids}`))

};


