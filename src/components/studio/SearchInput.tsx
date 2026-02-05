'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

interface SearchInputProps {
    baseUrl?: string;
    placeholder?: string;
}

export default function SearchInput({ baseUrl = '/studio', placeholder = '検索...' }: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get('q') || '');

    const handleSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.push(`${baseUrl}?${params.toString()}`);
    }, [router, searchParams, baseUrl]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value !== (searchParams.get('q') || '')) {
                handleSearch(value);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [value, handleSearch, searchParams]);

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2.5 bg-[#0F0F0F] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tube-red focus:ring-1 focus:ring-tube-red transition-all"
            />
            {value && (
                <button
                    onClick={() => {
                        setValue('');
                        handleSearch('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-white text-gray-500 transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}
