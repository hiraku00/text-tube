'use client';

import { useState } from 'react';
import { VideoCard } from '@/components/ui/VideoCard';
import { Search } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    channel_name: string;
    thumbnail_url: string;
    summary: string;
    duration: string;
    created_at: string;
    published_at?: string;
    view_count?: number;
    channel_thumbnail_url?: string;
}

interface VideoListProps {
    videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    // 有効なチャンネル名のリストを取得
    const channels = Array.from(new Set(videos.map(v => v.channel_name))).filter(Boolean);

    const filteredVideos = videos.filter(video => {
        const matchesSearch =
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (video.summary || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesChannel = selectedChannel ? video.channel_name === selectedChannel : true;

        return matchesSearch && matchesChannel;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="動画を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#121212] border border-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-gray-600 transition-colors"
                    />
                </div>

                {/* Channel Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
                    <button
                        onClick={() => setSelectedChannel(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedChannel === null
                            ? 'bg-white text-black'
                            : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
                            }`}
                    >
                        すべて
                    </button>
                    {channels.map(channel => (
                        <button
                            key={channel}
                            onClick={() => setSelectedChannel(channel === selectedChannel ? null : channel)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedChannel === channel
                                ? 'bg-white text-black'
                                : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
                                }`}
                        >
                            {channel}
                        </button>
                    ))}
                </div>
            </div>

            {filteredVideos.length === 0 ? (
                <div className="text-gray-500 mt-10 text-center py-20 bg-[#121212] rounded-xl border border-dashed border-gray-800">
                    該当する動画が見つかりませんでした。
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {filteredVideos.map((video) => (
                        <VideoCard
                            key={video.id}
                            id={video.id}
                            title={video.title}
                            channelName={video.channel_name}
                            thumbnailUrl={video.thumbnail_url}
                            duration={video.duration || '10:00'}
                            createdAt={video.created_at}
                            publishedAt={video.published_at}
                            viewCount={video.view_count}
                            channelThumbnailUrl={video.channel_thumbnail_url}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
