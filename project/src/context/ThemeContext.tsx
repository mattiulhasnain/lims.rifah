import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto' | 'sunset' | 'midnight' | 'ocean' | 'forest' | 'desert' | 'aurora' | 'neon';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'indigo' | 'pink' | 'yellow' | 'gray';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'open-sans' | 'montserrat' | 'nunito' | 'raleway' | 'ubuntu';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animationSpeed: 'slow' | 'normal' | 'fast';
  compactMode: boolean;
  highContrast: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
  applyPreset: (preset: ThemePreset) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultThemeSettings: ThemeSettings = {
  theme: 'light',
  colorScheme: 'blue',
  fontFamily: 'inter',
  fontSize: 'base',
  borderRadius: 'md',
  animationSpeed: 'normal',
  compactMode: false,
  highContrast: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// Color scheme definitions
const colorSchemes = {
  blue: {
    light: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#93c5fd',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  green: {
    light: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#34d399',
      secondary: '#10b981',
      accent: '#6ee7b7',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  purple: {
    light: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#ffffff',
      surface: '#faf5ff',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#a78bfa',
      secondary: '#8b5cf6',
      accent: '#c4b5fd',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  orange: {
    light: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#ffffff',
      surface: '#fffbeb',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#fcd34d',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  red: {
    light: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      background: '#ffffff',
      surface: '#fef2f2',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#f87171',
      secondary: '#ef4444',
      accent: '#fca5a5',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  teal: {
    light: {
      primary: '#14b8a6',
      secondary: '#0d9488',
      accent: '#5eead4',
      background: '#ffffff',
      surface: '#f0fdfa',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#5eead4',
      secondary: '#14b8a6',
      accent: '#99f6e4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  indigo: {
    light: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
      background: '#ffffff',
      surface: '#eef2ff',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#818cf8',
      secondary: '#6366f1',
      accent: '#a5b4fc',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  pink: {
    light: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: '#ffffff',
      surface: '#fdf2f8',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#f472b6',
      secondary: '#ec4899',
      accent: '#f9a8d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  yellow: {
    light: {
      primary: '#eab308',
      secondary: '#ca8a04',
      accent: '#facc15',
      background: '#ffffff',
      surface: '#fefce8',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#facc15',
      secondary: '#eab308',
      accent: '#fde047',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  },
  gray: {
    light: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#1e293b',
      muted: '#64748b'
    },
    dark: {
      primary: '#9ca3af',
      secondary: '#6b7280',
      accent: '#d1d5db',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8'
    }
  }
};

// Mood-based theme color schemes
export const moodColorSchemes = {
  sunset: {
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#fef3c7',
    surface: '#fde68a',
    text: '#451a03',
    muted: '#92400e'
  },
  midnight: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#818cf8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#e2e8f0',
    muted: '#64748b'
  },
  ocean: {
    primary: '#0891b2',
    secondary: '#0e7490',
    accent: '#22d3ee',
    background: '#f0f9ff',
    surface: '#e0f2fe',
    text: '#0c4a6e',
    muted: '#0369a1'
  },
  forest: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    background: '#f0fdf4',
    surface: '#dcfce7',
    text: '#14532d',
    muted: '#15803d'
  },
  desert: {
    primary: '#d97706',
    secondary: '#b45309',
    accent: '#f59e0b',
    background: '#fefce8',
    surface: '#fef3c7',
    text: '#451a03',
    muted: '#92400e'
  },
  aurora: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#faf5ff',
    surface: '#f3e8ff',
    text: '#581c87',
    muted: '#7c3aed'
  },
  neon: {
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f472b6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#e2e8f0',
    muted: '#64748b'
  }
} as const;

// Font family definitions
const fontFamilies = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
  'open-sans': "'Open Sans', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  nunito: "'Nunito', sans-serif",
  raleway: "'Raleway', sans-serif",
  ubuntu: "'Ubuntu', sans-serif"
};

// Font size definitions
const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem'
};

// Border radius definitions
const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
};

// Animation speed definitions
const animationSpeeds = {
  slow: '0.5s',
  normal: '0.3s',
  fast: '0.15s'
};

// Theme presets with curated color schemes and font combinations
export const themePresets = {
  aesthetic: {
    name: "Aesthetic Mood",
    description: "Soft, dreamy colors with elegant typography",
    colorScheme: 'pink' as ColorScheme,
    fontFamily: 'poppins' as FontFamily,
    fontSize: 'base' as FontSize,
    borderRadius: 'lg',
    animationSpeed: 'normal',
    compactMode: false,
    highContrast: false
  },
  boss: {
    name: "Boss Mood",
    description: "Bold, authoritative design for leadership",
    colorScheme: 'red' as ColorScheme,
    fontFamily: 'montserrat' as FontFamily,
    fontSize: 'lg' as FontSize,
    borderRadius: 'md',
    animationSpeed: 'fast',
    compactMode: false,
    highContrast: true
  },
  reception: {
    name: "Reception Mood",
    description: "Welcoming and friendly interface",
    colorScheme: 'blue' as ColorScheme,
    fontFamily: 'nunito' as FontFamily,
    fontSize: 'base' as FontSize,
    borderRadius: 'lg',
    animationSpeed: 'normal',
    compactMode: false,
    highContrast: false
  },
  chill: {
    name: "Chill Mood",
    description: "Relaxed and calming atmosphere",
    colorScheme: 'teal' as ColorScheme,
    fontFamily: 'open-sans' as FontFamily,
    fontSize: 'lg' as FontSize,
    borderRadius: 'xl',
    animationSpeed: 'slow',
    compactMode: false,
    highContrast: false
  },
  cooldown: {
    name: "Cool Down",
    description: "Cool, refreshing blue tones",
    colorScheme: 'blue' as ColorScheme,
    fontFamily: 'inter' as FontFamily,
    fontSize: 'base' as FontSize,
    borderRadius: 'md',
    animationSpeed: 'slow',
    compactMode: true,
    highContrast: false
  },
  onheat: {
    name: "On Heat",
    description: "Energetic and passionate design",
    colorScheme: 'orange' as ColorScheme,
    fontFamily: 'poppins' as FontFamily,
    fontSize: 'lg' as FontSize,
    borderRadius: 'sm',
    animationSpeed: 'fast',
    compactMode: false,
    highContrast: true
  },
  superfast: {
    name: "Super Fast",
    description: "High-performance, minimal design",
    colorScheme: 'gray' as ColorScheme,
    fontFamily: 'inter' as FontFamily,
    fontSize: 'sm' as FontSize,
    borderRadius: 'none',
    animationSpeed: 'fast',
    compactMode: true,
    highContrast: true
  },
  pro: {
    name: "Pro",
    description: "Modern, sleek professional look",
    colorScheme: 'indigo' as ColorScheme,
    fontFamily: 'roboto' as FontFamily,
    fontSize: 'base' as FontSize,
    borderRadius: 'md',
    animationSpeed: 'normal',
    compactMode: false,
    highContrast: false
  },
  professional: {
    name: "Professional",
    description: "Classic, trustworthy business design",
    colorScheme: 'blue' as ColorScheme,
    fontFamily: 'open-sans' as FontFamily,
    fontSize: 'base' as FontSize,
    borderRadius: 'sm',
    animationSpeed: 'normal',
    compactMode: false,
    highContrast: false
  }
} as const;

export type ThemePreset = keyof typeof themePresets;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('lab_theme_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultThemeSettings, ...parsedSettings });
          setThemeState(parsedSettings.theme || 'light');
        }
      } catch {
        console.error('Failed to load theme settings, using defaults');
    }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lab_theme_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = settings.theme === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      settings.theme;
    
    setThemeState(currentTheme);
    
    // Handle mood-based themes
    let colors;
    if (['sunset', 'midnight', 'ocean', 'forest', 'desert', 'aurora', 'neon'].includes(currentTheme)) {
      colors = moodColorSchemes[currentTheme as keyof typeof moodColorSchemes];
    } else {
      const colorScheme = colorSchemes[settings.colorScheme];
      colors = currentTheme === 'dark' ? colorScheme.dark : colorScheme.light;
    }
    
    // Apply colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    
    // Apply font family
    root.style.setProperty('--font-family', fontFamilies[settings.fontFamily]);
    
    // Apply font size
    root.style.setProperty('--font-size-base', fontSizes[settings.fontSize]);
    
    // Apply border radius
    root.style.setProperty('--border-radius', borderRadius[settings.borderRadius]);
    
    // Apply animation speed
    root.style.setProperty('--animation-speed', animationSpeeds[settings.animationSpeed]);
    
    // Apply compact mode
    if (settings.compactMode) {
      root.style.setProperty('--spacing-multiplier', '0.75');
      document.body.classList.add('compact');
      } else {
      root.style.setProperty('--spacing-multiplier', '1');
      document.body.classList.remove('compact');
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      root.style.setProperty('--contrast-multiplier', '1.2');
      document.body.classList.add('high-contrast');
    } else {
      root.style.setProperty('--contrast-multiplier', '1');
      document.body.classList.remove('high-contrast');
    }
    
    // Set theme class on document root
    root.classList.remove('light', 'dark', 'sunset', 'midnight', 'ocean', 'forest', 'desert', 'aurora', 'neon');
    root.classList.add(currentTheme);
    
    // Save theme to localStorage (both lab_theme and labSettings)
    localStorage.setItem('lab_theme', currentTheme);
    
    // Also update labSettings if it exists
    const labSettings = localStorage.getItem('labSettings');
    if (labSettings) {
      try {
        const parsedSettings = JSON.parse(labSettings);
        const updatedSettings = {
          ...parsedSettings,
          appearance: {
            ...parsedSettings.appearance,
            theme: currentTheme
          }
        };
        localStorage.setItem('labSettings', JSON.stringify(updatedSettings));
      } catch {
        // If parsing fails, ignore
        }
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultThemeSettings);
  };

  const applyPreset = (preset: ThemePreset) => {
    const presetSettings = themePresets[preset];
    setSettings({
      ...settings,
      ...presetSettings,
      theme: settings.theme // Keep current theme mode
    });
  };

  const setTheme = (newTheme: Theme) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
  };

  return (
    <ThemeContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      applyPreset,
      theme,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};