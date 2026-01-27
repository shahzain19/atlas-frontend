/**
 * Auto-formats blog content by transforming "Keyword: Text" patterns into headers.
 */
export const formatBody = (text: string): string => {
    if (!text) return '';
    return text.split('\n').map(line => {
        // Match "Keyword: Some text" at the start of a line
        // We look for a prefix of 2-30 characters that doesn't start with Markdown markers (# or space)
        const match = line.match(/^([^#\s][^:]{1,30}):\s+(.*)$/);
        if (match) {
            // Convert to a small header (H3) and put the text on a new line
            return `### ${match[1]}\n${match[2]}`;
        }
        return line;
    }).join('\n');
};
