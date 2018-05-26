// @flow
import React from "react";
import { View, Platform } from "react-native";
import { withTheme } from "styled-components";
import { List, ListItem } from "react-native-elements";
import type NavigationScreenProp from "react-navigation";
import { connect } from "react-redux";
import Header from "../../components/Header";
import type { Filters } from "../../reducers/filters";
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
  theme: Object,
  navigatior: any
};

class FiltersModal extends React.Component<Props> {
  static navigatorStyle = { navBarHidden: true, tabBarHidden: true };

  render() {
    const {
      theme,
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
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Header
          title="Filtros"
          leftItem={{
            icon: "window-close",
            iconType: "material-community",
            onPress: () => this.props.navigator.dismissModal()
          }}
          rightItem={{
            title: "Restablecer",
            layout: "title",
            onPress: resetFilters
          }}
          itemsColor="white"
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
            switchThumbTintColor={
              Platform.OS !== "ios" ? theme.colors.primary : null
            }
            switchOnTintColor={
              Platform.OS === "ios" ? theme.colors.primary : null
            }
          />
          <ListItem
            switchButton
            hideChevron
            switched={sleep}
            title="Mostrar donde dormir"
            onSwitch={toggleSleepFilter}
            switchThumbTintColor={
              Platform.OS !== "ios" ? theme.colors.primary : null
            }
            switchOnTintColor={
              Platform.OS === "ios" ? theme.colors.primary : null
            }
          />
          <ListItem
            switchButton
            hideChevron
            switched={activities}
            title="Mostrar actividades"
            onSwitch={toggleActivityFilter}
            switchThumbTintColor={
              Platform.OS !== "ios" ? theme.colors.primary : null
            }
            switchOnTintColor={
              Platform.OS === "ios" ? theme.colors.primary : null
            }
          />

          <ListItem
            switchButton
            hideChevron
            switched={services}
            title="Mostrar servicios"
            onSwitch={toggleServicesFilter}
            switchThumbTintColor={
              Platform.OS !== "ios" ? theme.colors.primary : null
            }
            switchOnTintColor={
              Platform.OS === "ios" ? theme.colors.primary : null
            }
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
