export type SettingsTheme = "LIGHT" | "DARK";

export type PortfolioSettingsResponse = {
  theme: SettingsTheme | string;
  accentPalette: string;
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
  updatedAt: string | null;
};

export type PortfolioSettingsRequest = {
  theme?: SettingsTheme;
  accentPalette?: string;
  sectionVisibility?: Record<string, boolean>;
  sectionOrder?: string[];
};
