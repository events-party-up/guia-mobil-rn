// @flow
import React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;

type Props = {
  gallery: { id: number, source: number | { uri: string } }[],
  onChangeActiveImage: number => void
};

const ImageGalleryPreview = ({
  gallery,
  onChangeActiveImage,
  onPress
}: Props) => {
  return (
    <Swiper
      height={IMAGE_HEIGHT}
      width={WINDOW_WIDTH}
      dotStyle={styles.dotStyle}
      loop={false}
      activeDotStyle={styles.activeDotStyle}
      paginationStyle={{
        bottom: 10,
        left: 0,
        right: 0
      }}
      onIndexChanged={onChangeActiveImage}
    >
      {gallery.map(picture => (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          key={picture.id}
        >
          <Image
            source={picture.source}
            resizeMode="cover"
            style={{
              width: WINDOW_WIDTH,
              height: IMAGE_HEIGHT
            }}
          />
        </TouchableOpacity>
      ))}
    </Swiper>
  );
};

export default ImageGalleryPreview;

const styles = StyleSheet.create({
  dotStyle: {
    backgroundColor: "rgba(255,255,255,.6)",
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDotStyle: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  }
});
