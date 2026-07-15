export const platformBrand = {
  name: "LegacyHub",
  tagline: "Preserving Legacies. Connecting Generations.",
  description: "Commercial digital legacy platform"
};

export const flagshipArchiveBrand = {
  name: "Baba Muyi Legacy",
  relationship: "Powered by LegacyHub",
  descriptor: "A LegacyHub Digital Archive",
  description: "A respectful digital archive preserving family history, transport heritage, documentary material and public memories."
};

export const workspaceBrandTokens = {
  defaultTheme: "archive",
  colorRoles: {
    primary: "archive-navy",
    accent: "archive-gold",
    surface: "archive-cream"
  }
};

export const legacyProfileThemeTokens = {
  defaultProfileTheme: "baba-muyi",
  inheritsWorkspaceTheme: true,
  configurableRoles: ["hero", "navigation", "footer", "cards", "editorial"] as const
};
