import React from "react";
import { View, Button, Text } from "react-native";

import { FacebookLoginButton } from "../components/FacebookLoginButton";
import { connect } from "react-redux";

class HomeView extends React.Component {
    navigateToMap = () => {
        this.props.navigation.navigate("Map");
    };

    render() {
        const { userName, isAuthenticated, profilePic } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Text>HomeView</Text>

                {isAuthenticated && (
                    <View>
                        <Text>{userName} </Text>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{
                                uri: profilePic
                            }}
                        />
                    </View>
                )}
                <FacebookLoginButton />
                <Button
                    title="Show Map"
                    onPress={this.navigateToMap}
                    buttonStyle={{
                        backgroundColor: "rgba(92, 99,216, 1)",
                        width: 300,
                        height: 45,
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 5
                    }}
                    textStyle={{ color: "white" }}
                />
                <Button
                    onPress={() => {
                        this.props.navigation.navigate("Tabs");
                    }}
                    title="Show Categories "
                />
            </View>
        );
    }
}
const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    userName:
        auth.isAuthenticated && auth.userProfile
            ? `${auth.userProfile.firstName} ${auth.userProfile.lastName}`
            : "",
    profilePic:
        auth.isAuthenticated && auth.userProfile
            ? auth.userProfile.profilePic
            : ""
});
export default connect(mapStateToProps)(HomeView);
