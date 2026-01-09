import { useState, useEffect, useCallback } from 'react';
import { Card, SearchBar, Loader } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { getGalleryCategories } from '../../services/galleryService';

// Helper to get image URL from image item (handles both string and object)
function getImageUrl(img) {
  if (!img) return null;
  if (typeof img === 'string') return img;
  return img.imgfile || img.url || img.image || img.src || null;
}

// Album Card Component
function AlbumCard({ album, onClick }) {
  const images = album.images || [];
  const coverImage = images.length > 0 ? getImageUrl(images[0]) : null;
  const photoCount = images.length;

  return (
    <div
      onClick={() => onClick && onClick(album)}
      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
    >
      {/* Cover Image */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={album.CatName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-200">
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* Photo Count Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-slate-700 text-xs font-semibold shadow-sm">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
      </div>

      {/* Album Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 drop-shadow-md">{album.CatName}</h3>
        {album.Description && (
          <p className="text-white/80 text-sm line-clamp-1 mb-1">{album.Description}</p>
        )}
        <p className="text-white/60 text-xs">{album.SMSdate}</p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gallery Modal with Image Slider
function GalleryModal({ album, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = album?.images || [];

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  }, [images.length, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  if (!album || images.length === 0) return null;

  const currentImageUrl = getImageUrl(images[currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <h3 className="font-bold text-lg">{album.CatName}</h3>
          <p className="text-white/60 text-sm">
            {currentIndex + 1} of {images.length} photos
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Current Image */}
        <div className="max-w-5xl max-h-[70vh] flex items-center justify-center">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={`${album.CatName} - ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <div className="text-white">Image not available</div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => {
            const thumbUrl = getImageUrl(img);
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentIndex
                    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-black scale-110'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white text-xs">
                    {index + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Hint */}
        <p className="text-center text-white/40 text-xs mt-2">
          Use arrow keys to navigate • Press ESC to close
        </p>
      </div>
    </div>
  );
}

function Gallery() {
  const { students } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Get CLASS_ID list from all students
  const getClassIds = () => {
    if (!students || students.length === 0) return ['0'];

    const classIds = students
      .map(student => student.CLASS_ID || student.classid || student.CLASSID)
      .filter(id => id); // Remove undefined/null values

    return classIds.length > 0 ? classIds : ['0'];
  };

  // Fetch gallery categories
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      try {
        const classIds = getClassIds();
        const result = await getGalleryCategories(classIds);

        if (result.success) {
          const responseData = result.data?.data || result.data || [];
          const data = Array.isArray(responseData) ? responseData : [];
          setAlbums(data);
        } else {
          setAlbums([]);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [students]);

  // Filter albums based on search
  const filteredAlbums = albums.filter((album) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (album.CatName || '').toLowerCase();
    const description = (album.Description || '').toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
          <p className="text-sm text-slate-500 mt-1">Browse through school memories and events</p>
        </div>
        <div className="w-full md:w-64">
          <SearchBar
            placeholder="Search albums..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )}


      {/* Empty State */}
      {!loading && filteredAlbums.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">No Albums Found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {searchQuery ? 'No albums matching your search' : 'Photo albums will appear here'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Albums Grid */}
      {!loading && filteredAlbums.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.CatID}
                album={album}
                onClick={setSelectedAlbum}
              />
            ))}
          </div>

          {/* Count */}
          <div className="flex justify-center py-2">
            <p className="text-sm text-slate-500">
              Showing {filteredAlbums.length} album{filteredAlbums.length !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}

      {/* Gallery Modal */}
      {selectedAlbum && selectedAlbum.images && selectedAlbum.images.length > 0 && (
        <GalleryModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      )}
    </div>
  );
}

export default Gallery;
