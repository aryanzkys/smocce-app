
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

export default function CandidateCard({ name, photo, vision, mission, experience, onSelect, selected }) {
  const [showDetails, setShowDetails] = useState(false)
  const [imgSrc, setImgSrc] = useState(photo || '/default-avatar.jpg')
  const [detailOpen, setDetailOpen] = useState(false)
  const closeDetail = useCallback(() => setDetailOpen(false), [])
  useEffect(() => { setImgSrc(photo || '/default-avatar.jpg') }, [photo])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeDetail() }
    if (detailOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [detailOpen, closeDetail])

  return (
    <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
      selected 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-500 shadow-xl ring-4 ring-blue-200' 
        : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300'
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
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
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

        {/* Inline brief details toggle (kept for quick peek) */}
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
          {(mission || experience) && (
            <button
              onClick={() => setDetailOpen(true)}
              className={`w-full py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selected
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Buka Detail Lengkap
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

      {/* Decorative Elements */}
      {selected && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-indigo-400 rounded-full opacity-40 animate-pulse"></div>
        </>
      )}

      {/* Full Detail Modal */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative">
            <button
              onClick={closeDetail}
              aria-label="Tutup"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Image src={imgSrc} alt={name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" onError={() => setImgSrc('/default-avatar.jpg')} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
                  <p className="text-xs text-gray-500">Profil Kandidat</p>
                </div>
              </div>
              {vision && (
                <section className="mb-4">
                  <h5 className="text-sm font-semibold text-blue-700 mb-1">Visi</h5>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{vision}</p>
                </section>
              )}
              {mission && (
                <section className="mb-4">
                  <h5 className="text-sm font-semibold text-indigo-700 mb-1">Misi</h5>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{mission}</p>
                </section>
              )}
              {experience && (
                <section className="mb-2">
                  <h5 className="text-sm font-semibold text-green-700 mb-1">Pengalaman</h5>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{experience}</p>
                </section>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={closeDetail} className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Tutup</button>
                <button onClick={() => { closeDetail(); onSelect && onSelect(); }} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Pilih Kandidat Ini</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
