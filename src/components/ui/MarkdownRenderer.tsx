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
                        <ul className="list-disc list-outside mb-4 ml-6 space-y-2 text-gray-300">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-outside mb-4 ml-6 space-y-2 text-gray-300">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="pl-1">
                            {children}
                        </li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-700 pl-4 italic my-6 text-gray-300 bg-white/5 py-4 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-8">
                            <table className="w-full border-collapse border border-gray-700 text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-800 text-white">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-700 px-4 py-2 text-left font-bold">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                            {children}
                        </td>
                    ),
                    hr: () => (
                        <hr className="my-10 border-gray-800" />
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
                            <code className={`${className} block bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm border border-gray-800`}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
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
