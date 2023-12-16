// WIP
// Outfit --- OutfitClothing --- ClothingItem
export type Outfit = {
  id: number;

}

export type OutfitClothing = {
  id_outfit: number;
  id_clothing: number;
}

export type ClothingItem = {
  id: number | null;
  adjective: string;
  type: string;
  subtype: string;
  seasons: string;
  image: string;
  // Separate tables, many-to-many relationship
  // colorsID: number;
  // weatherID: number;
  // materialsID: number;
};

// Item --- ItemConditions --- Conditions
// ++ This is a proactive way of making it easier to add new weather conditions if needed. ++
export type ItemCondition = {
  id: number;
  id_item: number;
  id_condition: number; 
}

export type Condition = {
  id: number;
  name: string;
  icon: string;
}

export type ItemColor = {
  id: number,
  id_item: number;
  color: string; 
}

// ++ This is a proactive way of making it easier to add new materials if needed. ++
export type ItemMaterial = {
  id: number;
  id_item: number;
  id_material: number; 
}

export type Material = {
  id: number,
  name: string;
  icon: string;
}
