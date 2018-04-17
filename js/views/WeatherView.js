// @flow
import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import Header from "../components/Header";
import CurrentWeather from "../components/WeatherView/CurrentWeather";
import { Text } from "../components/common/Text";
import { weatherUpdate } from "../actions";
import I18n from "../i18n";

type Props = {
  dispatch: Function,
  theme: Object,
  loaded: boolean,
  navigator: Object,
  summary: string,
  temperature: number,
  lastUpdate: number,
  time: number,
  icon: string,
  daily: {
    data: Object[]
  }
};

const icons = {
  "clear-day": require("../components/img/weather/clear.png"),
  "clear-night": require("../components/img/weather/nt_clear.png"),
  rain: require("../components/img/weather/rain.png"),
  snow: require("../components/img/weather/HeavySnow.png"),
  sleet: require("../components/img/weather/sleet.png"),
  wind: require("../components/img/weather/wind.png"),
  fog: require("../components/img/weather/Fog.png"),
  cloudy: require("../components/img/weather/Cloudy.png"),
  "partly-cloudy-day": require("../components/img/weather/partlycloudy.png"),
  "partly-cloudy-night": require("../components/img/weather/nt_partlycloudy.png")
};

const RowView = styled.View`
  flex-direction: row;
  padding-vertical: 5px;
  justify-content: space-between;
  align-items: center;
`;
const Hr = styled.View`
  height: 1px;
  background-color: lightgray;
  margin-vertical: 10px;
`;

const SmallIcon = styled.Image`
  width: 30px;
  height: 20px;
  resize-mode: contain;
`;

const WeekDay = styled(Text)`
  width: 100px;
`;

const Cell = styled.View`
  width: 110px;
  height: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SmallCell = styled(Cell)`
  width: 80px;
`;

class WeatherView extends Component<Props> {
  static navigatorStyle = { navBarHidden: true };

  componentDidMount() {
    this.props.dispatch(weatherUpdate());

    moment.locale("es-ES");
  }

  renderBottomView = () => {
    const { daily } = this.props;
    if (daily && daily.data) {
      const remainingDays = daily.data.slice(2);

      return remainingDays.map(dayWeather => (
        <RowView key={dayWeather.time}>
          <WeekDay>{moment(dayWeather.time, "X").format("dddd")}</WeekDay>
          <SmallIcon source={icons[dayWeather.icon]} />
          <Text>Min: 8.2 C </Text>
          <Text />
          <Text>75.0</Text>
        </RowView>
      ));
    }
    return null;
  };

  renderDetailedInfo = todayWeatherData => {
    if (todayWeatherData) {
      return (
        <View>
          <RowView>
            <SmallCell>
              <SmallIcon
                source={require("../components/img/weather/sunrise.png")}
              />
              <Text>
                {moment(todayWeatherData.sunriseTime, "X").format("HH:mm")}
              </Text>
            </SmallCell>
            <Cell>
              <SmallIcon
                source={require("../components/img/weather/temp_min.png")}
              />
              <Text>
                {todayWeatherData.temperatureMin.toLocaleString("es-ES", {
                  minimumIntegerDigits: 2,
                  maximumFractionDigits: 1
                })}{" "}
                C
              </Text>
            </Cell>
            <Cell>
              <Text />
              <Text>{todayWeatherData.humidity} </Text>
            </Cell>
          </RowView>
          {/* second row */}
          <RowView>
            <SmallCell>
              <SmallIcon
                source={require("../components/img/weather/sunset.png")}
              />
              <Text>
                {moment(todayWeatherData.sunsetTime, "X").format("HH:mm")}
              </Text>
            </SmallCell>
            <Cell>
              <SmallIcon
                source={require("../components/img/weather/temp_max.png")}
              />
              <Text>
                {todayWeatherData.temperatureMax.toLocaleString("es-ES", {
                  minimumIntegerDigits: 2
                })}{" "}
                C
              </Text>
            </Cell>
            <Cell>
              <Text />
              <Text>{todayWeatherData.pressure.toFixed(2)}</Text>
            </Cell>
          </RowView>
          <RowView>
            <Text />
            <Text />
            <Text />
            <Cell>
              <SmallIcon
                source={require("../components/img/weather/wind_speed.png")}
              />
              <Text>{todayWeatherData.windSpeed}</Text>
            </Cell>
          </RowView>
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      theme,
      summary,
      navigator,
      lastUpdate,
      temperature,
      loaded,
      time,
      icon,
      daily
    } = this.props;
    const mTime = moment(time, "X");
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftItem={{
            icon: "window-close",
            iconType: "material-community",
            onPress: () => navigator.dismissModal()
          }}
          title={I18n.t("navigation.weather.title")}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor="white"
        />
        <ScrollView style={styles.container}>
          <CurrentWeather
            icon={icon}
            temperature={temperature}
            summary={summary}
            loaded={loaded}
          />
          <RowView>
            <Text>{mTime.format("dddd")}</Text>
          </RowView>
          {/* first row */}
          {this.renderDetailedInfo()}
          <Hr />
          {this.renderBottomView()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  let props = {
    lastUpdate: state.weather.lastUpdate,
    loaded: false
  };
  if (state.weather.status) {
    props = {
      ...props,
      ...state.weather.status.currently,
      daily: state.weather.status.daily,
      loaded: true
    };
  }
  return props;
};

export default withTheme(connect(mapStateToProps)(WeatherView));

// styles
// ===================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe9f1",
    paddingHorizontal: 20
  }
});
