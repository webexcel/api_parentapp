import { useState, useEffect, useCallback } from 'react';

function FlashMessageQueue({ messages = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Start showing messages when array is populated
  useEffect(() => {
    if (messages.length > 0 && currentIndex < messages.length) {
      setIsOpen(true);
    }
  }, [messages, currentIndex]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    // After animation, move to next message or complete
    setTimeout(() => {
      if (currentIndex < messages.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsOpen(true);
      } else {
        // All messages shown
        onComplete?.();
      }
    }, 200);
  }, [currentIndex, messages.length, onComplete]);

  const handleLinkClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    handleClose();
  };

  if (!messages.length || currentIndex >= messages.length || !isOpen) {
    return null;
  }

  const currentMessage = messages[currentIndex];
  // Flash API response: { nid, Title, Discription, event_image, ... }
  const title = currentMessage.Title || currentMessage.title || currentMessage.TITLE || 'Announcement';
  const description = currentMessage.Discription || currentMessage.description || currentMessage.MESSAGE || currentMessage.message || '';
  const link = currentMessage.links || currentMessage.link || currentMessage.url || '';
  const hasLink = link && link.trim().length > 0;
  const image = currentMessage.event_image || currentMessage.image || currentMessage.IMAGE || currentMessage.imageUrl || '';
  const hasImage = image && image.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>

            {/* Progress indicator */}
            {messages.length > 1 && (
              <div className="flex gap-2 mb-4">
                {messages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx <= currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white relative z-10">
              {title}
            </h3>

            {/* Message counter */}
            {messages.length > 1 && (
              <p className="text-white/70 text-base mt-2 relative z-10">
                {currentIndex + 1} of {messages.length}
              </p>
            )}

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image Section */}
          {hasImage && (
            <div className="relative w-full max-h-80 overflow-hidden bg-slate-100">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain max-h-80"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            {/* Message content */}
            <div className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-4">
            {hasLink ? (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base rounded-xl transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleLinkClick(link)}
                  className="flex-1 py-3.5 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Learn More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-3.5 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-base rounded-xl transition-colors"
              >
                {currentIndex < messages.length - 1 ? 'Next' : 'Got it'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashMessageQueue;
