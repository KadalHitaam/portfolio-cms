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

  // Assign accent colors to tabs
  const tabColors = ['var(--nb-yellow)', 'var(--nb-pink)', 'var(--nb-blue)', 'var(--nb-mint)', 'var(--nb-lavender)', 'var(--nb-orange)', 'var(--nb-coral)'];

  return (
    <section id="notes" className="max-w-6xl mx-auto px-6 py-16">
      {/* Section Header */}
      <h2 className="nb-section-title">Learning Vault</h2>
      <p className="mt-3 mb-8" style={{ color: 'var(--nb-ink-muted)', fontSize: '1.05rem' }}>
        Dokumentasi proses belajar dan checkpoint personal.
      </p>

      {/* Tabs UI */}
      <div className="flex flex-wrap gap-3 mb-8 pb-4" style={{ borderBottom: '3px solid var(--nb-ink)' }}>
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="px-4 py-2 text-sm font-bold uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              border: '3px solid var(--nb-ink)',
              backgroundColor: activeTab === cat ? tabColors[i % tabColors.length] : '#ffffff',
              color: 'var(--nb-ink)',
              boxShadow: activeTab === cat ? 'none' : '3px 3px 0px var(--nb-ink)',
              transform: activeTab === cat ? 'translate(3px, 3px)' : 'none',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div
            className="py-8 text-center"
            style={{
              border: '3px solid var(--nb-ink)',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--nb-shadow)',
              fontFamily: 'var(--font-heading)',
              color: 'var(--nb-ink-muted)',
            }}
          >
            No notes found in this category.
          </div>
        ) : (
          paginatedNotes.map((note, idx) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                border: '3px solid var(--nb-ink)',
                boxShadow: '4px 4px 0px var(--nb-ink)',
                transition: 'transform 100ms ease, box-shadow 100ms ease',
                animationDelay: `${idx * 40}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px var(--nb-ink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '4px 4px 0px var(--nb-ink)';
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-bold px-2.5 py-1 uppercase tracking-wider"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--nb-mint)',
                    border: '2px solid var(--nb-ink)',
                    color: 'var(--nb-ink)',
                  }}
                >
                  {note.level}
                </span>
                <h3
                  className="font-bold"
                  style={{
                    color: 'var(--nb-ink)',
                    fontFamily: 'var(--font-heading)',
                    transition: 'color 150ms ease',
                  }}
                >
                  {note.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm">
                <span
                  className="text-xs font-bold px-2.5 py-1 uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--nb-yellow)',
                    border: '2px solid var(--nb-ink)',
                    color: 'var(--nb-ink)',
                  }}
                >
                  {note.category}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--nb-ink-muted)',
                  }}
                >
                  {note.date}
                </span>
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
            className="nb-btn nb-btn-secondary text-xs"
            style={{ fontSize: '0.75rem' }}
          >
            ← Previous
          </button>
          <span
            className="text-sm font-bold px-4 py-2"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--nb-ink)',
              border: '3px solid var(--nb-ink)',
              backgroundColor: 'var(--nb-yellow)',
            }}
          >
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="nb-btn nb-btn-secondary text-xs"
            style={{ fontSize: '0.75rem' }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal / Drawer Overlay */}
      {selectedNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 nb-overlay"
        >
          <div
            className="max-w-lg w-full p-6 relative nb-modal-animate"
            style={{
              backgroundColor: 'var(--nb-bg)',
              border: '4px solid var(--nb-ink)',
              boxShadow: '10px 10px 0px var(--nb-ink)',
            }}
          >
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid var(--nb-ink)',
                backgroundColor: 'var(--nb-coral)',
                color: 'var(--nb-ink)',
                transition: 'transform 80ms ease, box-shadow 80ms ease',
                boxShadow: '2px 2px 0px var(--nb-ink)',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '2px 2px 0px var(--nb-ink)';
              }}
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className="text-xs font-bold px-2.5 py-1 uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--nb-mint)',
                  border: '2px solid var(--nb-ink)',
                  color: 'var(--nb-ink)',
                }}
              >
                {selectedNote.level}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--nb-yellow)',
                  border: '2px solid var(--nb-ink)',
                  color: 'var(--nb-ink)',
                }}
              >
                {selectedNote.category}
              </span>
              <span
                className="text-xs font-bold ml-auto"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--nb-ink-muted)',
                }}
              >
                {selectedNote.date}
              </span>
            </div>

            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--nb-ink)', fontFamily: 'var(--font-heading)' }}
            >
              {selectedNote.title}
            </h3>

            <div style={{ borderTop: '3px solid var(--nb-ink)', paddingTop: '1rem' }}>
              <div 
                className="nb-prose max-w-none text-sm md:text-base leading-relaxed max-h-[60vh] overflow-y-auto pr-2"
                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="nb-btn nb-btn-pink text-xs"
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
