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
import { getImageUrl } from "../utils";
import type { Gallery } from "../reducers/galleries";
const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;
const lakeImage = require("./img/lake.jpeg");

type Props = {
  gallery: Gallery
};

const ImageGalleryPreview = ({ gallery }: Props) => {
  return (
    <TouchableOpacity style={{ width: WINDOW_WIDTH, height: IMAGE_HEIGHT }}>
      <Swiper
        height={IMAGE_HEIGHT}
        dot={<View style={styles.dotStyle} />}
        activeDot={<View style={styles.activeDotStyle} />}
        paginationStyle={{
          bottom: 20,
          left: 0,
          right: 0
        }}
        loop
      >
        {gallery.map(picture => (
          <Image
            key={picture.id}
            source={
              picture.image
                ? {
                    uri: getImageUrl(picture.image)
                  }
                : lakeImage
            }
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
