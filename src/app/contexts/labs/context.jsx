import { createContext, useContext } from 'react';
import { useFetchLabs } from 'hooks/useFetchLabs';

const LabsContext = createContext();

export const LabsProvider = ({ children }) => {
  const { labs, loading, error } = useFetchLabs();

  return (
    <LabsContext.Provider value={{ labs, loading, error }}>
      {children}
    </LabsContext.Provider>
  );
};

export const useLabsContext = () => {
  const context = useContext(LabsContext);
  if (!context) {
    throw new Error('useLabsContext must be used within LabsProvider');
  }
  return context;
};
