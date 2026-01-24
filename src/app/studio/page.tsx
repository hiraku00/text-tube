import { createVideo } from '@/app/actions';

export default function StudioPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 text-foreground">
            <h1 className="text-2xl font-bold mb-6">要約を作成（スタジオ）</h1>

            <form action={createVideo} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">動画タイトル</label>
                    <input
                        name="title"
                        required
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="動画のタイトルを入力"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">チャンネル名</label>
                    <input
                        name="channel_name"
                        required
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="チャンネル名"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">サムネイルURL（任意）</label>
                    <input
                        name="thumbnail_url"
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">元動画URL（任意）</label>
                    <input
                        name="original_url"
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">要約（概要）</label>
                    <textarea
                        name="summary"
                        required
                        rows={4}
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                        placeholder="動画の短い要約を入力してください"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">詳細スクリプト</label>
                    <textarea
                        name="detailed_script"
                        required
                        rows={15}
                        className="bg-card-bg border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm leading-relaxed"
                        placeholder="詳細なスクリプトやタイムスタンプ付きのメモを入力してください"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-tube-red hover:bg-red-600 text-white font-medium px-6 py-2 rounded transition-colors"
                    >
                        保存して公開
                    </button>
                </div>
            </form>
        </div>
    );
}
