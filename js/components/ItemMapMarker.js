// @flow
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import styled from "styled-components";

type Props = {
    icon: string
};
const MarkerImage = styled.Image`
    width: 48px;
    height: 50px;
    resize-mode: contain;
    tint-color: ${props => props.theme.colors.primary};
    position: absolute;
    top: 0;
`;
const IconText = styled.Text`
    font-family: "guide-v01";
    font-size: 18px;
    color: white;
    margin-top: 10px;
    border-radius: 3px;
    background: ${props => props.theme.colors.primary};
`;

const ItemMapMarker = ({ icon, theme }: Props) => (
    <View style={styles.markerContainer}>
        <MarkerImage source={require("./img/ic_place.png")} />
        <IconText>{String.fromCharCode(parseInt(icon, 16))}</IconText>
    </View>
);

export default ItemMapMarker;

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: "center",
        justifyContent: "flex-start"
    }
});
