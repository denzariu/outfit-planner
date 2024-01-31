import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ClothingItem, Outfit, OutfitPlanner } from "../models";
import { tableName_Outfit, tablename_OutfitPlanner } from "../db-service";
import { tableName_Item_Outfit as tableNameIntermediary } from "../db-service";
import { tableName_ClothingItem as tableNameItem } from "../db-service";



export const createOutfitTable = async (db: SQLiteDatabase) => {
  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tableName_Outfit} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    icon TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`;

  await db.executeSql(query);
};

export const createItemOutfitTable = async (db: SQLiteDatabase) => {

  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tableNameIntermediary} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_outfit INTEGER REFERENCES ${tableName_Outfit}(id),
    id_item INTEGER REFERENCES ${tableNameItem}(id)
  )`;

  await db.executeSql(query);
};

export const createOutfitPlannerTable = async (db: SQLiteDatabase) => {
  // Create table if it does not exist
  const query = `CREATE TABLE IF NOT EXISTS ${tablename_OutfitPlanner} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_outfit INTEGER REFERENCES ${tableName_Outfit}(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`;

  await db.executeSql(query);
};

// ++ Outfit / Outfit intermediary ++

// ++ Gets & Sets ++
// Get items from DB
export const createOutfit = async (db: SQLiteDatabase, outfit: Outfit): Promise<number> => {
  try {
    const query = 
      `INSERT OR REPLACE INTO ${tableName_Outfit} (name, icon) VALUES ('${outfit.name ?? 'Default Outfit'}', '${outfit.icon ?? 'shopping'}')`;

    const results = await db.executeSql(query)

    return results[0].insertId

  } catch (error) {
    throw Error(`Failed to create an outfit!`);
  }
}

export const getOutfits = async (db: SQLiteDatabase, date_start?: string, date_end?: string): Promise<Outfit[]> => {
  try {
    const Outfits: Outfit[] = [];

    const query = `
                    SELECT rowid as id, name, icon, date_added FROM ${tableName_Outfit}
                    ${(date_start && date_end) ? 
                      ` WHERE date_added >= '${date_start} 00:00:00' AND date_added <= '${date_end} 23:59:59'` 
                    : ``}
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
    throw Error(`Failed to get ${tableName_Outfit}!`);
  }
};

// Update outfit's fields (name, icon)
export const updateOutfit = async (db: SQLiteDatabase, id: number, newItem: Outfit) => {
  const updateQuery =
    `
      UPDATE OR REPLACE ${tableName_Outfit}
      SET name = '${newItem.name}', icon = '${newItem.icon}'
      WHERE id = ${id};
    `
  
    return db.executeSql(updateQuery)
} 

// Assign items to an already-existing outfit
export const addItemsToOutfit = async (db: SQLiteDatabase, ids_items: number[], outfit_id: number) => {
  try {
    // Create an intermediary for each item (to solve M2M relationship)
    const insertQuery =
      `INSERT OR REPLACE INTO ${tableNameIntermediary} (id_outfit, id_item) VALUES `
      + ids_items.map(id_item => `('${outfit_id}', '${id_item}')`).join(',');

    return db.executeSql(insertQuery).then(res => res[0].insertId);

  } catch (error) {
    throw Error(`Could not add items to outfit.`)
  }
}

export const deleteAllItemsFromOutfit = async (db: SQLiteDatabase, id_outfit: number) => {
  try {
    // Create an intermediary for each item (to solve M2M relationship)
    const insertQuery =
      `DELETE FROM ${tableNameIntermediary} WHERE id_outfit = ${id_outfit}`

    db.executeSql(insertQuery);

  } catch (error) {
    throw Error(`Could not delete items from outfit.`)
  }
} 

// Intermediary Table 
export const getOutfitItemsTable = async (db: SQLiteDatabase): Promise<ClothingItem[]> => {
  try {
    const Items: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tableNameIntermediary}`
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Items.push(result.rows.item(index))
      }
    });

    return Items
  } catch (error) {
    throw Error('Couldn\'t get OutfitItemsTable. Id not valid.')
  }

}

// Get items of an Outfit
export const getOutfitItems = async (db: SQLiteDatabase, id: number | undefined): Promise<ClothingItem[]> => {
  try {
    const Items: ClothingItem[] = [];
    const results = await db.executeSql(
      `SELECT ITEM.* FROM ${tableNameItem} AS ITEM
        LEFT JOIN ${tableNameIntermediary} AS B ON ITEM.id = B.id_item 
        LEFT JOIN ${tableName_Outfit} AS C ON C.id = B.id_outfit
        ${id ? `WHERE C.id = ${id}` : ``}
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Items.push(result.rows.item(index))
      }
    });

    return Items
  } catch (error) {
    throw Error('Couldn\'t get OutfitItems. Id not valid.')
  }

}

// Get items of several Outfits
export const getOutfitsItems = async (db: SQLiteDatabase, ids: (number | undefined)[]): Promise<(ClothingItem & {outfit_id: number})[]> => {
  try {
    const Items: (ClothingItem & {outfit_id: number})[] = [];

    const sql = 
    `
      SELECT C.id as outfit_id, ITEM.* FROM ${tableNameItem} AS ITEM
      LEFT JOIN ${tableNameIntermediary} AS B ON ITEM.id = B.id_item 
      LEFT JOIN ${tableName_Outfit} AS C ON C.id = B.id_outfit
      WHERE outfit_id IN (${ids})
    `

    const results = await db.executeSql(sql);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Items.push(result.rows.item(index))
      }
    });

    return Items
    
  } catch (error) {
    throw Error('Couldn\'t get OutfitsItems. Id not valid.')
  }

}

// Save outfits to DB
export const saveOutfit = async (db: SQLiteDatabase, outfit: Outfit) => {
  // if (outfit.length < 1) throw Error('No items selected for saving.');

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName_Outfit} (name, icon, date_added) VALUES ` +
      `('${outfit.name}', '${outfit.icon}', 'CURRENT_TIMESTAMP')`

  return db.executeSql(insertQuery);
};

// Delete from DB - single outfit (redundancy)
export const deleteOutfit = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName_Outfit} where rowid = ${id}`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete item with id ${id}`))
};

// Delete from DB - Outfits from OutfitPlanner
export const deleteOutfitPlanner = async (db: SQLiteDatabase, id_outfit: number) => {
  const deleteQuery = `DELETE from ${tablename_OutfitPlanner} where id_outfit = ${id_outfit}`;
  
  await db.executeSql(deleteQuery)
    .catch((err) => Error(`Failed to delete outfit date with id ${id_outfit}`))
};

// Delete from DB - multiple outfits
export const deleteOutfits = async (db: SQLiteDatabase, ids: Array<number>) => {
  if (ids.length < 1) throw Error('No items selected for deletion.');

  const deleteQuery = `DELETE from ${tableName_Outfit} where rowid IN (${ids})`;
  
  await db.executeSql(deleteQuery)
          .catch((err) => Error(`Failed to delete item with ids: ${ids}`))
};



// ++ Outfit Planner ++

export const addOutfitsOnDate = async (db: SQLiteDatabase, ids: number[], date: string): Promise<number[]> => {
  try {
    const insertIds: number[] = []

    const results = await db.executeSql(
      `INSERT OR REPLACE INTO ${tablename_OutfitPlanner} (id_outfit, date) VALUES `
      + ids.map(i => `('${i}', '${date} 00:00:01')`).join(',')
    )

    results.forEach(result => {
      insertIds.push(result.insertId)
    })

    return insertIds;

  } catch (error) {
    throw Error(`Could not add items to outfit.`)
  }
}

export const getOutfitPlannerTable = async (db: SQLiteDatabase): Promise<OutfitPlanner[]> => {
  try {
    const OutfitsPlanner: OutfitPlanner[] = [];
    
    const results = await db.executeSql(
      `SELECT * FROM ${tablename_OutfitPlanner} `
    )
    
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        OutfitsPlanner.push(result.rows.item(index))
      }
    })
    return OutfitsPlanner;

  } catch (error) {
    throw Error(`Could not add items to outfit.`)
  }
}

export const getOutfitsOnDate = async (db: SQLiteDatabase, date: string): Promise<Outfit[]> => {
  try {
    const Outfits: Outfit[] = [];
    const results = await db.executeSql(
      `
        SELECT OUTFIT.* FROM ${tableName_Outfit} AS OUTFIT
        JOIN ${tablename_OutfitPlanner} AS B ON OUTFIT.id = B.id_outfit 
        WHERE B.date BETWEEN '${date} 00:00:00' AND '${date} 23:59:59'
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Outfits.push(result.rows.item(index))
      }
    });

    return Outfits

  } catch (error) {
    throw Error('Couldn\'t get Outfits On 7Date.')
  }
}

export const getOutfitsBetweenDates = async (db: SQLiteDatabase, date_start: string, date_end: string): Promise<any[]> => {
  try {
    const Outfits: any = [];
    const results = await db.executeSql(
      `
        SELECT B.date, OUTFIT.* FROM ${tableName_Outfit} AS OUTFIT
        JOIN ${tablename_OutfitPlanner} AS B ON OUTFIT.id = B.id_outfit 
        WHERE B.date BETWEEN '${date_start} 00:00:00' AND '${date_end} 23:59:59'
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Outfits.push(result.rows.item(index))
      }
    });

    return Outfits

  } catch (error) {
    throw Error('Couldn\'t get Outfit Between Dates.')
  }
}

// ++ Extra ++

// Used for outfit recommendations
export const getLatestCreatedOutfits = async (db: SQLiteDatabase, maximum: number): Promise<Outfit[]> => {
  try {
    const Outfits: Outfit[] = [];
    const results = await db.executeSql(
      `
        SELECT * FROM ${tableName_Outfit} AS OUTFIT
        ORDER BY date_added DESC
        LIMIT ${maximum}
      `
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Outfits.push(result.rows.item(index))
      }
    });

    return Outfits

  } catch (error) {
    throw Error('Id not valid.')
  }
}


export const getItemsFromLatestCreatedOutfits = async (db: SQLiteDatabase, maximum: number): Promise<(ClothingItem & {outfit_id: number, outfit_name: string})[]> => {
  try {
    const Items: (ClothingItem & {outfit_id: number, outfit_name: string})[] = [];

    // Data gathered:
    /*
      outfit_id, 
      id, image, aspect_ratio 
    */
    const sql = 
    `
      SELECT C.id as outfit_id, C.name as outfit_name, C.icon as outfit_icon, ITEM.id as item_id, ITEM.image, ITEM.type, ITEM.aspect_ratio
      FROM ${tableNameItem} AS ITEM
      LEFT JOIN ${tableNameIntermediary} AS B ON ITEM.id = B.id_item 
      LEFT JOIN ${tableName_Outfit} AS C ON C.id = B.id_outfit
      WHERE outfit_id IN (SELECT id FROM ${tableName_Outfit}
                          ORDER BY date_added DESC
                          LIMIT ${maximum})
    `

    const results = await db.executeSql(sql);

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