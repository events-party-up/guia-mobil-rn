// @flow
import React from "react";
import { Text } from "react-native";

type Props = {
    icon: string,
    style?: object,
    size: number
};

const GuideIcon = ({ icon, size, style }: Props) => (
    <Text
        style={[
            {
                fontFamily: "guide-v01",
                paddingHorizontal: 10,
                fontSize: size
            },
            style
        ]}
    >
        {String.fromCharCode(parseInt(icon, 16))}
    </Text>
);

GuideIcon.defaultProps = {
    size: 28
};
export default GuideIcon;
