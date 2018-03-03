import React from "react";
import { Text } from "react-native";
import { ButtonGroup } from "react-native-elements";

const component1 = () => <Text>A/Z</Text>;
const component2 = () => <Text>Popular</Text>;
const component3 = () => <Text>Distancia</Text>;
const component4 = () => <Text>Precio</Text>;

const SortButtons = ({ activeSorterIndex, onChangeSorter }) => {
  const buttons = [
    { element: component1 },
    { element: component2 },
    { element: component3 },
    { element: component4 }
  ];
  return (
    <ButtonGroup
      onPress={onChangeSorter}
      selectedIndex={activeSorterIndex}
      buttons={buttons}
      containerStyle={{ height: 40 }}
    />
  );
};

export default SortButtons;
