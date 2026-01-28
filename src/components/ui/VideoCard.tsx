import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { getThumbnailUrl } from '@/lib/youtube';

interface VideoCardProps {
    id: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    summary: string;
    duration?: string;
    createdAt: string;
}

export function VideoCard({
    id,
    title,
    channelName,
    thumbnailUrl,
    summary,
    duration = "10:00",
    createdAt
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
                {/* Channel Icon (Mock) */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-600" />

                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                    <div className="text-sm text-[#AAAAAA] flex flex-col">
                        <span className="hover:text-white transition-colors">{channelName}</span>
                        <div className="flex items-center">
                            <span>{new Date(createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p className="text-xs text-[#AAAAAA] line-clamp-2 mt-1">
                        {summary}
                    </p>
                </div>
            </div>
        </Link>
    );
}
