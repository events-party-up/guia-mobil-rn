import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Callout } from "react-native-maps";
import { Icon } from "react-native-elements";

const ItemCallout = props => {
  const { data, itemId } = props;
  return (
    <Callout style={styles.calloutView} onPress={props.onPress}>
      <View>
        <Icon
          name={data.isFavorite ? "heart" : "heart-outline"}
          type="material-community"
          color="#0a71b3"
          size={24}
        />
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {data && data.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {data && data.address}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>VER MAS</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>LLEVARME</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Callout>
  );
};

export default ItemCallout;

const styles = {
  calloutView: {
    backgroundColor: "white",
    padding: 10,
    maxWidth: 200
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
    fontSize: 10
  }
};
