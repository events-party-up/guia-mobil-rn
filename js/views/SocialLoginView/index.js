import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { HeaderText, Container } from "./elements";
import { Text } from "../../components/common/Text";
import FacebookLoginButton from "../../components/LoginButton/FacebookLoginButton";
import GoogleLoginButton from "../../components/LoginButton/GoogleLoginButton";
// import TwitterLoginButton from "../../components/LoginButton/TwitterLoginButton";
import { connect } from "react-redux";

class SocialLoginView extends Component {
  static navigatorStyle = {
    drawUnderNavBar: false,
    navBarBackgroundColor: "#0a71b3",
    navBarButtonColor: "white",
    navBarTranslucent: true
  };
  static navigatorButtons = {
    leftButtons: [{ id: "cancel" }]
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.navigator.resetTo({
        screen: "animus.ReviewCreationView",
        passProps: {
          itemId: this.props.itemId
        }
      });
    }
  }

  onNavigatorEvent = event => {
    // this is the onPress handler for the two buttons together
    if (event.type === "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id === "cancel") {
        // this is the same id field from the static navigatorButtons definition
        this.props.navigator.dismissModal();
      }
    }
  };

  render() {
    return (
      <Container>
        <Image source={require("./img/logo_comment.png")} style={styles.logo} />
        <HeaderText> Nos interesa tu opinion! </HeaderText>
        <Text style={styles.description}>
          Para poder valora y comentar un lugar o servicio por favor
          identificate con alguno de estos medios
        </Text>
        <View style={styles.socialContainer}>
          <View>
            <FacebookLoginButton />
            <Text style={styles.loginButtonText}>Facebook</Text>
          </View>
          <View>
            <GoogleLoginButton />
            <Text style={styles.loginButtonText}>Google +</Text>
          </View>
        </View>

        <Text style={[styles.description, styles.disclaimer]}>
          Al identificare con alguno de los servicios confirmás que estás de
          acuerdo con las siguientes condiciones de Guia Barioche: Condición 1,
          Política de privacidad y Política conra la discriminación.
        </Text>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(SocialLoginView);

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 90,
    marginVertical: 30,
    resizeMode: "contain",
    alignSelf: "center"
  },
  description: {
    color: "white",
    paddingVertical: 30,
    textAlign: "center",
    fontSize: 16
  },
  disclaimer: {
    marginTop: "auto",
    marginBottom: 40,
    fontSize: 14,
    textAlign: "left"
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14
  }
});
