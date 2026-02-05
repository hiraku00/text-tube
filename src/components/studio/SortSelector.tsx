'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortSelectorProps {
    options: { label: string; value: string }[];
    baseUrl?: string;
}

export default function SortSelector({ options, baseUrl = '/studio' }: SortSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || options[0].value;

    const handleSort = useCallback((sort: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        router.push(`${baseUrl}?${params.toString()}`);
    }, [router, searchParams, baseUrl]);

    return (
        <div className="relative inline-block text-left min-w-[140px]">
            <select
                value={currentSort}
                onChange={(e) => handleSort(e.target.value)}
                className="block w-full appearance-none bg-[#0F0F0F] border border-gray-800 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-300 font-bold focus:outline-none focus:border-tube-red transition-all cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
            </div>
        </div>
    );
}
