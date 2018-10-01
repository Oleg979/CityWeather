const initialState = {
  cities: ["Paris"],
  city: "Paris"
};

export const PUSH_TO_HISTORY = "PUSH_TO_HISTORY";
export const CHANGE_CITY = "CHANGE_CITY";

export default (state = initialState, action) => {
  switch (action.type) {
    case PUSH_TO_HISTORY:
      if (state.cities.length == 12)
        return {
          ...state,
          cities: [...state.cities.slice(1), action.payload]
        };
      else
        return {
          ...state,
          cities: [...state.cities, action.payload]
        };
    case CHANGE_CITY:
      return {
        ...state,
        city: action.payload
      };
    default:
      return state;
  }
};
