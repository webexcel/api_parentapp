import Card from './Card';

function ComingSoon({ title = 'Coming Soon', description = 'This feature is currently under development.' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Card className="p-8 md:p-12 text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>

        {/* Description */}
        <p className="text-slate-500 mb-6">{description}</p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span>Work in progress</span>
        </div>
      </Card>
    </div>
  );
}

export default ComingSoon;
