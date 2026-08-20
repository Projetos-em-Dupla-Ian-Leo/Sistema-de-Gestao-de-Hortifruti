import React from 'react';
import { Button } from './ui/button';

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  period: 'day' | 'month' | 'year';
}

export const DateFilter: React.FC<DateFilterProps> = ({ selectedDate, onDateChange, period }) => {
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (period === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (period === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setFullYear(newDate.getFullYear() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (period === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (period === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setFullYear(newDate.getFullYear() + 1);
    onDateChange(newDate);
  };

  const formatDate = () => {
    if (period === 'day') return selectedDate.toLocaleDateString('pt-BR');
    if (period === 'month') return selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return selectedDate.getFullYear().toString();
  };

  return (
    <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
      <Button variant="ghost" size="sm" onClick={handlePrev} className="h-8 px-2">←</Button>
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm font-medium">{formatDate()}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleNext} className="h-8 px-2">→</Button>
    </div>
  );
};