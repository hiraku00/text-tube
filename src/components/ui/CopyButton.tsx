'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    content: string;
}

export function CopyButton({ content }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            aria-label="スクリプトをコピー"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">コピーしました</span>
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">スクリプトをコピー</span>
                </>
            )}
        </button>
    );
}
