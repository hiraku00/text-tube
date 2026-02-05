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
            {videos.length === 0 ? (
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
