export const validateRuc = (ruc) => {
    return /^\d{13}$/.test(ruc);
  };
  
  export const validateFile = (file, type) => {
    if (!file) return false;
    if (type === 'pdf' && file.type !== 'application/pdf') return false;
    if (type === 'xml' && file.type !== 'application/xml' && !file.name.endsWith('.xml')) return false;
    return true;
  };