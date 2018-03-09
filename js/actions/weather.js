export const WEATHER_STATUS_UPDATE = "WEATHER_STATUS_UPDATE";
export const WEATHER_STATUS_UPDATE_SUCCESS = "WEATHER_STATUS_UPDATE_SUCCESS";
export const WEATHER_STATUS_UPDATE_FAILURE = "WEATHER_STATUS_UPDATE_FAILURE";

export const weatherUpdate = options => ({
  type: WEATHER_STATUS_UPDATE,
  apiCall: apiClient => {
    const lang = "es";
    return apiClient.get("weather/es");
  },
  options
});
