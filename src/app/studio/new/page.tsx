import { createVideo } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewVideoPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 text-foreground">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/studio" className="p-2 hover:bg-hover-bg rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">要約を新規作成</h1>
            </div>

            <form action={createVideo} className="flex flex-col gap-6 bg-card-bg p-8 rounded-xl border border-gray-800 shadow-xl">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">動画タイトル</label>
                    <input
                        name="title"
                        required
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="動画のタイトルを入力"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">チャンネル名</label>
                    <input
                        name="channel_name"
                        required
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="チャンネル名"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">YouTube URL / サムネイルURL</label>
                    <input
                        name="thumbnail_url"
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="YouTubeのURLを入力するとサムネイルが自動取得されます"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">元動画URL（任意）</label>
                    <input
                        name="original_url"
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">要約（概要）</label>
                    <textarea
                        name="summary"
                        required
                        rows={4}
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all resize-none"
                        placeholder="動画の短い要約を入力してください"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">詳細スクリプト</label>
                    <textarea
                        name="detailed_script"
                        required
                        rows={12}
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all font-mono text-sm leading-relaxed"
                        placeholder="詳細なスクリプトやタイムスタンプ付きのメモを入力してください"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-tube-red hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-red-900/20"
                    >
                        保存して公開
                    </button>
                </div>
            </form>
        </div>
    );
}
