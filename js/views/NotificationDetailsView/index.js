// @flow
import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import Hyperlink from "react-native-hyperlink";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import Header from "../../components/Header";
import I18n from "../../i18n";
import { Heading2 } from "../../components/common/Text";
import { getNotificationWithId } from "../../reducers";
import type { Notification } from "../../reducers/notifications";
import * as actions from "../../actions";

type Props = {
  dispatch: Function,
  theme: Object,
  navigator: Object,
  notification: Notification
};

const DateText = styled.Text`
  font-family: "Nunito";
  font-size: 12px;
  font-weight: 200;
  color: ${props => props.theme.colors.primary};
`;

const SCREEN_WIDTH = Dimensions.get("window").width;

class NotificationsDetailsView extends Component<Props> {
  static navigatorStyle = { navBarHidden: true };

  componentDidMount() {
    const { id } = this.props.notification;
    this.props.dispatch(actions.notificationSeen(id));
  }

  render() {
    const { navigator, theme, notification } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          navItem={{ back: true, onPress: () => navigator.pop() }}
          title={I18n.t("navigation.notifications.title")}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor="white"
        />
        {notification && (
          <ScrollView style={styles.container}>
            <Image
              style={{ height: 200, width: SCREEN_WIDTH, resizeMode: "cover" }}
              source={{ uri: notification.imageUrl }}
            />
            <View style={styles.innerContainer}>
              <DateText>
                {moment(notification.date).format("DD/MM/YYYY - HH:mm")}
              </DateText>
              <Heading2 lines={2} style={{ textAlign: "left" }}>
                {notification.title}
              </Heading2>
              <Hyperlink linkDefault linkStyle={{ color: "#2980b9" }}>
                <Text style={styles.text}>{notification.content}</Text>
              </Hyperlink>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (
  state,
  ownProps: {
    notificationId: number | string
  }
) => ({
  notification: getNotificationWithId(state, ownProps.notificationId)
});

export default connect(mapStateToProps)(withTheme(NotificationsDetailsView));

// styles
// ===================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee"
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  }
});
