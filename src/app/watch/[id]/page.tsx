import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { CopyButton } from '@/components/ui/CopyButton';
import type { Metadata } from 'next';
import { getThumbnailUrl } from '@/lib/youtube';

interface WatchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 0;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: video } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

    if (!video) {
        return {
            title: '動画が見つかりません | TextTube',
        };
    }

    const description = video.summary || `${video.title}の要約とスクリプトをテキストで読む`;

    return {
        title: `${video.title} | TextTube`,
        description,
        openGraph: {
            title: video.title,
            description,
            images: video.thumbnail_url ? [getThumbnailUrl(video.thumbnail_url)] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: video.title,
            description,
            images: video.thumbnail_url ? [getThumbnailUrl(video.thumbnail_url)] : [],
        },
    };
}

export default async function WatchPage({ params }: WatchPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 閲覧数をインクリメント (非同期で実行)
    const { incrementViewCount } = await import('@/app/actions');
    incrementViewCount(id).catch(console.error);

    const { data: video, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !video) {
        console.error('Error fetching video:', error);
        return notFound();
    }

    // 要約の文字数に基づいて読了時間を計算 (1分平均1000文字換算)
    const summaryCharCount = (video.summary || '').length;
    const readTimeMin = Math.max(1, Math.ceil(summaryCharCount / 1000));

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1600px] mx-auto overflow-visible">
            {/* Main Content: Text-First Layout */}
            <div className="flex-1 lg:max-w-[70%] overflow-visible">
                {/* Compact Header with Thumbnail - Sticky Below Global Nav (56px/14) */}
                <div className="sticky top-14 z-20 bg-background py-4 mb-6 border-b border-gray-800 -mx-4 px-4 md:-mx-6 md:px-6">
                    <div className="flex gap-4">
                        {video.thumbnail_url && (
                            <div className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 relative rounded-lg overflow-hidden border border-gray-800">
                                <Image
                                    src={getThumbnailUrl(video.thumbnail_url)}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold mb-2 truncate" title={video.title}>{video.title}</h1>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                                <span className="truncate">{video.channel_name}</span>
                                <span>•</span>
                                <span>{new Date(video.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="text-tube-red font-medium whitespace-nowrap">要約読了：約{readTimeMin}分</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1e1e1e] rounded-xl p-6 mb-6 border border-gray-800">
                    <h2 className="text-lg font-bold mb-3 text-white">要約</h2>
                    <MarkdownRenderer content={video.summary || ''} />
                </div>


            </div>

            {/* Right Column: Suggested Videos (Sidebar) */}
            <div className="w-full lg:w-[350px] flex flex-col gap-4">
                <h3 className="text-lg font-bold px-1">次の動画</h3>
                {/* Placeholder for "Up Next" list */}
                <Link href="/" className="block p-4 bg-[#1e1e1e] rounded-xl hover:bg-[#2a2a2a] transition-colors">
                    <div className="text-sm text-gray-400 mb-1">おすすめ</div>
                    <div className="font-semibold text-white">もっと動画を探す</div>
                </Link>
            </div>
        </div>
    );
}
