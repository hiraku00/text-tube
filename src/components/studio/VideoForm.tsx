'use client';

import { useState } from 'react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Eye, Edit3 } from 'lucide-react';

interface VideoFormProps {
    initialData?: {
        title: string;
        channel_name: string;
        thumbnail_url: string;
        original_url?: string;
        summary: string;
        detailed_script: string;
    };
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
}

export function VideoForm({ initialData, action, submitLabel }: VideoFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        channel_name: initialData?.channel_name || '',
        thumbnail_url: initialData?.thumbnail_url || '',
        original_url: initialData?.original_url || '',
        summary: initialData?.summary || '',
        detailed_script: initialData?.detailed_script || '',
    });

    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form action={action} className="flex flex-col gap-6 bg-card-bg p-8 rounded-xl border border-gray-800 shadow-xl">
            {/* Tabs for Edit/Preview */}
            <div className="flex border-b border-gray-800 mb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'edit'
                            ? 'text-tube-red border-b-2 border-tube-red'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Edit3 size={16} />
                    編集
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'preview'
                            ? 'text-tube-red border-b-2 border-tube-red'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Eye size={16} />
                    プレビュー
                </button>
            </div>

            {activeTab === 'edit' ? (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">動画タイトル</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                            placeholder="動画のタイトルを入力"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">チャンネル名</label>
                            <input
                                name="channel_name"
                                value={formData.channel_name}
                                onChange={handleChange}
                                required
                                className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                                placeholder="チャンネル名"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">YouTube URL / サムネイルURL</label>
                            <input
                                name="thumbnail_url"
                                value={formData.thumbnail_url}
                                onChange={handleChange}
                                className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                                placeholder="YouTubeのURLを入力するとサムネイルが自動取得されます"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">元動画URL（任意）</label>
                        <input
                            name="original_url"
                            value={formData.original_url}
                            onChange={handleChange}
                            className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">要約（概要）- Markdown対応</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all resize-none font-mono text-sm leading-relaxed"
                            placeholder="動画の短い要約を入力してください（Markdownを使用できます）"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">詳細スクリプト - Markdown対応</label>
                        <textarea
                            name="detailed_script"
                            value={formData.detailed_script}
                            onChange={handleChange}
                            required
                            rows={12}
                            className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all font-mono text-sm leading-relaxed"
                            placeholder="詳細なスクリプトやタイムスタンプ付きのメモを入力してください（Markdownを使用できます）"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8 py-4">
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                            要約プレビュー
                        </h3>
                        <div className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-800">
                            <MarkdownRenderer content={formData.summary || '*要約が入力されていません*'} />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                            詳細スクリプト プレビュー
                        </h3>
                        <div className="bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-800">
                            <MarkdownRenderer content={formData.detailed_script || '*スクリプトが入力されていません*'} />
                        </div>
                    </section>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-tube-red hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-red-900/20"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
