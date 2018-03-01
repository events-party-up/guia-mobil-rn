import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components";

const ColoredImage = styled.Image`
    tint-color: ${props => props.theme.colors.primary}
    height: ${props => props.imageSize}
    width: ${props => props.imageSize}
`;
const outlinedStarSource = require("./img/star-outline.png");
const filledStarSource = require("./img/star.png");

const Rating = ({ rating, style, imageSize, ...rest }) => (
    <View style={[{ flexDirection: "row" }, style]}>
        {[1, 2, 3, 4, 5].map(value => {
            if (value <= rating) {
                return (
                    <ColoredImage
                        key={value}
                        imageSize={imageSize}
                        source={filledStarSource}
                    />
                );
            } else {
                return (
                    <ColoredImage
                        key={value}
                        imageSize={imageSize}
                        source={outlinedStarSource}
                    />
                );
            }
        })}
    </View>
);

export default Rating;
