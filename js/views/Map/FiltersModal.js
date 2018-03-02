import React from "react";
import { View, Text } from "react-native";
import { withTheme } from "styled-components";
import Header from "../../components/Header";
class FiltersModal extends React.Component {
    clearFilters = () => {
        // no op
    };
    render() {
        const { theme, navigation } = this.props;
        return (
            <View>
                <Header
                    title={"Filtros"}
                    navItem={{
                        icon: require("../../components/img/header/x.png"),
                        onPress: () => navigation.goBack(null)
                    }}
                    rightItem={{
                        title: "Restablecer",
                        layout: "title",
                        onPress: this.clearFilters
                    }}
                    backgroundColor={theme.colors.primary}
                    titleColor={theme.colors.highContrast}
                />
                <Text style={{ fontSize: 40, color: "red" }}>
                    {" "}
                    Flor me diseñas esta vista??
                </Text>
            </View>
        );
    }
}

export default withTheme(FiltersModal);
