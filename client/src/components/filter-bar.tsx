import { useState, useEffect } from 'react';
import { FilterParams, Genre } from '@shared/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowDownAZ, ChevronDown, Grid, List } from 'lucide-react';

interface FilterBarProps {
  filters?: FilterParams;
  onFilterChange?: (filters: Partial<FilterParams>) => void;
  genres?: Genre[];
  contentType?: 'movie' | 'tv';
}

const FilterBar = ({ 
  filters = {}, 
  onFilterChange = () => {}, 
  genres = [],
  contentType = 'movie'
}: FilterBarProps) => {
  // Get years for dropdown (current year to 2000)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 24 }, (_, i) => currentYear - i);

  // For selected labels
  const getGenreName = (id?: number) => {
    if (!id) return 'All Genres';
    const genre = genres.find(g => g.id === id);
    return genre ? genre.name : 'All Genres';
  };

  const getYearLabel = (year?: number) => {
    if (!year) return 'All Years';
    return year.toString();
  };

  const getTypeLabel = (type?: string) => {
    if (!type) return 'All Types';
    return type === 'movie' ? 'Movies' : 'TV Shows';
  };

  return (
    <div className="bg-hoverBg py-4 sticky top-[60px] z-40 shadow-md" style={{ position:'static' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Genre Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-primary hover:bg-gray-800 text-white border-hoverBg">
                  <span>Genre: {getGenreName(filters.genre)}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary border-hoverBg">
                <DropdownMenuItem 
                  className={`text-white hover:bg-secondary cursor-pointer ${!filters.genre ? 'bg-secondary/20' : ''}`}
                  onClick={() => onFilterChange({ genre: undefined })}
                >
                  All Genres
                </DropdownMenuItem>
                {genres.map((genre) => (
                  <DropdownMenuItem 
                    key={genre.id} 
                    className={`text-white hover:bg-secondary cursor-pointer ${filters.genre === genre.id ? 'bg-secondary/20' : ''}`}
                    onClick={() => onFilterChange({ genre: genre.id })}
                  >
                    {genre.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Year Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-primary hover:bg-gray-800 text-white border-hoverBg">
                  <span>Year: {getYearLabel(filters.year)}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary border-hoverBg max-h-[300px] overflow-y-auto">
                <DropdownMenuItem 
                  className={`text-white hover:bg-secondary cursor-pointer ${!filters.year ? 'bg-secondary/20' : ''}`}
                  onClick={() => onFilterChange({ year: undefined })}
                >
                  All Years
                </DropdownMenuItem>
                {years.map((year) => (
                  <DropdownMenuItem 
                    key={year} 
                    className={`text-white hover:bg-secondary cursor-pointer ${filters.year === year ? 'bg-secondary/20' : ''}`}
                    onClick={() => onFilterChange({ year })}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Type Filter (only show if not already filtered by content type) */}
            {!contentType && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-primary hover:bg-gray-800 text-white border-hoverBg">
                    <span>Type: {getTypeLabel(filters.type)}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-primary border-hoverBg">
                  <DropdownMenuItem 
                    className={`text-white hover:bg-secondary cursor-pointer ${!filters.type ? 'bg-secondary/20' : ''}`}
                    onClick={() => onFilterChange({ type: undefined })}
                  >
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={`text-white hover:bg-secondary cursor-pointer ${filters.type === 'movie' ? 'bg-secondary/20' : ''}`}
                    onClick={() => onFilterChange({ type: 'movie' })}
                  >
                    Movies
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={`text-white hover:bg-secondary cursor-pointer ${filters.type === 'tv' ? 'bg-secondary/20' : ''}`}
                    onClick={() => onFilterChange({ type: 'tv' })}
                  >
                    TV Shows
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* View Options */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-primary hover:bg-gray-800 text-white border-hoverBg"
            >
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              <span>Sort</span>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-hoverBg hover:bg-gray-700 text-white border-hoverBg p-2 h-10 w-10"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-primary hover:bg-gray-800 text-white border-hoverBg p-2 h-10 w-10"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
