
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function CandidateCard({ name, photo, vision, mission, experience, onSelect, selected }) {
  const [showDetails, setShowDetails] = useState(false)
  const [imgSrc, setImgSrc] = useState(photo || '/default-avatar.jpg')
  useEffect(() => { setImgSrc(photo || '/default-avatar.jpg') }, [photo])

  return (
  <div className={`relative overflow-hidden rounded-2xl transition-colors duration-200 ${
      selected 
    ? 'bg-blue-50 border-2 border-blue-500 shadow-lg' 
    : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
    }`}>
      {/* Selection Badge */}
      {selected && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Image
              src={imgSrc}
              alt={name}
              width={96}
              height={96}
              className={`w-24 h-24 object-cover rounded-full mx-auto border-4 transition-all duration-300 ${
                selected ? 'border-blue-400 shadow-lg' : 'border-gray-200 shadow-md'
              }`}
              onError={() => setImgSrc('/default-avatar.jpg')}
            />
            {selected && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
                ✓
              </div>
            )}
          </div>
          <h3 className={`font-bold text-lg mt-3 ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
            {name}
          </h3>
        </div>

        {/* Vision Section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${selected ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            <span className={`text-xs font-semibold uppercase tracking-wide ${selected ? 'text-blue-700' : 'text-gray-500'}`}>
              Visi
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${selected ? 'text-blue-800' : 'text-gray-600'}`}>
            {vision}
          </p>
        </div>

  {/* Inline details (scroll down to read) */}
        {showDetails && (
          <div className="space-y-3 mb-4 animate-fadeIn">
            {mission && (
              <div>
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${selected ? 'bg-indigo-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${selected ? 'text-indigo-700' : 'text-gray-500'}`}>
                    Misi (ringkas)
                  </span>
                </div>
                <p className={`text-sm leading-relaxed line-clamp-4 ${selected ? 'text-indigo-800' : 'text-gray-600'}`}>
                  {mission}
                </p>
              </div>
            )}
            {experience && (
              <div>
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${selected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${selected ? 'text-green-700' : 'text-gray-500'}`}>
                    Pengalaman (ringkas)
                  </span>
                </div>
                <p className={`text-sm leading-relaxed line-clamp-4 ${selected ? 'text-green-800' : 'text-gray-600'}`}>
                  {experience}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {(mission || experience) && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                selected
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showDetails ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Sembunyikan Detail
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Lihat Detail
                </span>
              )}
            </button>
          )}
          
          <button
            onClick={onSelect}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
              selected
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg'
            }`}
          >
            {selected ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Kandidat Terpilih
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Pilih Kandidat
              </span>
            )}
          </button>
        </div>
      </div>

  {/* Decorative Elements removed for a flatter look */}
    </div>
  );
}
