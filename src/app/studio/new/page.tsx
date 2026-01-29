import { createVideo } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VideoForm } from '@/components/studio/VideoForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewVideoPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 text-foreground">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/studio" className="p-2 hover:bg-hover-bg rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">要約を新規作成</h1>
            </div>

            <VideoForm
                action={createVideo}
                submitLabel="保存して公開"
            />
        </div>
    );
}
