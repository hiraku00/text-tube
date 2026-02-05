import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { getThumbnailUrl } from '@/lib/youtube';

interface VideoCardProps {
    id: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    duration?: string;
    createdAt: string;
    publishedAt?: string;
    viewCount?: number;
    channelThumbnailUrl?: string;
}

const formatViews = (views?: number) => {
    if (views === undefined || views === null) return '0 閲覧';
    const v = Math.max(0, views);
    if (v >= 10000) {
        return `${(v / 10000).toFixed(1)}万 閲覧`;
    }
    return `${v.toLocaleString()} 閲覧`;
};

const formatDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
        return dateStr;
    }
};

export function VideoCard({
    id,
    title,
    channelName,
    thumbnailUrl,
    duration = "10:00",
    createdAt,
    publishedAt,
    viewCount,
    channelThumbnailUrl
}: VideoCardProps) {
    return (
        <Link href={`/watch/${id}`} className="group flex flex-col gap-3 cursor-pointer">
            {/* Thumbnail Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <Image
                    src={getThumbnailUrl(thumbnailUrl)}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">
                    {duration}
                </div>
            </div>

            {/* Info Container */}
            <div className="flex gap-3 items-start pr-6">
                {/* Channel Icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-600 overflow-hidden relative">
                    {channelThumbnailUrl && !channelThumbnailUrl.includes('youtube.com/@') ? (
                        <Image
                            src={channelThumbnailUrl.startsWith('http') ? channelThumbnailUrl : '/placeholder.jpg'}
                            alt={channelName}
                            fill
                            className="object-cover"
                            sizes="36px"
                            onError={(e) => {
                                // エラー時はプレースホルダーに差し替えるなどの処理が可能だが、
                                // Next.js Image の場合は state 管理が必要
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-gray-700">
                            {channelName.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 overflow-hidden">
                    <h3 className="font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                    <div className="text-sm text-[#AAAAAA] flex flex-col gap-0.5 mt-1">
                        <span className="hover:text-white transition-colors font-medium text-gray-300">
                            {channelName}
                        </span>
                        <div className="flex flex-col text-xs gap-0.5">
                            <div className="flex items-center gap-1">
                                <span>閲覧数：</span>
                                <span className="text-white font-medium">{formatViews(viewCount)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>記事作成日：</span>
                                <span>{formatDate(createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>動画公開日：</span>
                                <span>{publishedAt ? formatDate(publishedAt) : '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
