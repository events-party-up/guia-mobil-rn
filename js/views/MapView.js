import React from "react";
import { View, Text, Dimensions } from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import geoViewport from "@mapbox/geo-viewport";
import supercluster from "supercluster";
import BaseExamplePropTypes from "../components/common/BaseExamplePropTypes";
import TabBarPage from "../components/common/TabBarPage";
import sheet from "../styles/sheet";
import { onSortOptions, itemToGeoJSONPoint } from "../utils";
import { DEFAULT_CENTER_COORDINATE } from "../utils";
import config from "../utils/config";

const MAPBOX_VECTOR_TILE_SIZE = 512;
const MAX_ZOOM = 20;
const MIN_ZOOM = 10;

class ShowMap extends React.Component {
  static navigationOptions = { title: "Map" };
  constructor(props) {
    super(props);
    this.clustering = supercluster({
      radius: 30,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM
    });
    this.state = {
      pointsLoaded: false,
      clusteredItems: []
    };
  }
  componentDidMount() {
    this.setItems(this.props.items);
  }
  componentWillReceiveProps(nextProps) {
    console.log("receiving props");
    this.setItems(this.props.items);
  }

  setItems = items => {
    if (items) {
      const geoJSONItems = items.map(itemToGeoJSONPoint);
      console.log("!!!! loading points");
      this.clustering.load(geoJSONItems);

      this.setState({ pointsLoaded: true });
    }
  };

  async onDidFinishLoadingStyle() {
    console.log("styles loaded");
    const { width, height } = Dimensions.get("window");
    const bounds = geoViewport.bounds(
      DEFAULT_CENTER_COORDINATE,
      12,
      [width, height],
      MAPBOX_VECTOR_TILE_SIZE
    );

    const options = {
      name: config.get("REGION_NAME"),
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
      minZoom: 10,
      maxZoom: 20
    };

    // start download
    MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
  }
  recomputeClusters = regionFeature => {
    if (!regionFeature) return undefined;
    const { pointsLoaded } = this.state;
    if (pointsLoaded) {
      const { geometry, properties } = regionFeature;
      console.log({ geometry }, { properties });

      const [northLat, eastLong] = properties.visibleBounds[0];
      const [southLat, westLong] = properties.visibleBounds[1];
      console.log({ northLat }, { eastLong }, { southLat }, { westLong });
      console.log([westLong, southLat, eastLong, northLat]);
      const clustersItems = this.clustering.getClusters(
        [southLat, westLong, northLat, eastLong],
        Math.floor(properties.zoomLevel)
      );
      return clustersItems;
    }
    return [];
  };
  renderItems = () => {
    const { clusteredItems } = this.state;

    return clusteredItems.map(item => {
      const id = item.properties.cluster
        ? `cluster_${item.properties.cluster_id}`
        : `point_${item.properties.id}`;
      return (
        <MapboxGL.PointAnnotation
          key={id}
          pitchEnabled={false}
          showUserLocation={true}
          id={`${item.properties.id}`}
          coordinate={item.geometry.coordinates}
          onSelected={() => this.onAnnotationSelected(item)}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
        >
          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill}>
              {item.properties.cluster ? (
                <Text>{item.properties.point_count}</Text>
              ) : null}
            </View>
          </View>
          <MapboxGL.Callout title="Look! An annotation!" />
        </MapboxGL.PointAnnotation>
      );
    });
  };
  onAnnotationSelected = item => {
    console.log({ item });
    if (item.properties.cluster) {
      const zoom = this.clustering.getClusterExpansionZoom(
        item.properties.cluster_id
      );
      this._map.setCamera({
        centerCoordinate: item.geometry.coordinates,
        zoom
      });
    }
  };
  count = 0;
  onRegionDidChange = regionFeature => {
    console.log("count", this.count++);
    const clusteredItems = this.recomputeClusters(regionFeature);
    this.setState({ clusteredItems, regionFeature });
    // do other stuff here, nothing for now
  };
  render() {
    return (
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        style={sheet.matchParent}
        onRegionDidChange={this.onRegionDidChange}
        onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
        centerCoordinate={DEFAULT_CENTER_COORDINATE}
        zoomLevel={12}
        ref={c => (this._map = c)}
      >
        {this.renderItems()}
      </MapboxGL.MapView>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items.allIds
});

export default connect(mapStateToProps)(ShowMap);

const styles = {
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "orange",
    transform: [{ scale: 0.6 }],
    alignItems: "center",
    justifyContent: "center"
  },
  annotationText: {
    color: "white",
    backgroundColor: "transparent"
  }
};
