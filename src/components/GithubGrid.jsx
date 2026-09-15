import { GitHubCalendar } from 'react-github-calendar';

export default function GithubGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-2">The Engine</h2>
      <p className="text-gray-400 mb-8">
        A visual record of my daily code commits and technical consistency.
      </p>

      {/* Calendar Container - Mobile Scrollable */}
      <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
        <div className="min-w-[750px] flex justify-center py-2">
          <GitHubCalendar
            username="KadalHitaam"
            colorScheme="dark"
            blockSize={13}
            blockMargin={4}
            fontSize={14}
            theme={{ dark: ['#27272a', '#166534', '#15803d', '#16a34a', '#22c55e'] }}
          />
        </div>
      </div>
    </section>
  );
}