import Realm from "realm";

const ItemSchema = {
  name: "Item",
  primaryKey: "id",
  properties: {
    id: "int",
    category_id: { type: "int", indexed: true },
    is_featured: "int?",
    price: "float?",
    is_published: "int?",
    is_special: "int?",
    address: "string?",
    coord: "double?[]",
    name: "string",
    mail: "string?",
    description: "string",
    image: "string?",
    rating: "float?",
    url: "string?",
    chars: "int?[]",
    isFavorite: "bool?"
  }
};

export default ItemSchema;

export const itemsToArray = items =>
  items.map(item => {
    const object = Object.keys(ItemSchema.properties).reduce(
      (plainObj, property) => {
        plainObj[property] = item[property];
        return plainObj;
      },
      {}
    );
    object.coord = [item.coord[0], item.coord[1]];
    return object;
  });
