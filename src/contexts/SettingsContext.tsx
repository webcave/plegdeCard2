import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  categories: string[];
  locations: string[];
  setCategories: (categories: string[]) => void;
  setLocations: (locations: string[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<string[]>(["Education", "Healthcare", "Agriculture", "Technology", "Community"]);
  const [locations, setLocations] = useState<string[]>(["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu"]);

  return (
    <SettingsContext.Provider value={{ categories, locations, setCategories, setLocations }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}