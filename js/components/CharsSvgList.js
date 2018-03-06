import React from "react";
import { WebView } from "react-native";
import { withTheme } from "styled-components";

const CharsSvgList = ({ charList, style, theme }) => {
  if (charList.length) {
    const icons = charList.map(char => char.icon).join(" ");
    return (
      <WebView
        scrollEnable={false}
        bounces={false}
        javaScriptEnabled={false}
        scalesPageToFit={false}
        style={[
          {
            height: 80
          },
          style
        ]}
        source={{
          html: `
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body>
              <style>
              svg {
                width: 30px;
                height: 30px;
                fill: blue;
                display: inline-block;
                margin: 10px;
                fill: ${theme.colors.primary};
              }
              svg path {
                fill: ${theme.colors.primary};
              }
              svg circle {
                fill: ${theme.colors.primary};
              }
              body {
                height: 60px;
                display: flex;
                align-items: center;
                overflow: auto;
              }
            </style>
             
                ${icons}
             </body>
             <html>`
        }}
      />
    );
  }
  return null;
};

export default withTheme(CharsSvgList);
