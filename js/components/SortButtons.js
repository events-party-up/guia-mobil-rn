// @flow
import React from "react";
import { ButtonGroup } from "react-native-elements";

const SortButtons = ({
  activeSorterIndex,
  onChangeSorter
}: {
  activeSorterIndex: number,
  onChangeSorter: () => void
}) => {
  const buttons = ["A/Z", "POPULAR", "DISTANCIA", "PRECIO"];
  const textStyle = {
    color: "white",
    fontFamily: "nunito",
    fontSize: 11,
    fontWeight: "bold"
  };
  return (
    <ButtonGroup
      onPress={onChangeSorter}
      innerBorderStyle={{ width: 0, color: "transparent" }}
      containerBorderRadius={0}
      selectedIndex={activeSorterIndex}
      buttonStyle={{ backgroundColor: "#0a71b3", marginHorizontal: 4 }}
      selectedButtonStyle={{ backgroundColor: "#0b99e2" }}
      textStyle={textStyle}
      selectedTextStyle={textStyle}
      buttons={buttons}
      containerStyle={{
        height: 40,
        borderWidth: 0,
        borderColor: "transparent"
      }}
    />
  );
};

export default SortButtons;
