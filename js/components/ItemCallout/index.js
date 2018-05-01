// @flow
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { computeDistanceBetweenPoints } from "../../utils/maps";
import { toggleFavorite } from "../../utils";
import { openRouteToItem } from "../../utils/maps";
type Props = {
  itemData?: { coord: number[], address: string, name: string },
  navigator: any,
  userLocation?: { latitude: number, longitude: number },
  isFavorite: boolean
};

const ItemCallout = (props: Props) => {
  const { itemData, navigator, userLocation } = props;
  let distance = "...";
  const itemCoord = itemData && [itemData.coord[0], itemData.coord[1]];
  const { latitude, longitude } = userLocation;

  if (userLocation && itemData && itemData.coord) {
    // it is an object and I need an array
    const numericDistance = computeDistanceBetweenPoints(itemCoord, [
      latitude,
      longitude
    ]);
    distance = `${numericDistance.toFixed(2)}km`;
  }
  if (itemData) {
    return (
      <View style={styles.calloutView}>
        <View style={styles.favoriteStatusContainer}>
          <TouchableOpacity
            onPress={() =>
              toggleFavorite(props.dispatch, itemData.id, props.isFavorite)
            }
          >
            <Icon
              name={props.isFavorite ? "heart" : "heart-outline"}
              type="material-community"
              color="#0b99e2"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleText}>
            {itemData && itemData.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.addressText}
          >
            {itemData && itemData.address}
          </Text>
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              navigator.push({
                screen: "animus.ItemDetailsView",
                passProps: {
                  item: itemData
                }
              });
            }}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>VER MAS</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openRouteToItem(itemCoord, [longitude, latitude]);
            }}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>LLEVARME</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  userLocation: state.location.coords
});

export default connect(mapStateToProps)(ItemCallout);

const styles = {
  calloutView: {
    backgroundColor: "white",
    padding: 13,
    flex: 1
  },
  favoriteStatusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  infoContainer: {
    flexDirection: "column"
  },
  actionsContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  button: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#0a71b3"
  },
  buttonText: {
    fontFamily: "nunito",
    color: "white",
    fontSize: 10,
    letterSpacing: 0.3
  },
  titleText: {
    fontFamily: "nunito",
    fontWeight: "bold",
    fontSize: 12,
    color: "#484848"
  },
  distanceText: {
    fontFamily: "nunito",
    fontWeight: "500",
    fontSize: 12,
    color: "#0a71b3"
  },
  addressText: {
    fontFamily: "nunito",
    fontWeight: "200",
    fontSize: 10,
    color: "#484848"
  }
};
