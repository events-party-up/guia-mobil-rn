import MapboxClient from "mapbox";
import config from "./utils/config";

const client = new MapboxClient(config.get("MAPBOX_ACCESS_TOKEN"));
export default client;
