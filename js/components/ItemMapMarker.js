// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import styled from "styled-components";

type Props = {
  icon?: string | null,
  isActive: boolean
};
const MarkerImage = styled.Image`
  width: 48px;
  height: 50px;
  resize-mode: contain;
  tint-color: ${props =>
    props.isActive ? "white" : props.theme.colors.primary};
  position: absolute;
  top: 0;
`;
const IconText = styled.Text`
  font-family: "guide-v01";
  font-size: 18px;
  color: ${props => (props.isActive ? props.theme.colors.primary : "white")};
  margin-top: 10px;
  border-radius: 3px;
  background: ${props =>
    props.isActive ? "white" : props.theme.colors.primary};
`;

const ItemMapMarker = ({ icon, isActive = false }: Props) => (
  <View style={styles.markerContainer}>
    <MarkerImage isActive={isActive} source={require("./img/ic_place.png")} />
    {icon && (
      <IconText isActive={isActive}>
        {String.fromCharCode(parseInt(icon, 16))}
      </IconText>
    )}
  </View>
);

ItemMapMarker.defaultProps = {
  icon: null
};
export default ItemMapMarker;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
