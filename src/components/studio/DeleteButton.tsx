'use client';

import { deleteVideo } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm('本当にこの動画を削除しますか？')) return;

        setIsDeleting(true);
        try {
            const result = await deleteVideo(id);
            if (result?.success) {
                router.refresh();
            }
        } catch (e) {
            alert('削除に失敗しました。');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="削除"
        >
            <Trash2 size={20} />
        </button>
    );
}
