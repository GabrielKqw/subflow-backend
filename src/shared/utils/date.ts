import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';

export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

export const isExpired = (date: Date): boolean => {
  return isBefore(date, new Date());
};

export const isActive = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  return isAfter(now, startDate) && isBefore(now, endDate);
};

export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

export const calculateEndDate = (startDate: Date, durationDays: number): Date => {
  return addDays(startDate, durationDays);
};

