import React, { useEffect, useState } from 'react'
import { Bell, Calendar, Clock, Download, ExternalLink, FileText, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { schoolInfo } from '../../data/seedData.js'

const API_URL = import.meta.env.VITE_API_URL ||
  `${window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin}/api`

const formatDate = (date) => {
  if (!date) return ''
  const value = new Date(date)
  return Number.isNaN(value.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(value)
}

const getPdfUrl = (pdf) => {
  if (!pdf) return null
  if (/^https?:\/\//i.test(pdf)) return pdf
  return `${API_URL}${pdf.startsWith('/') ? pdf : `/${pdf}`}`
}

const CircularsPanel = () => {
  const [circulars, setCirculars] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCircular, setSelectedCircular] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const loadCirculars = async () => {
      try {
        const response = await fetch(`${API_URL}/circulars`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to load circulars (${response.status})`)
        const payload = await response.json()
        setCirculars(Array.isArray(payload.data) ? payload.data : [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load circulars:', error)
          setCirculars([])
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadCirculars()
    return () => controller.abort()
  }, [])

  const circular = circulars[0]
  const pdfUrl = getPdfUrl(selectedCircular?.pdf)
  const downloadPdf = (event) => {
    event?.stopPropagation()
    if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full h-full flex flex-col">
        <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-4 py-4 flex items-center gap-3 text-white">
          <Bell size={22} />
          <h3 className="font-bold text-base tracking-wide">Latest Circulars</h3>
          <span className="ml-auto text-[10px] font-medium bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
            {loading ? 'Loading' : `${circulars.length} ${circulars.length === 1 ? 'New' : 'New'}`}
          </span>
        </header>

        <div className="flex-1 p-4">
          {loading ? (
            <div className="h-full min-h-40 flex items-center justify-center text-sm text-gray-500">Loading circulars…</div>
          ) : circular ? (
            <button type="button" onClick={() => setSelectedCircular(circular)} className="w-full text-left bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0"><Bell size={20} className="text-white" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-amber-800 leading-tight">{circular.title}</p>
                  {circular.description && <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 mt-2">{circular.description}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-amber-100">
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  {circular.date && <span className="flex items-center gap-1"><Calendar size={11} className="text-amber-500" />{formatDate(circular.date)}</span>}
                  {circular.time && <span className="flex items-center gap-1"><Clock size={11} className="text-amber-500" />{circular.time}</span>}
                </div>
                <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">View notice <ExternalLink size={11} /></span>
              </div>
            </button>
          ) : (
            <div className="h-full min-h-40 flex flex-col items-center justify-center text-center px-4">
              <Bell size={28} className="text-amber-400 mb-3" />
              <p className="text-sm font-semibold text-gray-600">No circulars available</p>
              <p className="text-xs text-gray-400 mt-1">New notices posted by the school will appear here.</p>
            </div>
          )}
        </div>

        <footer className="bg-gradient-to-r from-amber-50 to-amber-100/80 px-4 py-2.5 border-t border-amber-200/50">
          <p className="text-[10px] text-amber-700 font-medium text-center">{schoolInfo.shortName || schoolInfo.name} - {schoolInfo.branch}</p>
        </footer>
      </section>

      <AnimatePresence>
        {selectedCircular && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCircular(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
              <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2"><Bell size={20} /><h3 className="font-bold text-lg">Circular</h3></div>
                <button type="button" onClick={() => setSelectedCircular(null)} className="p-1.5 rounded-full hover:bg-white/20" aria-label="Close circular"><X size={22} /></button>
              </header>
              <div className="p-6 space-y-4">
                <h4 className="text-xl font-bold text-amber-800">{selectedCircular.title}</h4>
                {(selectedCircular.date || selectedCircular.time) && <div className="flex items-center gap-4 text-sm text-gray-500 bg-amber-50 p-3 rounded-lg">
                  {selectedCircular.date && <span className="flex items-center gap-1.5"><Calendar size={16} className="text-amber-500" />{formatDate(selectedCircular.date)}</span>}
                  {selectedCircular.time && <span className="flex items-center gap-1.5"><Clock size={16} className="text-amber-500" />{selectedCircular.time}</span>}
                </div>}
                {selectedCircular.description && <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedCircular.description}</p>}
                {pdfUrl && <button type="button" onClick={downloadPdf} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-semibold rounded-xl hover:from-amber-700 hover:to-amber-600"><FileText size={18} />Download PDF<Download size={16} /></button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CircularsPanel
