import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit, LogOut, Calendar, Clock, BarChart2, FileText, Activity } from 'lucide-react';
import { logout } from '@/app/actions';
import DeleteButton from '@/components/studio/DeleteButton';
import SearchInput from '@/components/studio/SearchInput';
import SortSelector from '@/components/studio/SortSelector';
import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const formatViews = (views?: number) => {
    if (views === undefined || views === null) return '0';
    const v = Math.max(0, views);
    if (v >= 10000) {
        return `${(v / 10000).toFixed(1)}万`;
    }
    return v.toLocaleString();
};

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
        return '-';
    }
};

const SORT_OPTIONS = [
    { label: '最新順（記事作成日）', value: 'created_at-desc' },
    { label: '人気順（閲覧数）', value: 'view_count-desc' },
    { label: '最新順（最終更新日）', value: 'updated_at-desc' },
    { label: '古い順', value: 'created_at-asc' },
];

export default async function StudioDashboard({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const q = params.q || '';
    const sort = params.sort || 'created_at-desc';
    const [sortCol, sortDir] = sort.split('-');

    const supabase = await createClient();

    let query = supabase
        .from('videos')
        .select('*')
        .order(sortCol as any, { ascending: sortDir === 'asc' });

    if (q) {
        query = query.or(`title.ilike.%${q}%,channel_name.ilike.%${q}%`);
    }

    const { data: videos } = await query;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 text-foreground min-h-screen">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-10">
                <div className="w-full xl:w-auto">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Studio デスク</h1>
                    <p className="text-gray-400 text-sm">動画の管理・要約の編集・統計確認が行えます</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:ml-auto justify-end">
                    <SearchInput placeholder="管理動画を検索..." />
                    <SortSelector options={SORT_OPTIONS} />
                    <Link
                        href="/studio/new"
                        className="flex items-center gap-2 bg-tube-red hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-red-900/20 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>動画を追加</span>
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all"
                            title="ログアウト"
                        >
                            <LogOut size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-[#161616] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#1A1A1A]">
                                <th className="p-5 font-bold text-[11px] text-gray-500 uppercase tracking-widest w-[40%]">動画 / コンテンツ</th>
                                <th className="p-5 font-bold text-[11px] text-gray-500 uppercase tracking-widest text-center">閲覧数</th>
                                <th className="p-5 font-bold text-[11px] text-gray-500 uppercase tracking-widest">テキスト量</th>
                                <th className="p-5 font-bold text-[11px] text-gray-500 uppercase tracking-widest">日付管理</th>
                                <th className="p-5 font-bold text-[11px] text-gray-500 uppercase tracking-widest text-left">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {videos?.map((video) => (
                                <tr key={video.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5">
                                        <div className="flex gap-4">
                                            <div className="relative w-36 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                                                {video.thumbnail_url && (
                                                    <Image
                                                        src={getThumbnailUrl(video.thumbnail_url)}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1.5 py-0.5 rounded font-bold text-white">
                                                    {video.duration || '--:--'}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between min-w-0 py-0.5">
                                                <div>
                                                    <Link
                                                        href={`/watch/${video.id}`}
                                                        className="font-bold text-white line-clamp-1 hover:text-tube-red transition-colors text-[15px]"
                                                    >
                                                        {video.title}
                                                    </Link>
                                                    <p className="text-xs text-gray-400 line-clamp-1 mt-1 leading-relaxed opacity-60">
                                                        {video.summary}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden relative border border-gray-800 flex-shrink-0">
                                                        {video.channel_thumbnail_url && video.channel_thumbnail_url.startsWith('http') ? (
                                                            <Image src={video.channel_thumbnail_url} alt="" fill className="object-cover" sizes="20px" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 uppercase font-black">
                                                                {video.channel_name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-400 truncate">
                                                        {video.channel_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1.5 text-gray-200">
                                                <BarChart2 size={14} className="text-tube-red" />
                                                <span className="font-bold text-sm tracking-tight">{formatViews(video.view_count)}</span>
                                            </div>
                                            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest opacity-60">Total Views</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1 items-start">
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <FileText size={14} className={sortCol === 'detailed_script' ? 'text-tube-red' : 'text-gray-500'} />
                                                <span className={`text-xs font-bold ${sortCol === 'detailed_script' ? 'text-white' : 'text-gray-200'}`}>
                                                    {(video.summary?.length || 0).toLocaleString()}文字
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={11} className="text-green-500/60" />
                                                <span className="text-[10px] text-green-500/70 font-bold uppercase tracking-tighter">
                                                    要約の長さ
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter w-20 text-center">動画公開日</span>
                                                <span className={`text-xs font-bold ${sortCol === 'published_at' ? 'text-white' : 'text-gray-400'}`}>
                                                    {formatDate(video.published_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] bg-tube-red/10 text-tube-red/80 border border-tube-red/20 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter w-20 text-center">記事作成日</span>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className={`text-[10px] font-bold ${sortCol === 'created_at' ? 'text-white' : 'text-gray-300'}`}>
                                                        {formatDate(video.created_at)}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                                        <Activity size={12} className="text-tube-red/70" />
                                                        <span>最終更新: {formatDate(video.updated_at || video.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-start gap-2">
                                            <Link
                                                href={`/studio/edit/${video.id}`}
                                                className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                                                title="詳細・編集"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteButton id={video.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!videos || videos.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center">
                                                <Plus size={32} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 font-bold text-lg">動画が見つかりません</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {q ? `"${q}" に一致する動画はありません。` : '動画をまだ登録していません。'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
