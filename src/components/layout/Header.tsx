import Link from 'next/link';
import { Menu, Search, Upload, Bell, User } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-card-bg flex items-center justify-between px-4 z-50">
            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-hover-bg rounded-full">
                    <Menu className="w-6 h-6 text-white" />
                </button>
                <Link href="/" className="flex items-center gap-1">
                    <div className="w-8 h-6 bg-tube-red rounded-lg flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">TextTube</span>
                </Link>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-[600px] items-center ml-10">
                <div className="flex w-full">
                    <input
                        type="text"
                        placeholder="検索"
                        className="w-full bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-5 py-2 hover:bg-[#303030]">
                        <Search className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Link href="/studio">
                    <button className="p-2 hover:bg-hover-bg rounded-full" title="作成">
                        <Upload className="w-6 h-6 text-white" />
                    </button>
                </Link>
                <button className="p-2 hover:bg-hover-bg rounded-full hidden sm:block">
                    <Bell className="w-6 h-6 text-white" />
                </button>
                <button className="p-2 hover:bg-hover-bg rounded-full ml-1">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                        U
                    </div>
                </button>
            </div>
        </header>
    );
}
