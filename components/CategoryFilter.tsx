'use client';
import { cn } from '@/lib/utils';

export type FilterType =
  | 'All'
  | 'Men'
  | 'New Arrivals'
  | 'Offers'
  | 'Boots'
  | 'Empire'
  | 'Casuals'
  | 'Mules'
  | 'Clarks'
  | 'Lacoste'
  | 'Timberland'
  | 'Tommy Hilfiggr'
  | 'Boss'
  | 'Other'
  | 'Adidas'
  | 'New Balance'
  | 'Nike';

interface CategoryFilterProps {
  filters: FilterType[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const CategoryFilter = ({
  filters,
  activeFilter,
  onFilterChange,
}: CategoryFilterProps) => {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2 md:gap-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            'px-6 py-2 rounded-full font-body font-medium whitespace-nowrap transition-all duration-300',
            activeFilter === filter
              ? 'bg-secondary text-white shadow-medium'
              : 'bg-light text-text hover:bg-light/80'
          )}
          aria-label={`Filter by ${filter}`}
          aria-pressed={activeFilter === filter}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

