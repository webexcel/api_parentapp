import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, SearchBar, Badge, AudioPlayer, Loader, ImageSliderModal } from '../../components/common';
import { getCirculars } from '../../services/circularService';

// Helper to determine content type from URL or message
function getContentType(circular) {
  const imageUrl = circular.event_image;

  if (!imageUrl) return 'notice';

  const lowerUrl = imageUrl.toLowerCase();

  // Audio files
  if (lowerUrl.includes('.wav') || lowerUrl.includes('.mp3') || lowerUrl.includes('.ogg')) {
    return 'audio';
  }

  // Image files
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
    return 'image';
  }

  // Document files
  if (lowerUrl.includes('.pdf')) return 'pdf';
  if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) return 'document';
  if (lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx')) return 'document';

  // Video files
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi')) {
    return 'video';
  }

  return 'image';
}

// Circular Type Icon Component
function CircularTypeIcon({ type }) {
  const typeConfig = {
    pdf: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h2v4h-2v-4zm0-6h2v2h-2V7zm4 0h2v2h-2V7zm0 4h2v2h-2v-2z" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
    },
    audio: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15a.998.998 0 00-.98-.85c-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08a6.993 6.993 0 005.91-5.78c.1-.6-.39-1.14-1-1.14z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500',
    },
    image: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      textColor: 'text-green-500',
    },
    video: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      ),
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-500',
    },
    document: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    notice: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
  };

  const config = typeConfig[type] || typeConfig.notice;

  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} ${config.textColor}`}>
      {config.icon}
    </div>
  );
}

// For Badge Component
function ForBadge({ studentName, adno }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      For: {studentName}
    </div>
  );
}

// Parse date from API format "07,Jan-13:53"
function parseCircularDate(dateStr) {
  if (!dateStr) return '';

  // Format: "07,Jan-13:53"
  try {
    const [datePart, timePart] = dateStr.split('-');
    const [day, month] = datePart.split(',');
    return `${day} ${month}, ${timePart}`;
  } catch {
    return dateStr;
  }
}

// Circular Card Component
function CircularCard({ circular, onImageClick }) {
  const type = getContentType(circular);
  const message = circular.Message || circular.message || '';
  const studentName = circular.STUDENTNAME || circular.studentName || 'Student';
  const dateStr = parseCircularDate(circular.SMSdate || circular.smsDate);
  const imageUrl = circular.event_image;

  // Check if it's a new message (within last 24 hours - simplified check)
  const isNew = circular.SMSdate?.includes('Today') || false;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* For Badge */}
      <div className="mb-4">
        <ForBadge studentName={studentName} adno={circular.ADNO} />
      </div>

      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className="shrink-0">
          <CircularTypeIcon type={type} />
        </div>

        {/* Content */}
        <div className="grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {type === 'notice' ? 'Notification' : type.charAt(0).toUpperCase() + type.slice(1) + ' Notice'}
            </h3>
            {isNew && (
              <Badge variant="primary" size="sm">New</Badge>
            )}
          </div>

          <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">
            {message}
          </p>

          {/* Audio Player */}
          {type === 'audio' && imageUrl && (
            <div className="mb-3">
              <AudioPlayer src={imageUrl} />
            </div>
          )}

          {/* Image - Clickable to open slider */}
          {type === 'image' && imageUrl && (
            <div className="mb-3">
              <div
                className="relative aspect-video max-w-md bg-slate-100 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => onImageClick && onImageClick([imageUrl], 0)}
              >
                <img
                  src={imageUrl}
                  alt="Attachment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
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
            </div>
          )}

          {/* Document/PDF */}
          {(type === 'pdf' || type === 'document') && imageUrl && (
            <div className="mb-3">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">View Document</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex justify-end">
            <span className="text-xs text-slate-500">{dateStr}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Circulars() {
  const { user, selectedStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [circularsList, setCircularsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sliderImages, setSliderImages] = useState(null);
  const [sliderInitialIndex, setSliderInitialIndex] = useState(0);
  const pageSize = 10;

  // Get mobile number helper
  const getMobileNumber = () => {
    return selectedStudent?.contact || selectedStudent?.CONTACT ||
           user?.mobile_no || user?.contact || user?.mobileNumber;
  };

  // Handle image click to open slider
  const handleImageClick = (images, index) => {
    setSliderImages(images);
    setSliderInitialIndex(index);
  };

  // Fetch initial circulars data
  useEffect(() => {
    const fetchCirculars = async () => {
      const mobileNumber = getMobileNumber();

      if (!mobileNumber) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setCurrentPage(0);
      setCircularsList([]);

      try {
        const result = await getCirculars(mobileNumber, pageSize, 0);

        if (result.success) {
          const responseData = result.data?.data || result.data || [];
          const data = Array.isArray(responseData) ? responseData : [];
          setCircularsList(data);
          setTotalSize(result.data?.total_size || data.length);
        } else {
          setCircularsList([]);
        }
      } catch (err) {
        console.error('Error fetching circulars:', err);
        setCircularsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCirculars();
  }, [user, selectedStudent]);

  // Load more circulars
  const handleLoadMore = async () => {
    if (loadingMore) return;

    const mobileNumber = getMobileNumber();
    if (!mobileNumber) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const result = await getCirculars(mobileNumber, pageSize, nextPage * pageSize);

      if (result.success) {
        const responseData = result.data?.data || result.data || [];
        const data = Array.isArray(responseData) ? responseData : [];
        if (data.length > 0) {
          setCircularsList(prev => [...prev, ...data]);
          setCurrentPage(nextPage);
        }
      }
    } catch (err) {
      console.error('Error loading more circulars:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter circulars based on search query
  const filteredCirculars = circularsList.filter((circular) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const message = (circular.Message || circular.message || '').toLowerCase();
    const studentName = (circular.STUDENTNAME || circular.studentName || '').toLowerCase();
    return message.includes(query) || studentName.includes(query);
  });

  const hasMore = circularsList.length < totalSize;

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="w-full">
        <SearchBar
          placeholder="Search circulars..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )}

      {/* Circulars List */}
      {!loading && (
        <>
          <div className="flex flex-col gap-6">
            {filteredCirculars.length > 0 ? (
              filteredCirculars.map((circular, index) => (
                <CircularCard
                  key={`${circular.ADNO}-${circular.SMSdate}-${index}`}
                  circular={circular}
                  onImageClick={handleImageClick}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">No circulars found</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'No announcements available at the moment'}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Load More / Pagination Info */}
          {filteredCirculars.length > 0 && (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-sm text-slate-500">
                Showing {filteredCirculars.length} of {totalSize} circulars
              </p>
              {hasMore && !searchQuery && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Image Slider Modal */}
      {sliderImages && sliderImages.length > 0 && (
        <ImageSliderModal
          images={sliderImages}
          initialIndex={sliderInitialIndex}
          onClose={() => setSliderImages(null)}
        />
      )}
    </div>
  );
}

export default Circulars;
