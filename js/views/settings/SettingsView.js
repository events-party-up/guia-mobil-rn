// @flow
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { List, ListItem } from "react-native-elements";
import { withTheme } from "styled-components";
import Header from "../../components/Header";
import { connect } from "react-redux";

type Props = {
  navigator: Object,
  theme: Object,
  activeLangName: string,
  toggleNotifications: () => void
};

const SettingsView = ({
  toggleNotifications,
  theme,
  navigator,
  activeLangName
}: Props) => (
  <View style={styles.container}>
    <Header
      title={"Settings"}
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
          onSwitch={toggleNotifications}
          switchOnTintColor={theme.colors.primary}
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
    </ScrollView>
  </View>
);

SettingsView.navigatorStyle = { navBarHidden: true };

const mapStateToProps = state => ({
  activeLangName: state.lang.name
});

export default withTheme(connect(mapStateToProps)(SettingsView));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe9f1"
  }
});
