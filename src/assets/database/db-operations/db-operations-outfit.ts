import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ClothingItem, Outfit } from "../models";
import { tableName_Outfit as tableName } from "../db-service";
import { tableName_Item_Outfit as tableNameIntermediary } from "../db-service";
import { tableName_ClothingItem as tableNameItem } from "../db-service";



export const createOutfitTable = async (db: SQLiteDatabase) => {
  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`;

  await db.executeSql(query);
};

export const createItemOutfitTable = async (db: SQLiteDatabase) => {

  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tableNameIntermediary} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_outfit INTEGER REFERENCES ${tableName}(id),
    id_item INTEGER REFERENCES ${tableNameItem}(id)
  )`;

  await db.executeSql(query);
};


// ++ Gets & Sets ++
// Get items from DB
export const createOutfit = async (db: SQLiteDatabase, name?: string): Promise<number> => {
  try {
    const query = 
      `INSERT OR REPLACE INTO ${tableName} (name) VALUES ('${name}')`;

    return await db.executeSql(query)
          .then(res => {return res[0].insertId});

  } catch (error) {
    throw Error(`Failed to create an outfit!`);
  }
}

export const getOutfits = async (db: SQLiteDatabase, date_start?: string, date_end?: string): Promise<Outfit[]> => {
  try {
    const Outfits: Outfit[] = [];

    const query = `
                    SELECT rowid as id, name, date_added FROM ${tableName}
                    ${(date_start && date_end) ? ` WHERE date_added >= '${date_start}' AND date_added <= '${date_end}'` : ``}
                  `

    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Outfits.push(result.rows.item(index))
      }
    });
    return Outfits;

  } catch (error) {
    console.error(error);
    throw Error(`Failed to get ${tableName}!`);
  }
};

// Assign items to an already-existing outfit
export const addItemsToOutfit = async (db: SQLiteDatabase, items: ClothingItem[], outfit: Outfit) => {
  try {
    // Create an intermediary for each item (to solve M2M relationship)
    const insertQuery =
      `INSERT OR REPLACE INTO ${tableNameIntermediary} (id_outfit, id_item) VALUES ` +
      items.map(i => `('${outfit.id}', '${i.id}')`).join(',');

    return db.executeSql(insertQuery).then(res => res[0].insertId);

  } catch (error) {
    throw Error(`Could not add items to outfit.`)
  }
}

// Intermediary Table 
export const getOutfitItemsTable = async (db: SQLiteDatabase, id: number | undefined): Promise<ClothingItem[]> => {
  try {
    const Items: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tableNameIntermediary}
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Items.push(result.rows.item(index))
      }
    });

    return Items
  } catch (error) {
    throw Error('Id not valid.')
  }

}

// Get items of an Outfit
export const getOutfitItems = async (db: SQLiteDatabase, id: number | undefined): Promise<ClothingItem[]> => {
  try {
    const Items: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT ITEM.* FROM ${tableNameItem} AS ITEM
        LEFT JOIN ${tableNameIntermediary} AS B ON ITEM.id = B.id_item 
        LEFT JOIN ${tableName} AS C ON C.id = B.id_outfit
        ${id ? `WHERE C.id = ${id}` : ``}
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Items.push(result.rows.item(index))
      }
    });

    console.log(Items)
    return Items
  } catch (error) {
    throw Error('Id not valid.')
  }

}

// Save outfits to DB
export const saveOutfits = async (db: SQLiteDatabase, Outfit: Outfit[]) => {
  if (Outfit.length < 1) throw Error('No items selected for saving.');

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName} (date_added) VALUES ` +
      Outfit.map(i => `('CURRENT_TIMESTAMP')`).join(',');

  return db.executeSql(insertQuery);
};

// Delete from DB - single outfit (redundancy)
export const deleteOutfit = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with id ${id}`))
};

// Delete from DB - multiple outfits
export const deleteOutfits = async (db: SQLiteDatabase, ids: Array<number>) => {
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


