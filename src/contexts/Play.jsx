import { createContext, useContext, useState } from 'react';

const Context = createContext();

export const PlayProvider = ({ children }) => {
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  return (
    <Context.Provider
      value={{
        start,
        setStart,
        end,
        setEnd,
        hasScroll,
        setHasScroll,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePlay = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('usePlay must be used within a PlayProvider');
  }

  return context;
};
