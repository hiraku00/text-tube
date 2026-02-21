'use client';

import { useState, useEffect } from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { VideoFormFields } from './VideoFormFields';
import { VideoPreview } from './VideoPreview';

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

            <div className={activeTab === 'edit' ? 'block' : 'hidden'}>
                <VideoFormFields
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={handleChange}
                    handleDurationChange={handleDurationChange}
                />
            </div>
            {activeTab === 'preview' && (
                <VideoPreview
                    summary={formData.summary}
                    detailed_script={formData.detailed_script}
                />
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-tube-red hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-red-900/20"
                >
                    {submitLabel}
                </button>
            </div>
        </form >
    );
}
