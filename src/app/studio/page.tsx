import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit, LogOut } from 'lucide-react';
import { logout } from '@/app/actions';
import DeleteButton from '@/components/studio/DeleteButton';
import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudioDashboard() {
    const supabase = await createClient();
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto p-6 text-foreground">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Studio デスク</h1>
                    <p className="text-gray-400">動画の作成、編集、削除が行えます</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/studio/new"
                        className="flex items-center gap-2 bg-tube-red hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-red-900/20"
                    >
                        <Plus size={20} />
                        <span>新規作成</span>
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
                        >
                            <LogOut size={20} />
                            <span>ログアウト</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-card-bg rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#161616]">
                                <th className="p-4 font-medium text-gray-400">動画</th>
                                <th className="p-4 font-medium text-gray-400 w-48">チャンネル</th>
                                <th className="p-4 font-medium text-gray-400 w-32">作成日</th>
                                <th className="p-4 font-medium text-gray-400 w-32 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos?.map((video) => (
                                <tr key={video.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 aspect-video rounded overflow-hidden flex-shrink-0 bg-gray-800">
                                                {video.thumbnail_url && (
                                                    <Image
                                                        src={getThumbnailUrl(video.thumbnail_url)}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white uppercase line-clamp-1 group-hover:line-clamp-none transition-all">
                                                    {video.title}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {video.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        <span className="truncate block max-w-[150px]">{video.channel_name}</span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                                        {new Date(video.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/studio/edit/${video.id}`}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors inline-block"
                                                title="編集"
                                            >
                                                <Edit size={20} />
                                            </Link>
                                            <DeleteButton id={video.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!videos || videos.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        動画がまだありません。「新規作成」から追加してください。
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
