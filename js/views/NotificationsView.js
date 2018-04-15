// @flow
import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { withTheme } from "styled-components";
import faker from "faker";
import Header from "../components/Header";
import I18n from "../i18n";
import NotificationCard from "../components/NotificationsView/NotificationCard";

const mockNotifications = [
  {
    id: 1,
    title: faker.hacker.phrase(),
    content: faker.lorem.paragraph(),
    date: faker.date.recent()
  },
  {
    id: 2,
    title: faker.hacker.phrase(),
    content: faker.lorem.paragraph(),
    date: faker.date.recent()
  },
  {
    id: 3,
    title: faker.hacker.phrase(),
    content: faker.lorem.paragraph(),
    date: faker.date.recent()
  },
  {
    id: 4,
    title: faker.hacker.phrase(),
    content: faker.lorem.paragraph(),
    date: faker.date.recent()
  }
];

type Props = {
  dispatch: Function,
  theme: Object,
  navigator: Object
};

class NotificationsView extends Component<Props> {
  static navigatorStyle = { navBarHidden: true };

  render() {
    const { theme, navigator } = this.props;
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
        <ScrollView style={styles.container}>
          {mockNotifications.map(notification => {
            return <NotificationCard key={notification.id} {...notification} />;
          })}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme(NotificationsView);

// styles
// ===================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe9f1",
    paddingHorizontal: 20
  }
});
