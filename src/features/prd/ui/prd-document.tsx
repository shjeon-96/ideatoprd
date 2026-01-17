/**
 * PRD PDF Document Component
 *
 * @react-pdf/renderer Document for generating PDF.
 * NOTE: This component must NOT be imported in server components.
 * Always use dynamic import with ssr: false.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register Korean font (Noto Sans KR - TTF format for @react-pdf/renderer compatibility)
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Disable word hyphenation for Korean text
Font.registerHyphenationCallback((word) => [word]);

// Styles for A4 page
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'NotoSansKR',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    color: '#64647a',
    // Note: NotoSansKR doesn't have italic variant, use normal weight instead
  },
  metadata: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  section: {
    marginBottom: 16,
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a2e',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  h3: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 4,
    paddingLeft: 12,
  },
  bullet: {
    color: '#e07a5f',
    marginRight: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: '#9ca3af',
  },
});

/**
 * Parse markdown into structured sections for better PDF rendering
 */
function parseMarkdownSections(markdown: string): Array<{
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list';
  content: string;
  items?: string[];
}> {
  const sections: Array<{
    type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list';
    content: string;
    items?: string[];
  }> = [];

  const lines = markdown.split('\n');
  let currentList: string[] = [];
  let currentParagraph = '';

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      sections.push({ type: 'paragraph', content: currentParagraph.trim() });
      currentParagraph = '';
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      sections.push({ type: 'list', content: '', items: [...currentList] });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      sections.push({ type: 'h1', content: trimmed.slice(2) });
    } else if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      sections.push({ type: 'h2', content: trimmed.slice(3) });
    } else if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      sections.push({ type: 'h3', content: trimmed.slice(4) });
    }
    // List items
    else if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const content = trimmed.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');
      currentList.push(cleanInlineMarkdown(content));
    }
    // Empty line
    else if (trimmed === '') {
      flushParagraph();
      flushList();
    }
    // Regular text
    else {
      if (currentList.length > 0) {
        flushList();
      }
      currentParagraph += (currentParagraph ? ' ' : '') + cleanInlineMarkdown(trimmed);
    }
  }

  flushParagraph();
  flushList();

  return sections;
}

/**
 * Clean inline markdown formatting
 */
function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

interface PrdDocumentProps {
  prd: {
    id: string;
    title: string;
    content?: {
      markdown?: string;
      raw?: string;
      [key: string]: unknown;
    };
  };
}

export function PrdDocument({ prd }: PrdDocumentProps) {
  const markdown = prd.content?.markdown ?? prd.content?.raw ?? '';
  const sections = parseMarkdownSections(markdown);

  // Extract subtitle from first h1 if exists
  const firstH1Index = sections.findIndex((s) => s.type === 'h1');
  const subtitle = firstH1Index >= 0 ? sections[firstH1Index].content : '';
  const contentSections = firstH1Index >= 0 ? sections.slice(firstH1Index + 1) : sections;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{prd.title || 'Untitled PRD'}</Text>

        {/* Subtitle from H1 */}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text>Generated by IdeaToPRD • {new Date().toLocaleDateString('ko-KR')}</Text>
        </View>

        {/* Content */}
        {contentSections.map((section, index) => {
          switch (section.type) {
            case 'h2':
              return (
                <Text key={index} style={styles.h2}>
                  {section.content}
                </Text>
              );
            case 'h3':
              return (
                <Text key={index} style={styles.h3}>
                  {section.content}
                </Text>
              );
            case 'paragraph':
              return (
                <Text key={index} style={styles.paragraph}>
                  {section.content}
                </Text>
              );
            case 'list':
              return (
                <View key={index} style={styles.section}>
                  {section.items?.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text> {item}
                    </Text>
                  ))}
                </View>
              );
            default:
              return null;
          }
        })}

        {/* Footer */}
        <Text style={styles.footer}>
          IdeaToPRD - 아이디어를 PRD로 변환하세요
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
