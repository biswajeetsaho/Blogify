const userModel = require("../models/user_model");

// Helper function to calculate contrast color
function getContrastColor(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

module.exports = {
  searchUsers: async (query) => {
    if (!query) return [];
    return await userModel.searchUsersByUsername(query);
  },

  updateUserTheme: async (userId, themeData) => {
    const { backgroundColor, fontFamily } = themeData;

    // Auto-calculate text color based on background
    const textColor = backgroundColor ? getContrastColor(backgroundColor) : '#000000';

    const updateData = {
      'themePreferences.backgroundColor': backgroundColor || '#ffffff',
      'themePreferences.fontFamily': fontFamily || 'Inter',
      'themePreferences.textColor': textColor
    };

    return await userModel.updateUserTheme(userId, updateData);
  }
};
