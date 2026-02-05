import { VideoList } from '@/components/ui/VideoList';
import { createClient } from '@/lib/supabase/server';
import SearchInput from '@/components/studio/SearchInput';
import SortSelector from '@/components/studio/SortSelector';

export const revalidate = 0;

const SORT_OPTIONS = [
  { label: '最新順（記事作成日）', value: 'created_at-desc' },
  { label: '人気順（閲覧数）', value: 'view_count-desc' },
  { label: '古い順', value: 'created_at-asc' },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const sort = params.sort || 'created_at-desc';
  const [sortCol, sortDir] = sort.split('-');

  const supabase = await createClient();

  let query = supabase
    .from('videos')
    .select('*')
    .order(sortCol as any, { ascending: sortDir === 'asc' });

  if (q) {
    query = query.or(`title.ilike.%${q}%,channel_name.ilike.%${q}%`);
  }

  const { data: videos, error } = await query;

  if (error) {
    console.error('Error fetching videos:', error);
  }

  const displayVideos = videos || [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-xl font-bold">おすすめの要約</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            {/* SearchInput component might need adjustment for baseUrl, but default is /studio. Let's create a generic one or adjust it. */}
            <SearchInput baseUrl="/" />
          </div>
          <SortSelector options={SORT_OPTIONS} baseUrl="/" />
        </div>
      </div>

      {displayVideos.length === 0 && (
        <div className="text-gray-500 mt-20 text-center flex flex-col items-center gap-4">
          <p className="text-lg">動画がまだありません。</p>
          <a href="/studio" className="bg-tube-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-all">
            スタジオで作成する
          </a>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <VideoList videos={displayVideos} />
      </div>
    </div>
  );
}
