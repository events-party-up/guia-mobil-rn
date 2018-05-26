// @flow

import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import type { Notification } from "../../reducers/notifications";
import Header from "../../components/Header";
import I18n from "../../i18n";
import NotificationCard from "../../components/NotificationsView/NotificationCard";

type Props = {
  dispatch: Function,
  theme: Object,
  navigator: Object,
  notifications: Notification[]
};

class NotificationsView extends Component<Props> {
  static navigatorStyle = { navBarHidden: true };

  navigateToNotification = (notificationId: string) => {
    console.log("NOTTT!!!!", notificationId);
    this.props.navigator.push({
      screen: "animus.NotificationDetailsView",
      passProps: {
        notificationId
      }
    });
  };

  renderEmptyNotificationsView = notifications => {
    if (notifications && notifications.length) {
      return null;
    }
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View>
          <Icon
            name="notifications-none"
            type="material-icons"
            iconStyle={{
              fontSize: 160,
              color: "#bababa"
            }}
          />
          <Text>Su lista de notificaciones está vacia</Text>
        </View>
      </View>
    );
  };

  renderNotificationRow = ({ item }) => {
    return (
      <NotificationCard
        {...item}
        onPress={() => this.navigateToNotification(item.id)}
      />
    );
  };

  renderNotificationList = notifications => {
    if (notifications && notifications.length) {
      return (
        <View style={styles.container}>
          <FlatList
            style={styles.container}
            data={notifications}
            renderItem={this.renderNotificationRow}
            keyExtractor={item => `notification_${item.id}`}
          />
        </View>
      );
    }
    return null;
  };

  render() {
    const { theme, navigator, notifications } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header
          leftItem={{
            icon: "window-close",
            iconType: "material-community",
            onPress: () => navigator.dismissModal()
          }}
          title={I18n.t("navigation.notifications.title")}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor="white"
        />
        {this.renderEmptyNotificationsView(notifications)}
        {this.renderNotificationList(notifications)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications.push
  };
};
export default connect(mapStateToProps)(withTheme(NotificationsView));

// styles
// ===================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee"
  }
});
