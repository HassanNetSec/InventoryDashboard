// components/ProductSort.jsx
'use client';

import { Button } from '@/components/ui/button';

const sortableFields = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'price', label: 'Price' },
];

export default function ProductSort({ sortBy, setSortBy, ascending, setAscending }) {
  const toggleSort = (field) => {
    if (sortBy === field) {
      setAscending(!ascending);
    } else {
      setSortBy(field);
      setAscending(true);
    }
  };

  return (
    <nav className="flex gap-3" aria-label="Sort products">
      {sortableFields.map(({ key, label }) => (
        <Button
          key={key}
          variant={sortBy === key ? 'default' : 'outline'}
          onClick={() => toggleSort(key)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-pressed={sortBy === key}
          aria-label={`Sort by ${label} ${sortBy === key ? (ascending ? 'ascending' : 'descending') : ''}`}
        >
          {label}
          {sortBy === key && (
            <span aria-hidden="true" className="text-blue-600">
              {ascending ? '↑' : '↓'}
            </span>
          )}
        </Button>
      ))}
    </nav>
  );
}
