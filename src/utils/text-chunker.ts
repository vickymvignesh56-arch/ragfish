export interface TextChunk {
  index: number;
  text: string;
}

export function chunkText(
  text: string,
  chunkSize: number,
  overlap: number,
): TextChunk[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(" ");
    if (chunk.trim()) {
      chunks.push({ index, text: chunk });
      index++;
    }
    if (end === words.length) {
      break;
    }
    start = end - overlap;
  }
  return chunks;
}
