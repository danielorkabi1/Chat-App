export const optionsBoardReducer = (state = false, action) => {
  let { type, payload } = action;
  switch (type) {
    case "DISPLAY_OPTIONS_BOARD":
      return payload;
    case "HIDE_BOARD":
      return null;
    default:
      return null;
  }
};
