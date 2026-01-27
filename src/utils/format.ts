/**
 * Auto-formats blog content by transforming "Keyword: Text" patterns into headers.
 */
export const formatBody = (text: string): string => {
    if (!text) return '';

    // Step 1: Normalize newlines (convert single newlines to double if they look like paragraphs)
    // But preserve single newlines for lists or short lines
    let processed = text.replace(/([^\n])\n([^\n])/g, (_, p1, p2) => {
        // If the line is short (under 60 chars), keep single newline (likely a list or poem)
        if (p1.length < 60) return `${p1}\n${p2}`;
        return `${p1}\n\n${p2}`;
    });

    // Step 2: Handle "Keyword: " headers and split very long paragraphs
    return processed.split('\n\n').map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';

        // Match "Keyword: Some text" headers
        const headerMatch = trimmed.match(/^([^#\s][^:]{1,40}):\s+([\s\S]*)$/);
        if (headerMatch) {
            return `### ${headerMatch[1]}\n\n${headerMatch[2]}`;
        }

        // Split exceptionally long blocks (> 500 chars) that have no internal spacing
        if (trimmed.length > 500) {
            // Find a sentence end (.) followed by space near the middle
            const midpoint = Math.floor(trimmed.length / 2);
            const nextDot = trimmed.indexOf('. ', midpoint);
            if (nextDot !== -1 && nextDot < trimmed.length - 100) {
                return trimmed.substring(0, nextDot + 1) + '\n\n' + trimmed.substring(nextDot + 2);
            }
        }

        return trimmed;
    }).join('\n\n');
};
