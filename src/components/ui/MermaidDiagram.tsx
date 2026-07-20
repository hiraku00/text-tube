'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
    chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function renderDiagram() {
            try {
                const { default: mermaid } = await import('mermaid');
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'strict',
                    theme: 'dark',
                });

                const id = `mermaid-${crypto.randomUUID()}`;
                const { svg } = await mermaid.render(id, chart);

                if (!cancelled && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    setError(false);
                }
            } catch (renderError) {
                console.error('Failed to render Mermaid diagram:', renderError);
                if (!cancelled) setError(true);
            }
        }

        renderDiagram();

        return () => {
            cancelled = true;
        };
    }, [chart]);

    if (error) {
        return (
            <pre className="my-6 overflow-x-auto rounded-lg border border-red-900/50 bg-gray-900 p-4 text-sm text-red-300">
                <code>{chart}</code>
            </pre>
        );
    }

    return (
        <div
            ref={containerRef}
            className="my-6 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50 p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
            aria-label="Mermaid diagram"
        />
    );
}
