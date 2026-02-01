'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Eye, Edit3 } from 'lucide-react';
import { getThumbnailUrl } from '@/lib/youtube';
import { createClient } from '@/lib/supabase/client';

interface VideoFormProps {
    initialData?: {
        title: string;
        channel_name: string;
        thumbnail_url: string;
        original_url?: string;
        summary: string;
        detailed_script: string;
        published_at?: string;
        view_count?: number;
        channel_thumbnail_url?: string;
        duration?: string;
    };
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
}

export function VideoForm({ initialData, action, submitLabel }: VideoFormProps) {
    // Parse duration (HH:MM:SS or MM:SS)
    const parseDuration = (d?: string) => {
        if (!d) return { hh: '00', mm: '00', ss: '00' };
        const parts = d.split(':').map(p => p.padStart(2, '0'));
        if (parts.length === 3) return { hh: parts[0], mm: parts[1], ss: parts[2] };
        if (parts.length === 2) return { hh: '00', mm: parts[0], ss: parts[1] };
        return { hh: '00', mm: '00', ss: parts[0] };
    };

    const initialDuration = parseDuration(initialData?.duration);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        channel_name: initialData?.channel_name || '',
        thumbnail_url: initialData?.thumbnail_url || '',
        original_url: initialData?.original_url || '',
        summary: initialData?.summary || '',
        detailed_script: initialData?.detailed_script || '',
        published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : '',
        view_count: initialData?.view_count?.toString() || '',
        channel_thumbnail_url: initialData?.channel_thumbnail_url || '',
        duration_hh: initialDuration.hh,
        duration_mm: initialDuration.mm,
        duration_ss: initialDuration.ss,
    });

    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const supabase = createClient();

    // チャンネル名からアイコンURLを自動補完
    useEffect(() => {
        const fetchChannelIcon = async () => {
            if (!formData.channel_name) return;

            const { data } = await supabase
                .from('videos')
                .select('channel_thumbnail_url')
                .eq('channel_name', formData.channel_name)
                .not('channel_thumbnail_url', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data?.channel_thumbnail_url) {
                setFormData(prev => ({ ...prev, channel_thumbnail_url: data.channel_thumbnail_url }));
            }
        };

        const timer = setTimeout(fetchChannelIcon, 500);
        return () => clearTimeout(timer);
    }, [formData.channel_name, supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 数字のみを許可する入力制御
    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const onlyNums = value.replace(/[^0-9]/g, '').slice(0, 2);
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
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

            <div className={activeTab === 'edit' ? 'flex flex-col gap-6' : 'hidden'}>
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

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">YouTube動画URL (元動画)</label>
                    <input
                        name="original_url"
                        value={formData.original_url}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                                const newData = { ...prev, original_url: val };
                                const extracted = getThumbnailUrl(val);
                                if (extracted && extracted.includes('img.youtube.com')) {
                                    return { ...newData, thumbnail_url: extracted };
                                }
                                return newData;
                            });
                        }}
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">チャンネル名</label>
                    <input
                        name="channel_name"
                        value={formData.channel_name}
                        onChange={handleChange}
                        required
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="チャンネル名を入力（自動補完されます）"
                    />
                </div>

                <details className="group border border-gray-800 rounded-lg bg-white/5">
                    <summary className="list-none cursor-pointer p-4 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between group-open:border-b group-open:border-gray-800">
                        🔗 高度な設定（画像URL・自動抽出項目）
                        <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <div className="p-4 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">サムネイル画像URL</label>
                            <input
                                name="thumbnail_url"
                                value={formData.thumbnail_url}
                                onChange={handleChange}
                                className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                                placeholder="自動取得されます"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">チャンネル画像URL</label>
                            <input
                                name="channel_thumbnail_url"
                                value={formData.channel_thumbnail_url}
                                onChange={handleChange}
                                className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                                placeholder="自動取得されます"
                            />
                            <p className="text-[10px] text-gray-500 mt-1 italic leading-tight">
                                ※既知のチャンネル名を入力すると過去のデータから自動補完されます。
                                <span className="text-yellow-600 font-bold block mt-0.5">※初めて登録するチャンネルの場合は、一度だけ手動でチャンネル画像URLを入力してください。</span>
                            </p>
                        </div>
                    </div>
                </details>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">動画公開日 (YouTube上の日付)</label>
                        <input
                            type="date"
                            name="published_at"
                            value={formData.published_at}
                            onChange={handleChange}
                            max="9999-12-31"
                            className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">動画の長さ (HH:MM:SS)</label>
                        <div className="flex items-center gap-2">
                            <input
                                name="duration_hh"
                                value={formData.duration_hh}
                                onChange={handleDurationChange}
                                className="w-16 bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white text-center focus:outline-none focus:border-tube-red transition-all"
                                placeholder="00"
                            />
                            <span className="text-gray-500">:</span>
                            <input
                                name="duration_mm"
                                value={formData.duration_mm}
                                onChange={handleDurationChange}
                                className="w-16 bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white text-center focus:outline-none focus:border-tube-red transition-all"
                                placeholder="00"
                            />
                            <span className="text-gray-500">:</span>
                            <input
                                name="duration_ss"
                                value={formData.duration_ss}
                                onChange={handleDurationChange}
                                className="w-16 bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white text-center focus:outline-none focus:border-tube-red transition-all"
                                placeholder="00"
                            />
                        </div>
                        <input
                            type="hidden"
                            name="duration"
                            value={`${formData.duration_hh}:${formData.duration_mm}:${formData.duration_ss}`}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">既読数 (現在のカウント)</label>
                    <input
                        type="number"
                        name="view_count"
                        value={formData.view_count}
                        onChange={handleChange}
                        className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        placeholder="0"
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

            {activeTab === 'preview' && (
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
