// @flow

import React from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { List, ListItem } from "react-native-elements";
import { withTheme } from "styled-components";
import Header from "../../components/Header";
import { connect } from "react-redux";
import I18n from "../../i18n";
import * as actions from "../../actions";
import type { Dispatch } from "../../actions/types";

type Props = {
  navigator: Object,
  theme: Object,
  activeLangName: string,
  toggleNotifications: () => void,
  isAuthenticated: boolean,
  dispatch: Dispatch
};

const SettingsView = ({
  toggleNotifications,
  theme,
  navigator,
  activeLangName,
  isAuthenticated,
  authProvider,
  dispatch
}: Props) => (
  <View style={styles.container}>
    <Header
      title={I18n.t("navigation.settings.title")}
      leftItem={{
        icon: "window-close",
        iconType: "material-community",
        onPress: () => navigator.dismissModal()
      }}
      itemsColor="white"
      backgroundColor={theme.colors.primary}
      titleColor={theme.colors.highContrast}
    />
    <ScrollView style={styles.container}>
      <List>
        <ListItem
          title="Idioma"
          onPress={() =>
            navigator.push({
              screen: "animus.LanguageSelectorView",
              passProps: { title: "Licences" }
            })
          }
          rightTitle={activeLangName}
        />
        <ListItem
          switchButton
          hideChevron
          switched
          title="Notificaciones"
          switchThumbTintColor={
            Platform.OS !== "ios" ? theme.colors.primary : null
          }
          onSwitch={toggleNotifications}
          switchOnTintColor={
            Platform.OS === "ios" ? theme.colors.primary : null
          }
        />
      </List>

      <List>
        <ListItem hideChevron title="Version" />
        <ListItem
          title="Terminos y condiciones"
          onPress={() =>
            navigator.push({
              screen: "animus.SettingsContentView",
              passProps: { title: "Terms" }
            })
          }
        />
        <ListItem
          title="Acerca de nosotros"
          onPress={() =>
            navigator.push({
              screen: "animus.SettingsContentView",
              passProps: { title: "About" }
            })
          }
        />
        <ListItem
          title="Licencias de software libre"
          onPress={() =>
            navigator.push({
              screen: "animus.SettingsContentView",
              passProps: { title: "Licences" }
            })
          }
        />
      </List>
      {isAuthenticated && (
        <List>
          <ListItem
            title="Logout"
            onPress={() => dispatch(actions.logout(authProvider))}
          />
        </List>
      )}
    </ScrollView>
  </View>
);

SettingsView.navigatorStyle = { navBarHidden: true };

const mapStateToProps = state => ({
  activeLangName: state.lang.name,
  isAuthenticated: state.auth.isAuthenticated,
  authProvider: state.auth.provider
});

export default withTheme(connect(mapStateToProps)(SettingsView));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee"
  }
});
