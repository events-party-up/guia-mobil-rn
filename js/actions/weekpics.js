export const WEEK_PICS_UPDATE = "WEEK_PICS_UPDATE";
export const WEEK_PICS_UPDATE_SUCCESS = "WEEK_PICS_UPDATE_SUCCESS";

export const weekPicsUpdate = options => ({
    type: WEEK_PICS_UPDATE,
    apiCall: apiClient =>
        apiClient.get("weekpics").then(res => {
            return {
                data: res.data
            };
        }),
    options
});
