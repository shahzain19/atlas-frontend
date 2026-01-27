/**
 * Auto-formats blog content by transforming "Keyword: Text" patterns into headers.
 */
/**
 * Intelligently splits a long string into paragraphs at sentence boundaries.
 */
const splitMassiveBlock = (text: string, maxChars = 450): string => {
    if (text.length <= maxChars) return text;

    // Find a good split point near the cap (sentence end)
    let splitIndex = -1;
    const possibleSuffixes = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];

    // Look for the last sentence end before the limit
    for (const suffix of possibleSuffixes) {
        const index = text.lastIndexOf(suffix, maxChars);
        if (index > splitIndex) splitIndex = index + suffix.trim().length;
    }

    // If no sentence end found, try to split at a space
    if (splitIndex === -1) {
        splitIndex = text.lastIndexOf(' ', maxChars);
    }

    // If still no split point, just force split
    if (splitIndex === -1 || splitIndex < 100) {
        splitIndex = maxChars;
    }

    const firstPart = text.substring(0, splitIndex).trim();
    const rest = text.substring(splitIndex).trim();

    if (!rest) return firstPart;
    return firstPart + '\n\n' + splitMassiveBlock(rest, maxChars);
};

export const formatBody = (text: string): string => {
    if (!text) return '';

    // Step 1: Normalize newlines (convert simple newlines to double if they look like paragraphs)
    let processed = text.replace(/([^\n])\n([^\n])/g, (_, p1, p2) => {
        if (p1.length < 60) return `${p1}\n${p2}`;
        return `${p1}\n\n${p2}`;
    });

    // Step 2: Process blocks
    return processed.split('\n\n').map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';

        // Match "Keyword: Some text" headers
        const headerMatch = trimmed.match(/^([^#\s][^:]{1,40}):\s+([\s\S]*)$/);
        if (headerMatch) {
            return `### ${headerMatch[1]}\n\n${splitMassiveBlock(headerMatch[2])}`;
        }

        return splitMassiveBlock(trimmed);
    }).join('\n\n');
};
