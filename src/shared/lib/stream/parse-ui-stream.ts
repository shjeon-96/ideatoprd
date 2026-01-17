/**
 * Parse AI SDK UIMessageStream responses
 *
 * Supports multiple formats:
 * 1. Legacy UIMessageStream: 0:"text", 8:[{...}], e:{...}
 * 2. SSE format (AI SDK v6+): data: {"type":"text-delta","delta":"..."}
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
 * Parse SSE format line (AI SDK v6+)
 * Format: data: {"type":"text-delta","id":"0","delta":"text content"}
 */
function parseSSELine(line: string): StreamMessage | null {
  if (!line.startsWith('data:')) return null;

  const jsonStr = line.slice(5).trim();
  if (!jsonStr || jsonStr === '[DONE]') return null;

  try {
    const parsed = JSON.parse(jsonStr);

    // Handle text-delta messages
    if (parsed.type === 'text-delta' && parsed.delta !== undefined) {
      return { type: 'text', content: parsed.delta };
    }

    // Handle data messages (for PRD save results, etc.)
    if (parsed.type === 'data' && parsed.data) {
      return { type: 'data', data: parsed.data };
    }

    // Handle error messages
    if (parsed.type === 'error') {
      return { type: 'error', content: parsed.message || 'Unknown error' };
    }

    // Handle finish messages with data
    if (parsed.type === 'finish' && parsed.finishReason) {
      return null; // Ignore finish messages
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Parse a single line from the UIMessageStream or raw text stream
 */
function parseStreamLine(line: string): StreamMessage | null {
  if (!line || line.trim() === '') return null;

  // SSE format (AI SDK v6+): data: {...}
  if (line.startsWith('data:')) {
    return parseSSELine(line);
  }

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

  // Ignore empty lines and other SSE-related lines
  if (line.startsWith(':') || line.startsWith('event:') || line.startsWith('id:')) {
    return null;
  }

  // Fallback: treat as raw text (for toTextStreamResponse)
  // This handles plain text streams without UIMessageStream formatting
  return { type: 'text', content: line };
}

/**
 * Detect if the stream is UIMessageStream format, SSE format, or raw text
 */
function isStructuredStreamFormat(chunk: string): boolean {
  const trimmed = chunk.trim();
  // Check for legacy UIMessageStream format (0:, 8:, e:, etc.)
  if (/^[0-9a-f]:/.test(trimmed)) return true;
  // Check for SSE format
  if (trimmed.startsWith('data:')) return true;
  return false;
}

/**
 * Process streaming response from UIMessageStream, SSE, or raw text stream
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
      isRawTextStream = !isStructuredStreamFormat(chunk.trim());
    }

    // For raw text streams, pass chunks directly to onText
    if (isRawTextStream) {
      onText(chunk);
      continue;
    }

    // For structured streams (UIMessageStream or SSE), process line by line
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

  // Process remaining buffer
  if (!isRawTextStream && buffer) {
    const message = parseStreamLine(buffer);
    if (message?.type === 'text' && message.content) {
      onText(message.content);
    } else if (message?.type === 'data' && message.data && onData) {
      onData(message.data as unknown as PRDSaveResult);
    }
  }
}
