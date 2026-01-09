import { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import ImageSliderModal from './ImageSliderModal';

// Helper to determine file type from URL
function getFileType(url) {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();

  // Audio files
  if (lowerUrl.includes('.wav') || lowerUrl.includes('.mp3') || lowerUrl.includes('.ogg') || lowerUrl.includes('.m4a')) {
    return 'audio';
  }

  // Image files
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
    return 'image';
  }

  // Document files
  if (lowerUrl.includes('.pdf')) return 'pdf';
  if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) return 'doc';
  if (lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx')) return 'excel';
  if (lowerUrl.includes('.ppt') || lowerUrl.includes('.pptx')) return 'ppt';

  // Default to image if no extension found (might be a direct image URL)
  return 'image';
}

// Helper to get file name from URL
function getFileName(url) {
  if (!url) return 'File';
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  // Remove any timestamp prefix pattern like "1753700542"
  const cleanName = fileName.replace(/^\d+/, '');
  return cleanName || fileName;
}

// Document icon component
function DocumentIcon({ type }) {
  const icons = {
    pdf: (
      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM9 13h2v4H9v-4zm0-3h2v2H9v-2zm4 0h2v2h-2v-2zm0 3h2v2h-2v-2z" />
      </svg>
    ),
    doc: (
      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
      </svg>
    ),
    excel: (
      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h2v2H8v-2zm4 0h4v2h-4v-2zm-4 4h2v2H8v-2zm4 0h4v2h-4v-2z" />
      </svg>
    ),
    ppt: (
      <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 10h6v2H9v-2zm0 4h4v2H9v-2z" />
      </svg>
    ),
  };

  return icons[type] || icons.doc;
}

// Single media item component
function MediaItem({ url, type, onClick }) {
  if (type === 'audio') {
    return (
      <div className="w-full">
        <AudioPlayer src={url} />
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div
        className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => onClick?.()}
      >
        <img
          src={url}
          alt="Attachment"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Document types
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors"
    >
      <DocumentIcon type={type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{getFileName(url)}</p>
        <p className="text-xs text-slate-500 capitalize">{type} file</p>
      </div>
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

function MediaSlider({ media = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Parse media if it's a string (JSON array or single URL)
  const parseMedia = () => {
    if (!media) return [];

    if (typeof media === 'string') {
      // Try to parse as JSON array
      if (media.startsWith('[')) {
        try {
          return JSON.parse(media);
        } catch {
          return [media];
        }
      }
      // Single URL
      return media ? [media] : [];
    }

    if (Array.isArray(media)) {
      return media;
    }

    return [];
  };

  const mediaItems = parseMedia().filter(Boolean);

  if (mediaItems.length === 0) return null;

  // Categorize media items
  const categorizedItems = mediaItems.map(url => ({
    url,
    type: getFileType(url),
  }));

  // Separate audio files from visual media
  const audioItems = categorizedItems.filter(item => item.type === 'audio');
  const visualItems = categorizedItems.filter(item => item.type !== 'audio');
  const imageItems = visualItems.filter(item => item.type === 'image');
  const docItems = visualItems.filter(item => ['pdf', 'doc', 'excel', 'ppt'].includes(item.type));

  // Get all image URLs for the slider modal
  const imageUrls = imageItems.map(item => item.url);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < imageItems.length - 1 ? prev + 1 : 0));
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowSliderModal(true);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      {/* Audio files - show all */}
      {audioItems.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-medium text-slate-500 mb-2">Audio Files</p>
          {audioItems.map((item, idx) => (
            <MediaItem key={idx} url={item.url} type="audio" />
          ))}
        </div>
      )}

      {/* Image slider */}
      {imageItems.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 mb-2">
            Images {imageItems.length > 1 && `(${currentIndex + 1}/${imageItems.length})`}
          </p>
          <div className="relative">
            <MediaItem
              url={imageItems[currentIndex].url}
              type="image"
              onClick={() => handleImageClick(currentIndex)}
            />

            {/* Navigation arrows */}
            {imageItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {imageItems.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {imageItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document files */}
      {docItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 mb-2">Documents</p>
          {docItems.map((item, idx) => (
            <MediaItem key={idx} url={item.url} type={item.type} />
          ))}
        </div>
      )}

      {/* Image Slider Modal - shows all images from this card */}
      {showSliderModal && imageUrls.length > 0 && (
        <ImageSliderModal
          images={imageUrls}
          initialIndex={selectedImageIndex}
          onClose={() => setShowSliderModal(false)}
        />
      )}
    </div>
  );
}

export default MediaSlider;
