// src/constants/colors.ts
export const COLORS = {
  background: '#FAF8F2',
  section: '#F5F0E6',
  iconColor: '#8C8C89',
  specialText: '#F98C0B',
  fittoryBlue: '#76C1E8',
  activeBlue: '#0B6CF9',
  linkText: '#2994D4',
  red: '#FF0000',

  // Trạng thái
  success: '#4ADE80',
  error: '#EF4444',
  warning: '#FBBF24',
  info: '#2196F3',
} as const;

// Nếu bạn dùng TypeScript thì sẽ có type gợi ý khi import
export type ColorKeys = keyof typeof COLORS;
