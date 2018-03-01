let runningRequests = [];

let nextRequestId = 1;

export default function apiCallMiddleware(apiClient) {
  return ({ dispatch, getState }) => next => action => {
    const { type, apiCall, payload, idempotent, options } = action;

    if (apiCall) {
      const state = getState();

      const requestId = nextRequestId++;
      // const running =
      //   idempotent === true &&
      //   runningRequests.find(
      //     req =>
      //       req.type === type &&
      //       req.idempotent === idempotent &&
      //       equalsShallow(req.payload, payload)
      //   );

      // if (running) {
      //   return running.request;
      // }

      dispatch({ type, ...payload, requestId });

      const request = apiCall(apiClient, payload, getState)
        .then((response: any) => {
          runningRequests = runningRequests.filter(
            request => request.requestId !== requestId
          );
          return response;
        })
        .catch((error: Error) => {
          runningRequests = runningRequests.filter(
            request => request.requestId !== requestId
          );
          throw error;
        });
      runningRequests.push({ requestId, type, payload, request });

      return request
        .then((response: any) => {
          dispatch({
            type: `${type}_SUCCESS`,
            ...payload,
            requestId,
            response,
            options,
            oldState: state
          });
          return response;
        })
        .catch((error: any) => {
          if (process.env.NODE_ENV !== "test") {
            // tslint:disable-next-line:no-console
            console.error(error);
          }
          dispatch({
            type: `${type}_FAILURE`,
            ...payload,
            requestId,
            error,
            options,
            oldState: state
          });
          throw error;
        });
    }

    return next(action);
  };
}
