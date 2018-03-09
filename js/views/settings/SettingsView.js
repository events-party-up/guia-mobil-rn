// @flow
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { List, ListItem } from "react-native-elements";
import { withTheme } from "styled-components";
import Header from "../../components/Header";
import type NavigationScreenProp from "react-navigation";

type Props = {
  navigation: NavigationScreenProp,
  theme: Object,
  toggleNotifications: () => void
};

const SettingsView = ({ toggleNotifications, theme, navigation }: Props) => (
  <View style={styles.container}>
    <Header
      title={"Settings"}
      leftItem={{
        icon: "window-close",
        iconType: "material-community",
        onPress: () => navigation.goBack(null)
      }}
      itemsColor="white"
      backgroundColor={theme.colors.primary}
      titleColor={theme.colors.highContrast}
    />
    <ScrollView style={styles.container}>
      <List>
        <ListItem title="Idioma" />
        <ListItem
          switchButton
          hideChevron
          switched={true}
          title="Notificaciones"
          onSwitch={toggleNotifications}
          switchOnTintColor={theme.colors.primary}
        />
      </List>

      <List>
        <ListItem hideChevron title="Version" />
        <ListItem
          title="Terminos y condiciones"
          onPress={() => navigation.navigate("Details", { title: "Terms" })}
        />
        <ListItem
          title="Acerca de nosotros"
          onPress={() => navigation.navigate("Details", { title: "About" })}
        />
        <ListItem
          title="Licencias de software libre"
          onPress={() => navigation.navigate("Details", { title: "Licences" })}
        />
      </List>
    </ScrollView>
  </View>
);

export default withTheme(SettingsView);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
