import { Link } from 'react-router-dom';
import { Card, SearchBar } from '../../components/common';
import { ROUTES } from '../../utils/constants';

// Album Card Component
function AlbumCard({ album }) {
  return (
    <Link
      to={`/gallery/${album.id}`}
      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      {/* Cover Image */}
      <img
        src={album.coverImage}
        alt={album.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Photo Count Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-medium">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        {album.photoCount}
      </div>

      {/* Album Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{album.title}</h3>
        <p className="text-white/70 text-sm">{album.date}</p>
      </div>
    </Link>
  );
}

function Gallery() {
  // Mock data - will be replaced with API calls
  const albums = [
    {
      id: '1',
      title: 'Annual Sports Day 2023',
      coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
      photoCount: 45,
      date: 'Oct 20, 2023',
    },
    {
      id: '2',
      title: 'Science Exhibition',
      coverImage: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=600&fit=crop',
      photoCount: 32,
      date: 'Oct 15, 2023',
    },
    {
      id: '3',
      title: 'Independence Day Celebration',
      coverImage: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=600&fit=crop',
      photoCount: 28,
      date: 'Aug 15, 2023',
    },
    {
      id: '4',
      title: 'Class Picnic to Zoo',
      coverImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=600&fit=crop',
      photoCount: 56,
      date: 'Jul 22, 2023',
    },
    {
      id: '5',
      title: 'Art Competition',
      coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
      photoCount: 18,
      date: 'Jun 10, 2023',
    },
    {
      id: '6',
      title: 'Annual Day Function',
      coverImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=600&fit=crop',
      photoCount: 72,
      date: 'May 25, 2023',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
          <p className="text-sm text-slate-500 mt-1">Browse through school memories and events</p>
        </div>
        <div className="w-full md:w-64">
          <SearchBar placeholder="Search albums..." />
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>

      {/* Empty State */}
      {albums.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">No albums found</h3>
              <p className="text-sm text-slate-500 mt-1">Photo albums will appear here</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Gallery;
