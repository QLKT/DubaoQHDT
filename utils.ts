import { YearData, Subdivision } from './types';

export const formatNumber = (num: number, decimals = 2) => {
  return num ? num.toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '0';
};

export const calculateUrbanRate = (urban: number, total: number) => {
  if (!total) return 0;
  return (urban / total) * 100;
};

export const calculateCompoundGrowth = (startValue: number, rate: number, years: number) => {
  // Pn = Po * (1 + r)^n
  return startValue * Math.pow(1 + rate / 100, years);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const exportToCSV = (filename: string, rows: string[][]) => {
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
