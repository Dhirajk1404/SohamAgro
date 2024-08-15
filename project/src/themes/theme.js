// src/theme/theme.js

const theme = {
  colors: {
    primary: "#4B0082", // Indigo
    secondary: "#FF0000", // Red
    white: "#ffffff",
    black: "#000000",
    grayLight: "#f5f5f5",
    grayDark: "#666666",
    textPrimary: "#4B0082",
    textSecondary: "#333333",
    textTertiary: "#666666",
    background: '#B3CDE0', // Light blue
    backgroundGradientStart: '#B3CDE0', // Light blue start color
    backgroundGradientEnd: '#DAB6F0', // Light purple end color
  },
  gradients: {
    lightBluePurple: ['#B3CDE0', '#E0A8E0', '#DAB6F0'], // Light blue to light purple gradient
  },
  fonts: {
    regular: "System",
    bold: "System",
    size: {
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 20,
      xxlarge: 24,
    },
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  border: {
    radius: 10,
    width: 1,
  },
};

  export default theme;
  