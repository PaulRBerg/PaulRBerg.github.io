interface Window {
  navigationState?: {
    setBackUrl: (backUrl: string) => void;
    syncBackButton: () => void;
    syncNavigationState: () => void;
  };
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
}
