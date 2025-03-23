
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatSchedule = (schedule: any) => {
  if (!schedule) {
    return "No schedule available";
  }
  
  try {
    const { start_date, end_date, days, hours } = schedule;
    const formattedDays = Array.isArray(days) && days.length > 0 
      ? days.join(', ') 
      : "All days";
    
    const timeRange = hours 
      ? `${hours.start} - ${hours.end}` 
      : "No specific hours";
    
    return `${start_date} - ${end_date} • ${formattedDays} • ${timeRange}`;
  } catch (error) {
    console.error("Error formatting schedule:", error);
    return "Schedule information unavailable";
  }
};
