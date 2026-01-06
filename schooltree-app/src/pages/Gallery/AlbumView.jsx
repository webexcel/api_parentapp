import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Modal } from '../../components/common';
import { ROUTES } from '../../utils/constants';

// Photo Grid Item
function PhotoItem({ photo, onClick }) {
  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
    >
      <img
        src={photo.thumbnail}
        alt={photo.caption || 'Photo'}
        className="w-full h-full object-cover"
      />
    </button>
  );
}

// Lightbox Modal
function Lightbox({ isOpen, onClose, photo, onPrev, onNext, currentIndex, totalPhotos }) {
  if (!photo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-black rounded-xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image */}
        <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
          <img
            src={photo.fullSize}
            alt={photo.caption || 'Photo'}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* Info Bar */}
        <div className="p-4 bg-black/80 text-white flex items-center justify-between">
          <p className="text-sm">{photo.caption || 'Untitled'}</p>
          <span className="text-sm text-white/60">
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>
      </div>
    </Modal>
  );
}

function AlbumView() {
  const { albumId } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock data - will be replaced with API calls
  const album = {
    id: albumId,
    title: 'Annual Sports Day 2023',
    date: 'Oct 20, 2023',
    description: 'Highlights from our exciting Annual Sports Day celebration featuring track events, team sports, and prize distribution.',
    photos: [
      { id: 1, thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop', caption: 'Opening ceremony' },
      { id: 2, thumbnail: 'https://images.unsplash.com/photo-1461896836934- voices?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop', caption: 'Track race' },
      { id: 3, thumbnail: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&h=800&fit=crop', caption: 'Long jump event' },
      { id: 4, thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1200&h=800&fit=crop', caption: 'Relay race' },
      { id: 5, thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop', caption: 'Award ceremony' },
      { id: 6, thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=800&fit=crop', caption: 'Team photograph' },
      { id: 7, thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=800&fit=crop', caption: 'Sprint finals' },
      { id: 8, thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', fullSize: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop', caption: 'Victory lap' },
    ],
  };

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrev = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? album.photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev === album.photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back Navigation */}
      <Link
        to={ROUTES.GALLERY}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors w-fit"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gallery
      </Link>

      {/* Album Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{album.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{album.date} - {album.photos.length} photos</p>
          {album.description && (
            <p className="text-slate-600 mt-2 max-w-2xl">{album.description}</p>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {album.photos.map((photo, index) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        photo={album.photos[currentPhotoIndex]}
        onPrev={goToPrev}
        onNext={goToNext}
        currentIndex={currentPhotoIndex}
        totalPhotos={album.photos.length}
      />

      {/* Empty State */}
      {album.photos.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">No photos in this album</h3>
              <p className="text-sm text-slate-500 mt-1">Photos will appear here once uploaded</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AlbumView;
