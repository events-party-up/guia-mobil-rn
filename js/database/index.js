import Realm from "realm";
import ItemSchema from "./schemas/Item";

export * from "./schemas/Item";

let realmSingleton;

const getRealm = () => {
  if (realmSingleton) return Promise.resolve(realmSingleton);
  return Realm.open({
    schema: [ItemSchema],
    deleteRealmIfMigrationNeeded: true
  }).then(realm => {
    realmSingleton = realm;
    return realmSingleton;
  });
};

export default getRealm;
