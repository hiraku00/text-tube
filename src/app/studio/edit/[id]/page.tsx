import { updateVideo } from '@/app/actions';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoForm } from '@/components/studio/VideoForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: video, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !video) {
        notFound();
    }

    const updateVideoWithId = updateVideo.bind(null, id);

    return (
        <div className="max-w-4xl mx-auto p-6 text-foreground">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/studio" className="p-2 hover:bg-hover-bg rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">要約を編集</h1>
            </div>

            <VideoForm
                initialData={{
                    title: video.title,
                    channel_name: video.channel_name,
                    thumbnail_url: video.thumbnail_url,
                    original_url: video.original_url || '',
                    summary: video.summary,
                    detailed_script: video.detailed_script,
                    published_at: video.published_at,
                    view_count: video.view_count,
                    channel_thumbnail_url: video.channel_thumbnail_url,
                    duration: video.duration,
                }}
                action={updateVideoWithId}
                submitLabel="更新する"
            />
        </div>
    );
}
