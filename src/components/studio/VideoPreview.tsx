'use client';

import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface VideoPreviewProps {
    summary: string;
    detailed_script: string;
}

export function VideoPreview({ summary, detailed_script }: VideoPreviewProps) {
    return (
        <div className="flex flex-col gap-8 py-4">
            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                    要約プレビュー
                </h3>
                <div className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-800">
                    <MarkdownRenderer content={summary || '*要約が入力されていません*'} />
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                    詳細スクリプト プレビュー
                </h3>
                <div className="bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-800">
                    <MarkdownRenderer content={detailed_script || '*スクリプトが入力されていません*'} />
                </div>
            </section>
        </div>
    );
}
