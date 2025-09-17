// src/components/admin/StatCard.tsx
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number | string; // Permitindo string para casos de erro ou loading
  icon: LucideIcon;
};

export const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md flex items-center space-x-4">
      <div className="rounded-full bg-[#fef2f2] p-3">
        <Icon className="h-6 w-6 text-[#b91c1c]" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};