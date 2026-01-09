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
  | 'Addidas Campus'
  | 'Addidas Samba'
  | 'Valentino'
  | 'Nike S'
  | 'Nike SB'
  | 'Nike Cortex'
  | 'Nike TN'
  | 'Nike Shox'
  | 'Nike Zoom'
  | 'New Balance'
  | 'Custom'
  | 'Codra'
  | 'Skater'
  | 'Off the Wall'
  | 'Jordan 1'
  | 'Jordan 3'
  | 'Jordan 4'
  | 'Jordan 9'
  | 'Jordan 11'
  | 'Jordan 14'
  | 'AirMax 1'
  | 'Airmax 97'
  | 'Airmax 95'
  | 'Airmax 90'
  | 'Airmax';

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

