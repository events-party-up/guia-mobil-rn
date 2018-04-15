// @flow
import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import CharsSvgList from "./CharsSvgList";
import Rating from "./Rating";

const WINDOW_WIDTH = Dimensions.get("window").width;

type InfoItemProps = {
  iconName: string,
  text: string,
  theme: Object
};

const InfoItem = ({ iconName, text, theme }: InfoItemProps) => {
  if (text) {
    return (
      <View style={styles.contactRow}>
        <Icon
          type="material-community"
          style={styles.contactRowIcon}
          name={iconName}
          color={theme.colors.primary}
        />
        <Text> {text} </Text>
      </View>
    );
  }
  return null;
};

const ItemInfoBlock = props => {
  const { phone, mail, address, rating, theme, price, itemChars, url } = props;
  return (
    <View style={styles.infoItems}>
      {/* address */}
      <InfoItem iconName="map-marker" text={address} theme={theme} />
      {/* phone */}
      <InfoItem iconName="phone" text={phone} theme={theme} />
      {/* price */}
      {!!price && (
        <View style={styles.contactRow}>
          <Icon
            type="material-icons"
            style={styles.contactRowIcon}
            name="attach-money"
            color={theme.colors.primary}
          />
          <Rating imageSize={12} rating={price} type="circle" />
        </View>
      )}
      {/* rating */}
      {!!rating && (
        <View style={styles.contactRow}>
          <Icon
            type="material-community"
            style={styles.contactRowIcon}
            name="star"
            color={theme.colors.primary}
          />
          <Rating imageSize={12} rating={rating} />
        </View>
      )}
      {/* feature icons */}
      <CharsSvgList charList={itemChars} style={{ width: WINDOW_WIDTH - 20 }} />
      {/* email */}
      <InfoItem iconName="email" text={mail} theme={theme} />
      {/* url */}
      <InfoItem iconName="link" text={url} theme={theme} />
    </View>
  );
};

export default withTheme(ItemInfoBlock);

// styles
// ====================================

const styles = StyleSheet.create({
  infoItems: {
    margin: 10
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
  },
  contactRowIcon: {
    width: 42,
    height: 30,
    borderWidth: 1,
    marginRight: 60
  }
});
