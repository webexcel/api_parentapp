import { useState, useEffect } from 'react';
import { Card, SearchBar, Loader, ImageSliderModal } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { getExamSchedule } from '../../services/examService';

// Helper to determine content type from URL
function getContentType(url) {
  if (!url) return null;

  const lowerUrl = url.toLowerCase();

  // Image files
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
    return 'image';
  }

  // PDF files
  if (lowerUrl.includes('.pdf')) return 'pdf';

  return 'image';
}

// Content Type Icon Component
function ContentTypeIcon({ type }) {
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
    image: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      textColor: 'text-green-500',
    },
    exam: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
  };

  const config = typeConfig[type] || typeConfig.exam;

  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} ${config.textColor}`}>
      {config.icon}
    </div>
  );
}

// Exam Card Component - Full width like Circulars
function ExamCard({ exam, onImageClick }) {
  const hasAttachment = exam.imgfile && exam.imgfile.length > 0;
  const contentType = hasAttachment ? getContentType(exam.imgfile) : null;
  const isPdf = contentType === 'pdf';
  const isImage = contentType === 'image';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className="shrink-0">
          <ContentTypeIcon type={hasAttachment ? contentType : 'exam'} />
        </div>

        {/* Content */}
        <div className="grow min-w-0">
          <div className="flex justify-between items-start gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-slate-900 uppercase">
              {exam.subject}
            </h3>
            <span className="shrink-0 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
              {exam.exam_date}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-amber-600 font-medium mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{exam.time}</span>
          </div>

          {/* Portion/Notes */}
          {exam.portion && (
            <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-sm text-slate-600 flex items-start gap-2">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><span className="font-medium">Portion:</span> {exam.portion}</span>
              </p>
            </div>
          )}

          {/* Image Preview - Clickable to open slider */}
          {isImage && (
            <div className="mt-4">
              <div
                className="relative aspect-video max-w-md bg-slate-100 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => onImageClick && onImageClick([exam.imgfile], 0)}
              >
                <img
                  src={exam.imgfile}
                  alt={exam.subject}
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

          {/* PDF/Document Button */}
          {isPdf && (
            <div className="mt-4">
              <a
                href={exam.imgfile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">View PDF</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ExamSchedule() {
  const { selectedStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [examList, setExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState(null);
  const [sliderInitialIndex, setSliderInitialIndex] = useState(0);

  // Handle image click to open slider
  const handleImageClick = (images, index) => {
    setSliderImages(images);
    setSliderInitialIndex(index);
  };

  // Fetch exam schedule
  useEffect(() => {
    const fetchExamSchedule = async () => {
      const classId = selectedStudent?.CLASS_ID || selectedStudent?.classid || selectedStudent?.CLASSID;

      if (!classId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getExamSchedule(classId);

        if (result.success) {
          const responseData = result.data?.data || result.data || [];
          const data = Array.isArray(responseData) ? responseData : [];
          setExamList(data);
        } else {
          setExamList([]);
        }
      } catch (err) {
        console.error('Error fetching exam schedule:', err);
        setExamList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamSchedule();
  }, [selectedStudent]);

  // Filter exams based on search
  const filteredExams = examList.filter((exam) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const subject = (exam.subject || '').toLowerCase();
    const portion = (exam.portion || '').toLowerCase();
    const date = (exam.exam_date || '').toLowerCase();
    return subject.includes(query) || portion.includes(query) || date.includes(query);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="w-full">
        <SearchBar
          placeholder="Search exams..."
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


      {/* Exam List */}
      {!loading && (
        <>
          <div className="flex flex-col gap-6">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam, index) => (
                <ExamCard
                  key={index}
                  exam={exam}
                  onImageClick={handleImageClick}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">No Exams Found</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {searchQuery ? 'No exams matching your search' : 'No upcoming exams scheduled'}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Count */}
          {filteredExams.length > 0 && (
            <div className="flex justify-center py-2">
              <p className="text-sm text-slate-500">
                Showing {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}
              </p>
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

export default ExamSchedule;
