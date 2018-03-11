// @flow
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Swiper from "react-native-swiper";
const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;

type Props = {
  gallery: { source: number | { uri: string } }[],
  onChangeActiveImage: number => void
};

const ImageGalleryPreview = ({ gallery, onChangeActiveImage }: Props) => {
  return (
    <TouchableOpacity style={{ width: WINDOW_WIDTH, height: IMAGE_HEIGHT }}>
      <Swiper
        height={IMAGE_HEIGHT}
        dotStyle={styles.dotStyle}
        loop
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={{
          bottom: 10,
          left: 0,
          right: 0
        }}
        onIndexChanged={onChangeActiveImage}
      >
        {gallery.map(picture => (
          <Image
            key={picture.id}
            source={picture.source}
            resizeMode="cover"
            style={{
              width: WINDOW_WIDTH,
              height: IMAGE_HEIGHT
            }}
          />
        ))}
      </Swiper>
    </TouchableOpacity>
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
