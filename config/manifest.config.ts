export interface PluginManifestConfig {
  id: string;
  name: string;
  fullName: string;
  version: string;
  developer: {
    name: string;
    website: string;
    email?: string;
  };
  branding: {
    category: string;
    descriptionHuman: string;
    descriptionModel: string;
    logoUrl: string;
    screenshots?: string[];
  };
  mcp: {
    serverUrl: string;
    transport: 'sse' | 'stream' | 'http';
    authType: 'oauth2' | 'bearer' | 'none';
    authorizationUrl?: string;
    tokenUrl?: string;
  };
  legal: {
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
  };
  starterPrompts: string[];
  activeSkills: string[];
}

export const iwasPluginManifest: PluginManifestConfig = {
  id: 'iwas',
  name: 'IWAS',
  fullName: 'IWAS – Intelligent WiFi Access & Presence Service',
  version: '1.0.0',
  developer: {
    name: '9xlayer',
    website: 'https://getiwas.com',
    email: 'support@getiwas.com',
  },
  branding: {
    category: 'Business',
    descriptionHuman:
      'IWAS – Intelligent WiFi Access & Presence Service. Monitor hotspot network, manage packages, audit accounting, and track revenue directly from your AI assistant.',
    descriptionModel:
      'IWAS assistant plugin. Enables AI assistants to interact with the IWAS API to query hotspot diagnostics, analyze network revenue, inspect active user sessions, optimize package offerings, and publish content.',
    logoUrl: 'https://getiwas.com/logo-mark-512.png',
    screenshots: [
      'https://getiwas.com/screenshots/diagnostics.jpg',
      'https://getiwas.com/screenshots/revenue.jpg',
      'https://getiwas.com/screenshots/sessions.jpg',
    ],
  },
  mcp: {
    serverUrl: 'https://getiwas.com/mcp',
    transport: 'sse',
    authType: 'oauth2',
    authorizationUrl: 'https://getiwas.com/api/auth/oauth2/authorize',
    tokenUrl: 'https://getiwas.com/api/auth/oauth2/token',
  },
  legal: {
    privacyPolicyUrl: 'https://getiwas.com/privacy',
    termsOfServiceUrl: 'https://getiwas.com/terms',
  },
  starterPrompts: [
    '@IWAS, check network health and diagnose any router or RADIUS issues.',
    '@IWAS, produce a revenue digest and summarize today\'s top performing packages.',
    '@IWAS, how many active sessions are currently online on the hotspot?',
    '@IWAS, analyze package performance and suggest optimal promo windows.',
    '@IWAS, list recent blog posts on the captive portal.',
  ],
  activeSkills: [
    'iwas-network-diagnostics',
    'iwas-revenue-digest',
    'iwas-session-monitor',
    'iwas-package-optimizer',
    'iwas-content-publisher',
  ],
};
