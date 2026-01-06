import { useState } from 'react';
import { Card, SearchBar, Badge, AudioPlayer } from '../../components/common';

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
function ForBadge({ forStudent, studentClass }) {
  const isForAll = forStudent === 'All Students';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold ${
      isForAll
        ? 'bg-slate-100 text-slate-700'
        : 'bg-indigo-50 text-indigo-700'
    }`}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      For: {forStudent}{studentClass && ` (${studentClass})`}
    </div>
  );
}

// Attachment Component
function Attachment({ name, size, type }) {
  const typeIcons = {
    pdf: (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      </svg>
    ),
    doc: (
      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-2 pr-4 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
      <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
        {typeIcons[type] || typeIcons.doc}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-900">{name}</span>
        <span className="text-[10px] text-slate-500">{size}</span>
      </div>
    </div>
  );
}

// Image Gallery Component
function ImageGallery({ images }) {
  const displayImages = images.slice(0, 3);
  const remainingCount = images.length - 3;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className="aspect-video bg-slate-200 rounded-lg overflow-hidden relative group cursor-pointer"
        >
          {index === 2 && remainingCount > 0 ? (
            <>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <span className="text-white font-bold text-lg">+{remainingCount}</span>
              </div>
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover blur-[1px]"
              />
            </>
          ) : (
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Video Player Component
function VideoThumbnail({ thumbnail, duration }) {
  return (
    <div className="relative w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer">
      <img
        src={thumbnail}
        alt="Video thumbnail"
        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
        {duration}
      </span>
    </div>
  );
}

// Circular Card Component
function CircularCard({ circular }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* For Badge */}
      <div className="mb-4">
        <ForBadge forStudent={circular.forStudent} studentClass={circular.studentClass} />
      </div>

      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className="flex-shrink-0">
          <CircularTypeIcon type={circular.type} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 mb-1">{circular.title}</h3>
            {circular.isNew && (
              <Badge variant="primary" size="sm">New</Badge>
            )}
          </div>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2">
            {circular.description}
          </p>

          {/* Attachment */}
          {circular.attachment && (
            <div className="flex items-center gap-4 mb-3">
              <Attachment
                name={circular.attachment.name}
                size={circular.attachment.size}
                type={circular.attachment.type}
              />
            </div>
          )}

          {/* Audio Player */}
          {circular.type === 'audio' && circular.audioUrl && (
            <div className="mb-3">
              <AudioPlayer src={circular.audioUrl} duration={circular.audioDuration} />
            </div>
          )}

          {/* Image Gallery */}
          {circular.type === 'image' && circular.images && (
            <div className="mb-3">
              <ImageGallery images={circular.images} />
            </div>
          )}

          {/* Video */}
          {circular.type === 'video' && circular.videoThumbnail && (
            <div className="mb-3">
              <VideoThumbnail thumbnail={circular.videoThumbnail} duration={circular.videoDuration} />
            </div>
          )}

          {/* Timestamp */}
          <div className="flex justify-end">
            <span className="text-xs text-slate-500">{circular.timestamp}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Circulars() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with API calls
  const circularsList = [
    {
      id: 1,
      type: 'pdf',
      title: 'Annual Sports Day Guidelines',
      description: 'Please find attached the detailed guidelines and schedule for the upcoming Annual Sports Day. Ensure all participants read through the rules carefully.',
      forStudent: 'Pranav OG',
      studentClass: 'Class IV-C',
      isNew: true,
      timestamp: 'Oct 24, 2023 - 10:30 AM',
      attachment: {
        name: 'Sports_Day_2024.pdf',
        size: '2.4 MB',
        type: 'pdf',
      },
    },
    {
      id: 2,
      type: 'audio',
      title: "Principal's Welcome Note",
      description: 'A special welcome message from our Principal regarding the new academic term.',
      forStudent: 'Arivumathi V',
      studentClass: 'Class I-A',
      isNew: false,
      timestamp: 'Oct 23, 2023 - 09:00 AM',
      audioUrl: '/audio/welcome.mp3',
      audioDuration: '1:45',
    },
    {
      id: 3,
      type: 'image',
      title: 'Science Exhibition Highlights',
      description: "We are thrilled to share some glimpses from yesterday's Science Exhibition. The students' projects were truly innovative!",
      forStudent: 'Pranav OG',
      studentClass: 'Class IV-C',
      isNew: false,
      timestamp: 'Oct 22, 2023 - 2:15 PM',
      images: [
        'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop',
      ],
    },
    {
      id: 4,
      type: 'video',
      title: 'Annual Day Rehearsal Video',
      description: 'Watch the dance rehearsal for Class 5. Parents are requested to ensure costumes are ready by Friday.',
      forStudent: 'Arivumathi V',
      studentClass: 'Class I-A',
      isNew: false,
      timestamp: 'Oct 20, 2023 - 11:00 AM',
      videoThumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=400&fit=crop',
      videoDuration: '04:32',
    },
    {
      id: 5,
      type: 'document',
      title: 'Updated Holiday Homework List',
      description: 'The holiday homework list has been updated with a few changes for Mathematics and English. Please refer to the attached document.',
      forStudent: 'Pranav OG',
      studentClass: 'Class IV-C',
      isNew: false,
      timestamp: 'Oct 18, 2023 - 03:45 PM',
      attachment: {
        name: 'Homework_Updated.docx',
        size: '128 KB',
        type: 'doc',
      },
    },
    {
      id: 6,
      type: 'notice',
      title: 'Early Dismissal Notice',
      description: 'Dear Parents, Please be informed that the school will dismiss at 12:30 PM tomorrow, Friday, Oct 27th, due to the staff development workshop. Buses will depart at 12:45 PM. Please make necessary arrangements to pick up your ward on time.',
      forStudent: 'All Students',
      studentClass: null,
      isNew: false,
      timestamp: 'Oct 15, 2023 - 08:00 AM',
    },
  ];

  // Filter circulars based on search query
  const filteredCirculars = circularsList.filter((circular) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      circular.title.toLowerCase().includes(query) ||
      circular.description.toLowerCase().includes(query) ||
      circular.forStudent.toLowerCase().includes(query)
    );
  });

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

      {/* Circulars List */}
      <div className="flex flex-col gap-6">
        {filteredCirculars.length > 0 ? (
          filteredCirculars.map((circular) => (
            <CircularCard key={circular.id} circular={circular} />
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
    </div>
  );
}

export default Circulars;
