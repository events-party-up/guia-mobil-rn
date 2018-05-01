// @flow

import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
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

  renderNotificationRow = ({ item }) => {
    return (
      <NotificationCard
        {...item}
        onPress={() => this.navigateToNotification(item.id)}
      />
    );
  };

  render() {
    const { theme, navigator, notifications } = this.props;
    return (
      <View style={{ flex: 1 }}>
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
        <View style={styles.container}>
          <FlatList
            style={styles.container}
            data={notifications}
            renderItem={this.renderNotificationRow}
            keyExtractor={item => `notification_${item.id}`}
          />
        </View>
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
