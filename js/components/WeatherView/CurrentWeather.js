// @flow
import React from "react";
import { withTheme } from "styled-components";
import { CurrentTempText, MainViewContainer, Summmary } from "./elements";
import { Image, View } from "react-native";

type Props = {
  temperature: number,
  summary: string,
  icon: string,
  loaded: boolean
};

const icons = {
  "clear-day": require("../img/weather/clear.png"),
  "clear-night": require("../img/weather/nt_clear.png"),
  rain: require("../img/weather/rain.png"),
  snow: require("../img/weather/HeavySnow.png"),
  sleet: require("../img/weather/sleet.png"),
  wind: require("../img/weather/wind.png"),
  fog: require("../img/weather/Fog.png"),
  cloudy: require("../img/weather/cloudy.png"),
  "partly-cloudy-day": require("../img/weather/partlycloudy.png"),
  "partly-cloudy-night": require("../img/weather/nt_partlycloudy.png")
};

const CurrentWeather = ({
  temperature,
  summary,
  loaded = false,
  icon
}: Props) => {
  if (loaded) {
    return (
      <MainViewContainer>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <CurrentTempText>{temperature} °</CurrentTempText>
          <View style={{ alignItems: "center", paddingHorizontal: 26 }}>
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain"
              }}
              source={icons[icon]}
            />
          </View>
        </View>
        <Summmary>{summary}</Summmary>
      </MainViewContainer>
    );
  }
  return null;
};

export default withTheme(CurrentWeather);
