import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Expo Monitor
        </h1>
        <p className="text-xl text-gray-600">
          AI-Powered Exhibition Intelligence Platform
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">📊 AI News Tracking</h3>
          <p className="text-gray-600">
            Automatically monitor industry news and exhibition updates
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">🎯 Smart Matching</h3>
          <p className="text-gray-600">
            AI-powered opportunity matching for your business
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">📈 Market Intelligence</h3>
          <p className="text-gray-600">
            Real-time insights on competitor activities
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link 
          href="/exhibitions"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          View Exhibitions
        </Link>
      </div>
    </div>
  )
}
