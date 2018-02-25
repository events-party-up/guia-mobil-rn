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

/* Config
============================================================================= */

let STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : 25;
if (Platform.OS === "android" && Platform.Version && Platform.Version < 21) {
  STATUS_BAR_HEIGHT = 0;
}
const HEADER_HEIGHT =
  Platform.OS === "ios" ? 45 + STATUS_BAR_HEIGHT : 60 + STATUS_BAR_HEIGHT;
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
  icon?: number,
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

/* =============================================================================
<F8Header /> (When Platform.os is Android)
--------------------------------------------------------------------------------
ToolbarAndroid header

============================================================================= */

class F8HeaderAndroid extends React.Component<Props> {
  static height: number;

  static defaultProps: Props = {
    backgroundColor: F8Colors.blue,
    titleColor: F8Colors.yellow,
    itemsColor: F8Colors.white
  };

  constructor() {
    super();

    this.limitActionSelection = false;
  }

  limitActionSelection: boolean;

  handleActionSelected = (position: number) => {
    if (this.limitActionSelection) {
      return;
    }
    let items = this.props.extraItems || [];
    if (this.props.rightItem) {
      items = [this.props.rightItem, ...items];
    }
    if (this.props.leftItem) {
      items = [this.props.leftItem, ...items];
    }
    const item = items[position];
    if (item && item.onPress) item.onPress();
    this.limitActionSelection = true;
    setTimeout(() => {
      this.limitActionSelection = false;
    }, 1000);
  };

  render() {
    const {
      navItem,
      leftItem,
      rightItem,
      extraItems,
      backgroundColor,
      titleColor
    } = this.props;

    let actions = [];
    if (leftItem) {
      const { title, icon, layout } = leftItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title,
        show: "always"
      });
    }
    if (rightItem) {
      const { title, icon, layout } = rightItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title,
        show: "always"
      });
    }
    if (extraItems) {
      actions = actions.concat(
        extraItems.map(item => ({
          title: item.title,
          show: "never"
        }))
      );
    }

    let content;
    if (React.Children.count(this.props.children) > 0) {
      content = (
        <View collapsable={false} style={{ flex: 1 }}>
          {this.props.children}
        </View>
      );
    } else {
      content = (
        <View collapsable={false} style={{ flex: 1, justifyContent: "center" }}>
          <HeaderTitle numberOfLines={1} style={{ color: titleColor }}>
            {this.props.title}
          </HeaderTitle>
        </View>
      );
    }

    return (
      <View style={[styles.header, { backgroundColor }, this.props.style]}>
        <ToolbarAndroid
          navIcon={navItem && navItem.icon}
          onIconClicked={navItem && navItem.onPress}
          title={this.props.title}
          titleColor={titleColor}
          subtitleColor={titleColor}
          actions={actions}
          onActionSelected={this.handleActionSelected}
          style={styles.toolbar}
        >
          {content}
        </ToolbarAndroid>
        <Text style={{ height: 0, opacity: 0 }}>{actions.length || 0}</Text>
      </View>
    );
  }
}
/* =============================================================================
<F8Header /> (When Platform.os is iOS)
--------------------------------------------------------------------------------
View header

============================================================================= */

class F8HeaderIOS extends React.Component<Props> {
  static height: number;

  static defaultProps = {
    backgroundColor: F8Colors.blue,
    titleColor: F8Colors.yellow,
    itemsColor: F8Colors.white
  };

  render() {
    const {
      navItem,
      leftItem,
      title,
      rightItem,
      backgroundColor,
      titleColor,
      itemsColor
    } = this.props;

    let left;
    if (navItem) {
      if (navItem.back) {
        navItem.icon = require("./img/header/back.png");
      }
      left = (
        <ItemWrapperIOS
          color={itemsColor}
          item={{ ...navItem, layout: "icon" }}
        />
      );
    } else {
      left = <ItemWrapperIOS color={itemsColor} item={leftItem} />;
    }

    const content =
      React.Children.count(this.props.children) === 0 ? (
        <HeaderTitle numberOfLines={1} style={{ color: titleColor }}>
          {title}
        </HeaderTitle>
      ) : (
        this.props.children
      );

    const right = <ItemWrapperIOS color={itemsColor} item={rightItem} />;

    return (
      <View style={[styles.header, { backgroundColor }, this.props.style]}>
        <View style={styles.leftItem}>{left}</View>
        <View
          accessible
          accessibilityLabel={title}
          accessibilityTraits="header"
          style={styles.centerItem}
        >
          {content}
        </View>
        <View style={styles.rightItem}>{right}</View>
      </View>
    );
  }
}

/* =============================================================================
<ItemWrapperIOS />
--------------------------------------------------------------------------------
Item wrapper

============================================================================= */

const ItemWrapperIOS = (props: { item: ?Item, color: ?string }) => {
  const { item, color } = props;
  if (!item) {
    return null;
  }

  let content;
  const { title, icon, layout, onPress } = item;

  if (layout !== "icon" && title) {
    content = (
      <Text style={[styles.itemText, { color }]}>{title.toUpperCase()}</Text>
    );
  } else if (icon) {
    content = <Image source={icon} style={{ tintColor: color }} />;
  }

  return (
    <TouchableOpacity
      accessibilityLabel={title}
      accessibilityTraits="button"
      onPress={onPress}
      style={styles.itemWrapper}
    >
      {content}
    </TouchableOpacity>
  );
};

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  toolbar: {
    android: {
      // backgroundColor: F8Colors.background,
      height: HEADER_HEIGHT - STATUS_BAR_HEIGHT
    }
  },
  header: {
    android: {
      paddingTop: STATUS_BAR_HEIGHT
    },
    ios: {
      backgroundColor: "transparent",
      paddingTop: STATUS_BAR_HEIGHT,
      height: HEADER_HEIGHT,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  },
  titleTextDivider: {
    android: {
      position: "absolute",
      height: 1,
      bottom: 0,
      backgroundColor: F8Colors.accent
    }
  },
  leftItem: {
    flex: 1,
    alignItems: "flex-start"
  },
  centerItem: {
    flex: 2,
    alignItems: "center"
  },
  rightItem: {
    flex: 1,
    alignItems: "flex-end"
  },
  itemWrapper: {
    padding: 11
  },
  itemText: {
    fontFamily: F8Fonts.helvetica,
    fontSize: IOS_ITEM_TEXT_SIZE,
    color: F8Colors.highContrast
  },
  favoriteIcon: {
    android: {
      position: "absolute",
      width: FAVORITE_ICON_WIDTH,
      height: FAVORITE_ICON_HEIGHT,
      top: HEADER_HEIGHT / 2 - FAVORITE_ICON_HEIGHT / 2 + STATUS_BAR_HEIGHT / 2,
      right: 0
    }
  }
});

const Header = Platform.OS === "ios" ? F8HeaderIOS : F8HeaderAndroid;

export default Header;
/* eslint-disable react/no-multi-comp */
