import { addItemsToOutfit, addOutfitsOnDate, createOutfit, deleteAllItemsFromOutfit, deleteOutfitPlanner, updateOutfit, deleteOutfit as deleteOutfitFromDB } from "../db-operations/db-operations-outfit"
import { getDBConnection } from "../db-service"
import { Outfit } from "../models"

// TODO: Feature in testing, default / favourite outfits + outfit selector coming soon
export const saveOutfit = async (outfit: Outfit, items_ids: number[], date?: string) => {
  const db = await getDBConnection()
  
  if (!outfit || !outfit.id) {
    // Keep track of how many
    const idNewOutfit = await createOutfit(db, outfit)
    await addItemsToOutfit(db, items_ids, idNewOutfit)
    if (date)
      await addOutfitsOnDate(db, [idNewOutfit], date)
  }
  else {
    await deleteAllItemsFromOutfit(db, outfit.id)
    await addItemsToOutfit(db, items_ids, outfit.id)
    //TODO: override name/icon for outfit
    await updateOutfit(db, outfit.id, {name: outfit.name, icon: outfit.icon});

  }
  console.log('Added Items to Outfit')
} 

//? in order to bypass typescript warning, if it doesn't exist just return 
export const deleteOutfit = async (outfit_id?: number) => {
  if (!outfit_id) return;

  const db = await getDBConnection()
  
  await deleteAllItemsFromOutfit(db, outfit_id)
  await deleteOutfitPlanner(db, outfit_id)
  await deleteOutfitFromDB(db, outfit_id)
}