import { Movie, TVShow, ContentType } from '@shared/types';
import MovieCard from './movie-card';

interface ContentGridProps {
  items: (Movie | TVShow)[];
  type: ContentType;
}

const ContentGrid = ({ items, type }: ContentGridProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
        <p className="text-textSecondary">Try changing your search criteria or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MovieCard 
          key={item.id} 
          item={item} 
          type={type}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
