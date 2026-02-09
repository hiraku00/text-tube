'use client';

import { Edit3, Layout, Clock, FileText, Info } from 'lucide-react';
import { getThumbnailUrl } from '@/lib/youtube';

interface DurationFieldsProps {
    formData: any;
    handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DurationFields({ formData, handleDurationChange }: DurationFieldsProps) {
    return (
        <div className="bg-white/[0.01] p-6 rounded-2xl border border-gray-800/30">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4 opacity-80">
                <Clock size={14} className="text-green-500" />
                動画の長さ
            </label>
            <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                    <input
                        name="duration_hh"
                        value={formData.duration_hh}
                        onChange={handleDurationChange}
                        maxLength={2}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-lg py-2 w-12 text-white text-center focus:outline-none focus:border-green-500/50 transition-all font-mono placeholder-gray-800 text-sm"
                        placeholder="00"
                    />
                    <span className="text-[9px] text-gray-600 font-black uppercase text-center tracking-tighter">Hr</span>
                </div>
                <span className="text-gray-700 font-bold mb-4">:</span>
                <div className="flex flex-col gap-1">
                    <input
                        name="duration_mm"
                        value={formData.duration_mm}
                        onChange={handleDurationChange}
                        maxLength={2}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-lg py-2 w-12 text-white text-center focus:outline-none focus:border-green-500/50 transition-all font-mono placeholder-gray-800 text-sm"
                        placeholder="00"
                    />
                    <span className="text-[9px] text-gray-600 font-black uppercase text-center tracking-tighter">Min</span>
                </div>
                <span className="text-gray-700 font-bold mb-4">:</span>
                <div className="flex flex-col gap-1">
                    <input
                        name="duration_ss"
                        value={formData.duration_ss}
                        onChange={handleDurationChange}
                        maxLength={2}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-lg py-2 w-12 text-white text-center focus:outline-none focus:border-green-500/50 transition-all font-mono placeholder-gray-800 text-sm"
                        placeholder="00"
                    />
                    <span className="text-[9px] text-gray-600 font-black uppercase text-center tracking-tighter">Sec</span>
                </div>
            </div>
            <input
                type="hidden"
                name="duration"
                value={`${formData.duration_hh}:${formData.duration_mm}:${formData.duration_ss}`}
            />
        </div>
    );
}

interface FormSectionProps {
    title: string;
    iconColor: string;
    children: React.ReactNode;
}

function FormSection({ title, iconColor, children }: FormSectionProps) {
    return (
        <div className="flex flex-col gap-6 bg-white/[0.02] p-6 rounded-2xl border border-gray-800/50 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-6 ${iconColor} rounded-full`} />
                <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
}

interface VideoFormFieldsProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function VideoFormFields({ formData, setFormData, handleChange, handleDurationChange }: VideoFormFieldsProps) {
    return (
        <div className="flex flex-col gap-10">
            {/* Section: 基本情報 */}
            <FormSection title="動画の基本情報" iconColor="bg-tube-red">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 leading-none">
                        <Edit3 size={14} className="text-tube-red" />
                        動画タイトル
                    </label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-tube-red focus:ring-1 focus:ring-tube-red transition-all shadow-lg placeholder:text-gray-700"
                        placeholder="動画の魅力的なタイトルを入力"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 leading-none">
                        <Layout size={14} className="text-tube-red" />
                        動画URL
                    </label>
                    <input
                        name="original_url"
                        value={formData.original_url}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev: any) => {
                                const newData = { ...prev, original_url: val };
                                const extracted = getThumbnailUrl(val);
                                if (extracted && extracted.includes('img.youtube.com')) {
                                    return { ...newData, thumbnail_url: extracted };
                                }
                                return newData;
                            });
                        }}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-tube-red focus:ring-1 focus:ring-tube-red transition-all shadow-lg placeholder:text-gray-700"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
            </FormSection>

            {/* Section: チャンネル情報 */}
            <FormSection title="チャンネル情報" iconColor="bg-blue-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">チャンネル名</label>
                        <input
                            name="channel_name"
                            value={formData.channel_name}
                            onChange={handleChange}
                            required
                            className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-tube-red focus:ring-1 focus:ring-tube-red transition-all shadow-lg placeholder:text-gray-700"
                            placeholder="例: Lex Fridman Podcast"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-0.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">チャンネル画像URL</label>
                        </div>
                        <div className="relative">
                            <input
                                name="channel_thumbnail_url"
                                value={formData.channel_thumbnail_url}
                                onChange={handleChange}
                                className={`w-full bg-[#0A0A0A] border ${!formData.channel_thumbnail_url && formData.channel_name ? 'border-yellow-700 pb-12' : 'border-gray-800'} rounded-xl p-4 text-white focus:outline-none focus:border-tube-red focus:ring-1 focus:ring-tube-red transition-all shadow-lg placeholder:text-gray-700`}
                                placeholder="https://..."
                            />
                            {formData.channel_thumbnail_url && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border border-gray-700 shadow-xl">
                                    <img src={formData.channel_thumbnail_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {!formData.channel_thumbnail_url && formData.channel_name && (
                                <div className="absolute left-0 bottom-0 right-0 bg-yellow-950/40 border-t border-yellow-700/50 p-2 rounded-b-xl backdrop-blur-md">
                                    <p className="text-[10px] text-yellow-500 font-black flex items-center justify-center gap-1.5 animate-pulse uppercase tracking-tighter">
                                        ⚠️ 初回登録: チャンネル画像URLを手動入力してください
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FormSection>

            {/* Section: コンテンツ */}
            <FormSection title="コンテンツ詳細" iconColor="bg-green-500">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FileText size={14} className="text-green-500" />
                            要約（概要）- Markdown対応
                        </span>
                        <span className="text-[10px] text-gray-600 font-normal normal-case italic">※YouTubeの概要欄や要約文を入力</span>
                    </label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-tube-red transition-all resize-none font-mono text-[13px] leading-relaxed shadow-lg"
                        placeholder="# 要約のタイトル\n\n- キーポイント1\n- キーポイント2"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FileText size={14} className="text-green-500" />
                            詳細スクリプト - Markdown対応
                        </span>
                        <span className="text-[10px] text-gray-600 font-normal normal-case italic">※動画の内容、解説、フルテキストを入力</span>
                    </label>
                    <textarea
                        name="detailed_script"
                        value={formData.detailed_script}
                        onChange={handleChange}
                        required
                        rows={12}
                        className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-tube-red transition-all font-mono text-[13px] leading-relaxed shadow-lg"
                        placeholder="## セクション名\n\nここに詳細な解説や対話形式のテキストを入力します。"
                    />
                </div>
            </FormSection>

            {/* Section: メタデータ & 設定 */}
            <div className="flex flex-col gap-8">
                <DurationFields formData={formData} handleDurationChange={handleDurationChange} />

                <details className="group border border-gray-800/50 rounded-2xl bg-white/[0.01] overflow-hidden transition-all">
                    <summary className="list-none cursor-pointer p-6 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between group-open:bg-white/[0.02]">
                        <span className="flex items-center gap-2">
                            <Info size={14} className="text-gray-400" />
                            高度な設定（メタデータ）
                        </span>
                        <span className="transition-transform group-open:rotate-180 opacity-50">▼</span>
                    </summary>
                    <div className="p-6 border-t border-gray-800/50 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">動画サムネイル画像URL</label>
                            <input
                                name="thumbnail_url"
                                value={formData.thumbnail_url}
                                onChange={handleChange}
                                className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-tube-red text-sm"
                                placeholder="自動抽出されます"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">動画公開日</label>
                                <input
                                    type="date"
                                    name="published_at"
                                    value={formData.published_at}
                                    onChange={handleChange}
                                    max="9999-12-31"
                                    className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-tube-red text-sm font-mono"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">閲覧数設定</label>
                                <input
                                    type="number"
                                    name="view_count"
                                    value={formData.view_count}
                                    onChange={handleChange}
                                    className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-tube-red text-sm font-mono"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
