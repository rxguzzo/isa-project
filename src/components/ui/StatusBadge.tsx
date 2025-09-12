// src/components/ui/StatusBadge.tsx
'use client';

export const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    'aberto': 'bg-blue-100 text-blue-800',
    'em análise': 'bg-yellow-100 text-yellow-800',
    'resolvido': 'bg-green-100 text-green-800',
    'fechado': 'bg-gray-200 text-gray-800',
  };

  const normalizedStatus = status.toLowerCase();

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};