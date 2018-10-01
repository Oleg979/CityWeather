import { PUSH_TO_HISTORY, CHANGE_CITY } from "./reducer";

export const pushToHistory = city => ({
  type: PUSH_TO_HISTORY,
  payload: city
});

export const changeCity = city => ({
  type: CHANGE_CITY,
  payload: city
});
