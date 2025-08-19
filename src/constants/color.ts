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
  black: 'rgba(0, 0, 0, 1)',
  white: '#ffffff',
  placeholderOrange: 'rgba(249, 140, 11, 0.5)',
  bottomNavBar: 'rgba(11, 108, 249, 0.6)',

  // Trạng thái
  success: '#4ADE80',
  error: '#EF4444',
  warning: '#FBBF24',
  info: '#2196F3',
  disable: '#A0A0A0',
  // Effect Color
  defaultShadow: 'rgba(0, 0, 0, 0.25)',
  orangeShadow: 'rgba(244,162,97, 0.25)',
  darkShadow: 'rgba(0, 0, 0, 0.5)',
} as const;

// Nếu bạn dùng TypeScript thì sẽ có type gợi ý khi import
export type ColorKeys = keyof typeof COLORS;
