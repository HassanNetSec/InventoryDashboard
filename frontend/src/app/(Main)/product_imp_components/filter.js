// components/ProductFilter.jsx
'use client';

import { Input } from '@/components/ui/input';

export default function ProductFilter({ query, setQuery }) {
  return (
    <Input
      placeholder="Search by name or category..."
      className="max-w-sm"
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}
