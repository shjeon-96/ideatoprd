import { tavily, type TavilyClient } from '@tavily/core';

// Lazy initialization to avoid build-time errors
let tavilyClient: TavilyClient | null = null;

function getClient(): TavilyClient {
  if (!tavilyClient) {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY environment variable is not set');
    }
    tavilyClient = tavily({ apiKey });
  }
  return tavilyClient;
}

export interface TrendSearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TrendResearchResult {
  marketTrends: TrendSearchResult[];
  competitors: TrendSearchResult[];
  techTrends: TrendSearchResult[];
  summary: string;
}

// Build search queries based on idea
function buildSearchQueries(idea: string): {
  market: string;
  competitors: string;
  tech: string;
} {
  // Extract key concepts from idea
  const ideaLower = idea.toLowerCase();

  return {
    market: `${idea} market size trends 2024 2025`,
    competitors: `${idea} competitors alternatives comparison`,
    tech: `${idea} technology stack best practices 2025`,
  };
}

// Search for market trends
export async function searchMarketTrends(idea: string): Promise<TrendSearchResult[]> {
  const query = buildSearchQueries(idea).market;

  const response = await getClient().search(query, {
    searchDepth: 'basic',
    maxResults: 3,
    includeAnswer: false,
  });

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

// Search for competitors
export async function searchCompetitors(idea: string): Promise<TrendSearchResult[]> {
  const query = buildSearchQueries(idea).competitors;

  const response = await getClient().search(query, {
    searchDepth: 'basic',
    maxResults: 3,
    includeAnswer: false,
  });

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

// Search for technology trends
export async function searchTechTrends(idea: string): Promise<TrendSearchResult[]> {
  const query = buildSearchQueries(idea).tech;

  const response = await getClient().search(query, {
    searchDepth: 'basic',
    maxResults: 3,
    includeAnswer: false,
  });

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

// Comprehensive trend research
export async function researchTrends(idea: string): Promise<TrendResearchResult> {
  // Run all searches in parallel
  const [marketTrends, competitors, techTrends] = await Promise.all([
    searchMarketTrends(idea),
    searchCompetitors(idea),
    searchTechTrends(idea),
  ]);

  // Generate summary from results
  const summary = generateResearchSummary(marketTrends, competitors, techTrends);

  return {
    marketTrends,
    competitors,
    techTrends,
    summary,
  };
}

// Generate a concise summary for the prompt
function generateResearchSummary(
  market: TrendSearchResult[],
  competitors: TrendSearchResult[],
  tech: TrendSearchResult[]
): string {
  const sections: string[] = [];

  if (market.length > 0) {
    sections.push(`**Market Insights:**\n${market.map((m) => `- ${m.title}: ${truncate(m.content, 200)}`).join('\n')}`);
  }

  if (competitors.length > 0) {
    sections.push(`**Competitors & Alternatives:**\n${competitors.map((c) => `- ${c.title}: ${truncate(c.content, 200)}`).join('\n')}`);
  }

  if (tech.length > 0) {
    sections.push(`**Technology Trends:**\n${tech.map((t) => `- ${t.title}: ${truncate(t.content, 200)}`).join('\n')}`);
  }

  return sections.join('\n\n');
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Format research for prompt injection
export function formatResearchForPrompt(research: TrendResearchResult): string {
  return `
<trend_research>
${research.summary}

Sources:
${[...research.marketTrends, ...research.competitors, ...research.techTrends]
  .slice(0, 5)
  .map((r) => `- ${r.url}`)
  .join('\n')}
</trend_research>
`;
}
