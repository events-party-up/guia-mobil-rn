// @flow
import * as React from "react";
import ReactNative from "react-native";
import StyleSheet from "./F8StyleSheet";
import F8Fonts from "./F8Fonts";
import F8Colors from "./F8Colors";

export function HeaderTitle({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.headerTitle, style]} {...props} />;
}
export function Text({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.text, style]} {...props} />;
}
export function Heading2({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h2, style]} {...props} />;
}

export function Heading3({ style, ...props }: Object): ReactElement {
    return <ReactNative.Text style={[styles.h3, style]} {...props} />;
  }
export function Heading4({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h4, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: F8Fonts.default
  },
  h1: {
    fontFamily: F8Fonts.h1,
    fontSize: F8Fonts.normalize(30),
    lineHeight: F8Fonts.lineHeight(37),
    color: F8Colors.blue
  },
  h2: {
    fontFamily: F8Fonts.h2,
    fontSize: F8Fonts.normalize(23),
    lineHeight: F8Fonts.lineHeight(27),
    color: F8Colors.tangaroa,
    letterSpacing: -0.24
  },
  h3: {
    fontFamily: F8Fonts.h3,
    fontSize: F8Fonts.normalize(17),
    lineHeight: F8Fonts.lineHeight(20),
    color: F8Colors.sapphire,
    letterSpacing: -0.11
  },
  h4: {
    fontFamily: F8Fonts.h4,
    fontSize: F8Fonts.normalize(13),
    lineHeight: F8Fonts.lineHeight(22),
    color: F8Colors.tangaroa
  },
  h5: {
    fontFamily: F8Fonts.helvetica,
    fontSize: F8Fonts.normalize(13),
    lineHeight: F8Fonts.lineHeight(22),
    color: F8Colors.tangaroa
  },
  p: {
    fontFamily: F8Fonts.p,
    fontSize: F8Fonts.normalize(17),
    lineHeight: F8Fonts.lineHeight(25),
    color: F8Colors.tangaroa
  },
  hr: {
    height: 1,
    backgroundColor: F8Colors.colorWithAlpha("black", 0.1)
  },
  headerTitle: {
    fontFamily: F8Fonts.fontWithWeight("helvetica", "semibold"),
    ios: { fontSize: 17 },
    android: { fontSize: 20 }
  }
});
