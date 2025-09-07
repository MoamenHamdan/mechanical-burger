export const useLanguage = () => {
  return {
    t: (key: string) => key, // Simple passthrough for now
    isRTL: false
  };
};