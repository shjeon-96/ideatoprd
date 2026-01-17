/**
 * Parse AI SDK UIMessageStream responses
 *
 * UIMessageStream format:
 * - Text chunks: 0:"text content"
 * - Data messages: 8:[{...data...}]
 * - Message annotations: e:{...annotation...}
 */

export interface StreamMessage {
  type: 'text' | 'data' | 'error';
  content?: string;
  data?: Record<string, unknown>;
}

export interface PRDSaveResult {
  type: 'prd_saved' | 'prd_save_failed' | 'credits_refunded';
  prdId?: string;
  status?: 'success' | 'error';
  message?: string;
  amount?: number;
}

/**
 * Parse a single line from the UIMessageStream or raw text stream
 */
function parseStreamLine(line: string): StreamMessage | null {
  if (!line || line.trim() === '') return null;

  // Text chunk format: 0:"content"
  if (line.startsWith('0:')) {
    try {
      const content = JSON.parse(line.slice(2));
      return { type: 'text', content };
    } catch {
      // If JSON parse fails, treat as raw text
      return { type: 'text', content: line.slice(2) };
    }
  }

  // Data message format: 8:[{...}] or 2:[{...}]
  if (line.startsWith('8:') || line.startsWith('2:')) {
    try {
      const data = JSON.parse(line.slice(2));
      if (Array.isArray(data) && data.length > 0) {
        return { type: 'data', data: data[0] };
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  // Message annotation format: e:{...}
  if (line.startsWith('e:')) {
    try {
      const data = JSON.parse(line.slice(2));
      return { type: 'data', data };
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  // Error format: 3:"error message"
  if (line.startsWith('3:')) {
    try {
      const content = JSON.parse(line.slice(2));
      return { type: 'error', content };
    } catch {
      return { type: 'error', content: line.slice(2) };
    }
  }

  // Fallback: treat as raw text (for toTextStreamResponse)
  // This handles plain text streams without UIMessageStream formatting
  return { type: 'text', content: line };
}

/**
 * Detect if the stream is UIMessageStream format or raw text
 * UIMessageStream lines start with number/letter followed by colon (0:, 8:, e:, 3:, etc.)
 */
function isUIMessageStreamFormat(chunk: string): boolean {
  return /^[0-9a-f]:/.test(chunk);
}

/**
 * Process streaming response from UIMessageStream or raw text stream
 */
export async function processUIMessageStream(
  response: Response,
  onText: (text: string) => void,
  onData?: (data: PRDSaveResult) => void,
  onError?: (error: string) => void
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let isRawTextStream: boolean | null = null; // null = not yet determined

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    // Auto-detect stream format on first chunk
    if (isRawTextStream === null) {
      isRawTextStream = !isUIMessageStreamFormat(chunk.trim());
    }

    // For raw text streams, pass chunks directly to onText
    if (isRawTextStream) {
      onText(chunk);
      continue;
    }

    // For UIMessageStream, process line by line
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      const message = parseStreamLine(line);
      if (!message) continue;

      switch (message.type) {
        case 'text':
          if (message.content) {
            onText(message.content);
          }
          break;
        case 'data':
          if (message.data && onData) {
            onData(message.data as unknown as PRDSaveResult);
          }
          break;
        case 'error':
          if (message.content && onError) {
            onError(message.content);
          }
          break;
      }
    }
  }

  // Process remaining buffer (only for UIMessageStream)
  if (!isRawTextStream && buffer) {
    const message = parseStreamLine(buffer);
    if (message?.type === 'text' && message.content) {
      onText(message.content);
    } else if (message?.type === 'data' && message.data && onData) {
      onData(message.data as unknown as PRDSaveResult);
    }
  }
}
