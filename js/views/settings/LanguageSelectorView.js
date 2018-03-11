// @flow
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { List, ListItem } from "react-native-elements";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import Header from "../../components/Header";
import { availableLangs } from "../../config";
import I18n from "../../i18n";

type Props = {
  theme: Object,
  navigator: Object,
  activeLangCode: string,
  setActiveLang: string => void
};

const LanguageSelectorView = ({
  theme,
  navigator,
  activeLangCode,
  setActiveLang
}: Props) => (
  <View style={styles.container}>
    <Header
      title="Configurar Idioma"
      navItem={{
        back: true,
        onPress: () => navigator.pop()
      }}
      itemsColor="white"
      backgroundColor={theme.colors.primary}
      titleColor={theme.colors.highContrast}
    />
    <ScrollView style={styles.container}>
      <List>
        {availableLangs.map(lang => (
          <ListItem
            title={lang.name}
            key={lang.code}
            titleContainerStyle={{ height: 31, justifyContent: "center" }}
            hideChevron={lang.code !== activeLangCode}
            rightIcon={{
              name: "md-checkmark",
              type: "ionicon",
              color: theme.colors.primary
            }}
            onPress={() => setActiveLang(lang)}
          />
        ))}
      </List>
    </ScrollView>
  </View>
);

LanguageSelectorView.navigatorStyle = { navBarHidden: true };

const mapStateToProps = state => ({
  activeLangCode: state.lang.code
});

const mapDispatchToProps = dispatch => ({
  setActiveLang({ code, name }) {
    I18n.locale = "code";
    dispatch({
      type: "SET_ACTIVE_LANG",
      code,
      name
    });
  }
});

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(LanguageSelectorView)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe9f1"
  }
});
