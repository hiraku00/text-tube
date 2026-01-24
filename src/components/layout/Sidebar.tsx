import Link from 'next/link';
import { Home, Library, History, Clock, ThumbsUp } from 'lucide-react';

const MENU_ITEMS = [
    { icon: Home, label: 'ホーム', href: '/' },
    { icon: Library, label: 'ライブラリ', href: '/library' },
    { icon: History, label: '履歴', href: '/history' },
    { icon: Clock, label: '後で見る', href: '/playlist?list=WL' },
    { icon: ThumbsUp, label: '高く評価した動画', href: '/playlist?list=LL' },
];

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-14 bottom-0 w-[72px] md:w-60 bg-background hover:overflow-y-auto hidden sm:flex flex-col py-3 z-40">
            <div className="flex flex-col gap-1 px-1 md:px-3">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col md:flex-row items-center md:gap-5 px-1 py-4 md:py-2 md:px-3 rounded-lg hover:bg-hover-bg transition-colors"
                    >
                        <item.icon className="w-6 h-6 mb-1 md:mb-0" strokeWidth={1.5} />
                        <span className="text-[10px] md:text-sm truncate w-full text-center md:text-left">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>

            <div className="hidden md:block my-3 border-t border-gray-700 mx-3" />

            <div className="hidden md:block px-6 py-2">
                <p className="text-sm font-medium mb-2">登録チャンネル</p>
                <p className="text-xs text-gray-400">ログインすると表示されます</p>
            </div>
        </aside>
    );
}
