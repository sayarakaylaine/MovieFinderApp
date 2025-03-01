import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    colors: {
      background: isDark ? '#121212' : '#fff',
      text: isDark ? '#fff' : '#000',
      primary: isDark ? '#BB86FC' : '#6200EE',
      icon: '#1E90FF',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
