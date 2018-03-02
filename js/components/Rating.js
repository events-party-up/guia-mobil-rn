// @flow
import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components";
import { Icon } from "react-native-elements";

const RatingIcon = styled(Icon).attrs({
    color: props => props.theme.colors.primary
})``;

const outlinedStarSource = require("./img/star-outline.png");
const filledStarSource = require("./img/star.png");
type RatingType = "star" | "circle";

type Props = {
    type: RatingType,
    style: any,
    imageSize: number,
    rating: number
};

const Rating = ({ rating, style, imageSize, type, ...rest }: Props) => {
    let ratingIcons = {
        filled: {
            name: "star",
            type: "material-community"
        },
        semi: {
            name: "star-half",
            type: "material-icons"
        },
        empty: {
            name: "star-border",
            type: "material-icons"
        }
    };

    if (type === "circle") {
        ratingIcons = {
            filled: {
                name: "circle",
                type: "material-community"
            },
            semi: {
                name: "circle-outline",
                type: "material-community"
            },
            empty: {
                name: "circle-outline",
                type: "material-community"
            }
        };
    }

    return (
        <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
            {[1, 2, 3, 4, 5].map(value => {
                if (value <= rating) {
                    return (
                        <RatingIcon {...ratingIcons.filled} size={imageSize} />
                    );
                } else if (value < rating && rating < value + 1) {
                    return (
                        <RatingIcon {...ratingIcons.semi} size={imageSize} />
                    );
                } else {
                    return (
                        <RatingIcon {...ratingIcons.empty} size={imageSize} />
                    );
                }
            })}
        </View>
    );
};

export default Rating;
