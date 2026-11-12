const STORAGE_KEY = 'respo_doc_facility_state_v2';

export const loadStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Respo Doc: Unable to read from localStorage:', error);
    return null;
  }
};

export const saveStoredState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn('Respo Doc: Unable to save to localStorage:', error);
    return false;
  }
};

export const clearStoredState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Respo Doc: Unable to clear localStorage:', error);
    return false;
  }
};

