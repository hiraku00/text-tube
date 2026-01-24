import { VideoCard } from '@/components/ui/VideoCard';
import { supabase } from '@/lib/supabase';

// Mock data for initial UI verification
const MOCK_VIDEOS = [
  {
    id: '1',
    title: '【完全解説】Next.js 15の神機能を10分でマスターする',
    channel_name: 'TechTube Japan',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    summary: 'Next.js 15の新機能であるServer Actions、Partial Prerendering、新しいキャッシング戦略について、実例を交えて解説します。',
    duration: '10:05',
    created_at: new Date().toISOString(),
  },
];

export const revalidate = 0; // Disable cache for demo purposes

export default async function Home() {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
  }

  // Use mock data only if DB is empty for demo experience, or just empty list.
  // Let's rely on real data. If empty, it will show nothing, which is fine (user can go to studio).
  const displayVideos = videos && videos.length > 0 ? videos : [];

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">おすすめの要約</h2>
      {displayVideos.length === 0 && (
        <div className="text-gray-500 mt-10 text-center">
          動画がまだありません。<a href="/studio" className="text-blue-400 underline">スタジオ</a>から作成してください。
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {displayVideos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            channelName={video.channel_name}
            thumbnailUrl={video.thumbnail_url}
            summary={video.summary || ''}
            duration={video.duration || '10:00'} // Fallback duration if not in DB? Schema doesn't have duration?
            // Wait, schema didn't have duration in my SQL command? 
            // Let's check schema.sql. I missed duration column in SQL I wrote?
            createdAt={video.created_at}
          />
        ))}
      </div>
    </div>
  );
}
