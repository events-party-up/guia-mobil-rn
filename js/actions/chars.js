export const CHARS_UPDATE = "CHARS_UPDATE";
export const CHARS_UPDATE_SUCCESS = "CHARS_UPDATE_SUCCESS";
export const CHARS_UPDATE_FAILURE = "CHARS_UPDATE_FAILURE";

export const charsUpdate = options => ({
  type: CHARS_UPDATE,
  apiCall: apiClient => apiClient.get("update/chars/0"),
  options
});
