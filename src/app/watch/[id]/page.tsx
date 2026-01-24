import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface WatchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const revalidate = 0;

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
            {/* Left Column: "Player" Area */}
            <div className="flex-1 lg:max-w-[70%]">
                {/* The "Player" - Summary Card */}
                <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl mb-4 border border-[#333]">
                    <div className="aspect-video relative w-full bg-black flex items-center justify-center overflow-hidden group">
                        {video.thumbnail_url && (
                            <Image
                                src={video.thumbnail_url}
                                alt={video.title}
                                fill
                                className="object-cover opacity-30 group-hover:opacity-20 transition-opacity"
                            />
                        )}
                        <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                                {video.title}
                            </h2>
                            <div className="bg-tube-red/90 text-white px-4 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                                読む動画: 約{readTimeMin}分
                            </div>
                            <p className="text-gray-200 text-lg max-w-2xl leading-relaxed drop-shadow-md">
                                {video.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video Metadata */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold line-clamp-2 mb-2">{video.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        {video.original_url && (
                            <a href={video.original_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                元の動画を見る
                            </a>
                        )}
                    </div>
                </div>

                <div className="my-6 border-t border-gray-800" />

                {/* Detailed Script */}
                <div className="bg-[#121212] rounded-xl p-6 md:p-10 text-gray-300 leading-8 text-lg font-serif">
                    <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-tube-red pl-4">
                        詳細スクリプト
                    </h3>
                    <div className="whitespace-pre-wrap">
                        {video.detailed_script}
                    </div>
                </div>
            </div>

            {/* Right Column: Suggested Videos (Sidebar logic placeholder) */}
            <div className="w-full lg:w-[350px] flex flex-col gap-4">
                <h3 className="text-lg font-bold px-1">次の動画</h3>
                {/* Placeholder for "Up Next" list using the same data for now, or just static link back to home */}
                <Link href="/" className="block p-4 bg-[#1e1e1e] rounded-xl hover:bg-[#2a2a2a] transition-colors">
                    <div className="text-sm text-gray-400 mb-1">おすすめ</div>
                    <div className="font-semibold text-white">もっと動画を探す</div>
                </Link>
            </div>
        </div>
    );
}
