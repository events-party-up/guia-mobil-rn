// @flow
/* eslint-disable react/no-multi-comp */
import React from "react";
import {
  Dimensions,
  View,
  Image,
  ToolbarAndroid,
  Platform,
  TouchableOpacity
} from "react-native";
import { Text, HeaderTitle } from "./common/Text";
import F8Colors from "./common/F8Colors";
import F8Fonts from "./common/F8Fonts";
import StyleSheet from "./common/F8StyleSheet";
import { Header as RNEHeader, Icon } from "react-native-elements";
/* Config
============================================================================= */

let STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 35 : 40;
if (Platform.OS === "android") {
  STATUS_BAR_HEIGHT = 15;
}

const HEADER_HEIGHT =
  Platform.OS === "ios" ? 45 + STATUS_BAR_HEIGHT : 45 + STATUS_BAR_HEIGHT;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IOS_ITEM_TEXT_SIZE = SCREEN_WIDTH < 375 ? 10 : 13;

const FAVORITE_ICON_WIDTH = 37;
const FAVORITE_ICON_HEIGHT = 31;

export type Layout =
  | "default" // Use platform defaults (icon on Android, text on iOS)
  | "icon" // Always use icon
  | "title"; // Always use title

export type Item = {
  title?: string,
  icon?: string,
  typeType?: string,
  layout?: Layout,
  onPress?: () => void
};

export type Props = {
  title?: string,
  leftItem?: Item,
  rightItem?: Item,
  extraItems?: Array<Item> /* eslint-disable-line react/no-unused-prop-types */,
  style?: any,
  children?: any,
  navItem?: any,
  backgroundColor?: string,
  titleColor?: string,
  itemsColor: ?string /* eslint-disable-line react/no-unused-prop-types */
};

const ICON_ACTIVE_OPACITY = 0.7;

const Header = ({
  title,
  leftItem,
  rightItem,
  navItem,
  extraItems,
  backgroundColor,
  titleColor,
  itemsColor
}: Props) => {
  let leftIcon = null;
  let _leftItem = null;
  if (navItem && navItem.back) {
    leftIcon = (
      <Icon
        name="chevron-left"
        type="feather"
        color={itemsColor}
        containerStyle={styles.icon}
      />
    );
    _leftItem = (
      <TouchableOpacity
        activeOpacity={ICON_ACTIVE_OPACITY}
        onPress={navItem.onPress}
      >
        {leftIcon}
      </TouchableOpacity>
    );
  } else if (leftItem) {
    _leftItem = (
      <TouchableOpacity
        activeOpacity={ICON_ACTIVE_OPACITY}
        onPress={leftItem.onPress}
        style={{ alignItems: "baseline", flexDirection: "row" }}
      >
        <Icon
          size={26}
          name={leftItem.icon}
          type={leftItem.iconType}
          color={itemsColor}
          containerStyle={styles.icon}
        />
      </TouchableOpacity>
    );
  }

  let _rightItem = null;
  let _rightIcon = null;
  if (rightItem && rightItem.icon) {
    _rightIcon = (
      <Icon
        name={rightItem.icon}
        type={rightItem.iconType}
        color={itemsColor}
        containerStyle={styles.icon}
      />
    );
    _rightItem = (
      <TouchableOpacity
        activeOpacity={ICON_ACTIVE_OPACITY}
        onPress={rightItem.onPress}
        style={[
          styles.iconWrapper,
          {
            paddingRight: 0
          }
        ]}
      >
        {_rightIcon}
      </TouchableOpacity>
    );
  } else if (rightItem && rightItem.layout === "title") {
    _rightItem = (
      <TouchableOpacity
        activeOpacity={ICON_ACTIVE_OPACITY}
        onPress={rightItem.onPress}
        style={[
          styles.iconWrapper,
          {
            paddingRight: 0
          }
        ]}
      >
        <Text style={{ color: itemsColor }}>{rightItem.title}</Text>
      </TouchableOpacity>
    );
  }
  const rightComponent = (
    <View style={styles.row}>
      {extraItems &&
        extraItems.map(item => (
          <TouchableOpacity
            key={item.icon}
            onPress={item.onPress}
            style={styles.iconWrapper}
            activeOpacity={ICON_ACTIVE_OPACITY}
          >
            <Icon
              name={item.icon}
              type={item.iconType}
              color={itemsColor}
              containerStyle={styles.icon}
            />
          </TouchableOpacity>
        ))}
      {_rightItem}
    </View>
  );

  return (
    <RNEHeader
      backgroundColor={backgroundColor}
      leftComponent={_leftItem}
      centerComponent={{
        text: title,
        style: {
          position: "absolute",
          left: 48,
          right: 48,
          color: titleColor,
          fontSize: 18,
          lineHeight: 32,
          fontFamily: "nunito",
          alignItems: "center"
        }
      }}
      outerContainerStyles={{
        borderBottomWidth: 0,
        paddingTop: STATUS_BAR_HEIGHT,
        height: HEADER_HEIGHT
      }}
      innerContainerStyles={{ alignItems: "center", height: 40 }}
      rightComponent={rightComponent}
    />
  );
};

export default Header;
/* eslint-disable react/no-multi-comp */

const styles = {
  row: {
    flexDirection: "row"
  },
  icon: {
    justifyContent: "center",
    alignItems: "center"
  },
  iconWrapper: {
    paddingHorizontal: 10
  },
  title: {
    flex: 1,
    height: 45,
    backgroundColor: "red",
    borderWitdth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "baseline"
  }
};
