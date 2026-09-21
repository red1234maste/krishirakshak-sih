import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const HelplineContext = createContext();

export const HelplineProvider = ({ children }) => {
  const [helpline, setHelpline] = useState({
    name: 'Kisan Suraksha Helpline',
    nameHi: 'किसान सुरक्षा हेल्पलाइन',
    nameMr: 'किसान सुरक्षा हेल्पलाइन',
    number: '1800-180-1551',
    timings: '24x7 All Days (Toll-Free)',
    disclaimer: 'Demo / Prototype National Agricultural Early Warning Hotline'
  });

  useEffect(() => {
    fetchHelpline();
  }, []);

  const fetchHelpline = async () => {
    try {
      const res = await api.get('/config/helpline');
      if (res.data && res.data.helpline) {
        setHelpline(res.data.helpline);
      }
    } catch (e) {
      // fallback already initialized
    }
  };

  const updateHelplineNumber = async (newNumber, newName) => {
    try {
      const res = await api.put('/config/helpline', { number: newNumber, name: newName });
      if (res.data && res.data.helpline) {
        setHelpline(res.data.helpline);
        return { success: true };
      }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <HelplineContext.Provider value={{ helpline, updateHelplineNumber, refreshHelpline: fetchHelpline }}>
      {children}
    </HelplineContext.Provider>
  );
};

export const useHelpline = () => useContext(HelplineContext);
