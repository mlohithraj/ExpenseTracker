export const toggleTheme = () => {
  return { type: 'toggleTheme' };
};

const themeReducer = (state = { darkMode: false }, action) => {
  switch (action.type) {
    case 'toggleTheme':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
};

export default themeReducer;
