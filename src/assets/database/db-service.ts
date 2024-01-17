import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ClothingItem } from './models';


enablePromise(true);

// ++ Generalities ++
export const getDBConnection = async () => {
  return openDatabase({ name: 'denzariu.db', location: 'default' });
};

export const deleteTable = async (db: SQLiteDatabase, tableName: string) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};

// ++ Table names ++
export const tableName_ClothingItem = 'clothing_item';
export const tableName_Item_Condition = 'item_condition';
export const tableName_Condition = 'condition';
export const tableName_Item_Color = 'item_color';
export const tableName_Color = 'color';
export const tableName_Item_Outfit = 'item_outfit';
export const tableName_Outfit = 'outfit';


