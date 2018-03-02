// @flow
import React from "react";
import { View } from "react-native";
import { withTheme } from "styled-components";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../components/Header";
import type { Filters } from "../../reducers/filters";
import type NavigationScreenProp from "react-navigation";
import {
  TOGGLE_EAT_FILTER,
  TOGGLE_SLEEP_FILTER,
  TOGGLE_ACTIVITY_FILTER,
  TOGGLE_SERVICES_FILTER,
  RESET_FILTERS
} from "../../reducers/filters";

type Props = Filters & {
  resetFilters: () => void,
  toggleEatFilter: () => void,
  toggleSleepFilter: () => void,
  toggleActivityFilter: () => void,
  toggleServicesFilter: () => void,
  navigation: NavigationScreenProp
};
class FiltersModal extends React.Component<Props> {
  clearFilters = () => {
    // no op
  };
  render() {
    const {
      theme,
      navigation,
      resetFilters,
      eat,
      sleep,
      activities,
      services,
      toggleActivityFilter,
      toggleEatFilter,
      toggleServicesFilter,
      toggleSleepFilter
    } = this.props;
    return (
      <View>
        <Header
          title="Filtros"
          navItem={{
            icon: require("../../components/img/header/x.png"),
            onPress: () => navigation.goBack(null)
          }}
          rightItem={{
            title: "Restablecer",
            layout: "title",
            onPress: resetFilters
          }}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <List>
          <ListItem
            switchButton
            hideChevron
            switched={eat}
            title="Mostrar donde comer"
            onSwitch={toggleEatFilter}
            switchOnTintColor={theme.colors.primary}
          />
          <ListItem
            switchButton
            hideChevron
            switched={sleep}
            title="Mostrar donde dormir"
            onSwitch={toggleSleepFilter}
            switchOnTintColor={theme.colors.primary}
          />
          <ListItem
            switchButton
            hideChevron
            switched={activities}
            title="Mostrar actividades"
            onSwitch={toggleActivityFilter}
            switchOnTintColor={theme.colors.primary}
          />
          <ListItem
            switchButton
            hideChevron
            switched={services}
            title="Mostrar servicios"
            onSwitch={toggleServicesFilter}
            switchOnTintColor={theme.colors.primary}
          />
        </List>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...state.filters
});

const mapDispatchToProps = dispatch => ({
  resetFilters() {
    dispatch({
      type: RESET_FILTERS
    });
  },
  toggleSleepFilter() {
    dispatch({
      type: TOGGLE_SLEEP_FILTER
    });
  },
  toggleEatFilter() {
    dispatch({
      type: TOGGLE_EAT_FILTER
    });
  },
  toggleActivityFilter() {
    dispatch({
      type: TOGGLE_ACTIVITY_FILTER
    });
  },
  toggleServicesFilter() {
    dispatch({
      type: TOGGLE_SERVICES_FILTER
    });
  }
});

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(FiltersModal)
);
