export const platformBrand = {
  name: "LegacyHub",
  tagline: "Preserving Legacies. Connecting Generations.",
  description: "Commercial digital legacy platform"
};

export const flagshipArchiveBrand = {
  name: "Tioluwalase Majekodunmi",
  relationship: "Powered by LegacyHub",
  descriptor: "The Life & Legacy of Baba Muyi",
  archiveDescriptor: "Digital Heritage Archive",
  tagline: "Legacy of Kindness. Lessons for Generations.",
  description:
    "A digital heritage archive preserving the life, values, family history, entrepreneurial journey and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi.",
  purpose:
    "Preserve the life, values, entrepreneurial history, family memory, community contribution, photographs, documentaries, lessons and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi for future generations.",
  assets: {
    logo: "/brand/tioluwalase-majekodunmi-logo.png",
    logoDark: "/brand/tioluwalase-majekodunmi-logo-dark.png",
    mark: "/brand/tioluwalase-majekodunmi-mark.png",
    alt: "Tioluwalase Majekodunmi — The Life and Legacy of Baba Muyi"
  }
};

export const workspaceBrandTokens = {
  defaultTheme: "archive",
  colorRoles: {
    primary: "heritage-navy",
    accent: "legacy-gold",
    surface: "archive-ivory",
    text: "ink-charcoal",
    muted: "silver-grey",
    border: "archive-stone"
  }
};

export const legacyProfileThemeTokens = {
  defaultProfileTheme: "baba-muyi",
  inheritsWorkspaceTheme: true,
  configurableRoles: ["hero", "navigation", "footer", "cards", "editorial"] as const
};
