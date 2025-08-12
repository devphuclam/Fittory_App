// src/constants/colors.ts
export const Colors = {
  primary: '#FF8C00',
  secondary: '#FFDAB9',
  background: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',

  // Trạng thái
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
} as const;

// Nếu bạn dùng TypeScript thì sẽ có type gợi ý khi import
export type ColorKeys = keyof typeof Colors;
