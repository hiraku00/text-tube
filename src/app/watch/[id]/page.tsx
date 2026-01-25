import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { CopyButton } from '@/components/ui/CopyButton';
import type { Metadata } from 'next';

interface WatchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 0;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
    const { id } = await params;

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
            images: video.thumbnail_url ? [video.thumbnail_url] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: video.title,
            description,
            images: video.thumbnail_url ? [video.thumbnail_url] : [],
        },
    };
}

export default async function WatchPage({ params }: WatchPageProps) {
    const { id } = await params;

    const { data: video, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !video) {
        console.error('Error fetching video:', error);
        return notFound();
    }

    // Calculate read time based on chars (approx 500 chars/min)
    const charCount = (video.detailed_script || '').length;
    const readTimeMin = Math.ceil(charCount / 500);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
            {/* Main Content: Text-First Layout */}
            <div className="flex-1 lg:max-w-[70%]">
                {/* Compact Header with Thumbnail */}
                <div className="flex gap-4 mb-6">
                    {video.thumbnail_url && (
                        <div className="flex-shrink-0 w-40 h-24 relative rounded-lg overflow-hidden">
                            <Image
                                src={video.thumbnail_url}
                                alt={video.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{video.channel_name}</span>
                            <span>•</span>
                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-tube-red font-medium">約{readTimeMin}分で読める</span>
                        </div>
                        {video.original_url && (
                            <a
                                href={video.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                            >
                                元の動画を見る →
                            </a>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1e1e1e] rounded-xl p-6 mb-6 border border-gray-800">
                    <h2 className="text-lg font-bold mb-3 text-white">要約</h2>
                    <p className="text-gray-300 leading-relaxed">{video.summary}</p>
                </div>

                {/* Copy Button */}
                <div className="flex justify-end mb-4">
                    <CopyButton content={video.detailed_script || ''} />
                </div>

                {/* Detailed Script - Now with Markdown */}
                <div className="bg-[#121212] rounded-xl p-6 md:p-10">
                    <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-tube-red pl-4">
                        詳細スクリプト
                    </h3>
                    <MarkdownRenderer content={video.detailed_script || ''} />
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
