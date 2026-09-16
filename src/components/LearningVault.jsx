import { useState, useMemo } from 'react';

export default function LearningVault({ notes = [] }) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedNote, setSelectedNote] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = notes.map((n) => n.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [notes]);

  // Filter notes based on active tab
  const filteredNotes = useMemo(() => {
    if (activeTab === 'All') return notes;
    return notes.filter((n) => n.category === activeTab);
  }, [notes, activeTab]);

  // Pagination (7 rows)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Reset halaman ke 1 setiap kali tab/kategori filter diubah
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Logic memotong array data berdasarkan halaman aktif
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotes, currentPage]);

  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);

  return (
    <section id="notes" className="max-w-6xl mx-auto px-6 py-16">
      {/* ... Filter Buttons ... */}
      <h2 className="text-3xl font-bold text-white mb-2">Learning Vault</h2>
      <p className="text-gray-400 mb-8">Dokumentasi proses belajar dan checkpoint personal.</p>

      {/* Tabs UI */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === cat
                ? 'bg-[#22c55e] text-black font-semibold shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No notes found in this category.</p>
        ) : (
          paginatedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-emerald-400 font-mono bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">
                  {note.level}
                </span>
                <h3 className="text-white font-medium group-hover:text-emerald-300 transition-colors">
                  {note.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm text-gray-400">
                <span className="bg-zinc-800 px-2.5 py-0.5 rounded-full text-xs text-gray-300">
                  {note.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">{note.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
        
        {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal / Drawer Overlay */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-emerald-400 font-mono bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">
                {selectedNote.level}
              </span>
              <span className="bg-zinc-800 px-2.5 py-0.5 rounded-full text-xs text-gray-300">
                {selectedNote.category}
              </span>
              <span className="text-xs font-mono text-zinc-500 ml-auto">{selectedNote.date}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">{selectedNote.title}</h3>

            <div className="border-t border-zinc-800 pt-4">
              <div 
                className="prose prose-invert max-w-none text-gray-300 text-sm md:text-base leading-relaxed max-h-[60vh] overflow-y-auto pr-2"
                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
