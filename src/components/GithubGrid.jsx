import { GitHubCalendar } from 'react-github-calendar';

export default function GithubGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* Title */}
      <h2 className="nb-section-title">The Engine</h2>
      <p className="mt-3 mb-8" style={{ color: 'var(--nb-ink-muted)', fontSize: '1.05rem' }}>
        A visual record of my daily code commits and technical consistency.
      </p>

      {/* Calendar Container - Mobile Scrollable */}
      <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
        <div className="min-w-[750px] flex justify-center py-2">
          <GitHubCalendar
            username="KadalHitaam"
            colorScheme="light"
            blockSize={13}
            blockMargin={4}
            fontSize={14}
            theme={{ light: ['#ede8dd', '#c9e4a5', '#7dcea0', '#27ae60', '#1a8a4a'] }}
          />
        </div>
      </div>
    </section>
  );
}