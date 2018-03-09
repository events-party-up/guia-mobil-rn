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
    chars: "int?[]"
  }
};

export default ItemSchema;

export const itemsToArray = items =>
  items.map(item => {
    const object = {};
    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const property in ItemSchema.properties) {
      object[property] = item[property];
    }
    return object;
  });
