'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-white border-l-4 border-tube-red pl-4">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mt-6 mb-3 text-white border-l-4 border-tube-red pl-4">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-100">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-gray-300">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="ml-4">
                            {children}
                        </li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4 text-gray-400">
                            {children}
                        </blockquote>
                    ),
                    code: ({ className, children }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-blue-300">
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className={`${className} block bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm`}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
