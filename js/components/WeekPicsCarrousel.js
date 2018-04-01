import React from "react";
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Swiper from "react-native-swiper";
import { getImageUrl } from "../utils";

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const WIDTH = WINDOW_WIDTH - 2 * CONTAINER_PADDING_H;
const HEIGHT = WIDTH * 0.675;

const WeekPicsCarrousel = ({ pictures }) => {
    return (
        <View style={styles.wrapper}>
            <Swiper
                height={HEIGHT}
                width={WIDTH}
                dot={
                    <View
                        style={{
                            backgroundColor: "rgba(255,255,255,.6)",
                            width: 5,
                            height: 5,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}
                    />
                }
                activeDot={
                    <View
                        style={{
                            backgroundColor: "#fff",
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}
                    />
                }
                paginationStyle={{
                    bottom: 20,
                    left: 0,
                    right: 0
                }}
                loop
            >
                {pictures.map(picture => (
                    <TouchableOpacity activeOpacity={0.7} key={picture.id}>
                        <Image
                            style={styles.weekImage}
                            source={{ uri: getImageUrl(picture.image) }}
                        />
                    </TouchableOpacity>
                ))}
            </Swiper>
        </View>
    );
};

export default WeekPicsCarrousel;

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 8,
        overflow: "hidden"
    },
    weekImage: {
        width: WIDTH,
        height: HEIGHT,
        resizeMode: "cover"
    }
});
