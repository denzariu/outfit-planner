import { addItemsToOutfit, addOutfitsOnDate, createOutfit, deleteAllItemsFromOutfit } from "../db-operations/db-operations-outfit"
import { getDBConnection } from "../db-service"
import { Outfit } from "../models"

// TODO: Feature in testing, default / favourite outfits + outfit selector coming soon
export const saveOutfit = async (outfit: Outfit, items_ids: number[], date: string) => {
  const db = await getDBConnection()
  
  if (!outfit || !outfit.id) {
    const idNewOutfit = await createOutfit(db, 'NameNotSetYet')
    await addItemsToOutfit(db, items_ids, idNewOutfit)
    await addOutfitsOnDate(db, [idNewOutfit], date)
  }
  else {
    await deleteAllItemsFromOutfit(db, outfit.id)
    await addItemsToOutfit(db, items_ids, outfit.id)
    //TODO: override name/icon for outfit

  }
  console.log('Added Items to Outfit')
} 