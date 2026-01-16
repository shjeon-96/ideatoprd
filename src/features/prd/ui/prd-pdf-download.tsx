'use client';

/**
 * PRD PDF Download Button
 *
 * CRITICAL: @react-pdf/renderer must be loaded with dynamic import + ssr: false
 * to avoid SSR build errors.
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

// Dynamic import with ssr: false - CRITICAL for @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button variant="secondary" disabled className="gap-2">
        <Download className="h-4 w-4" />
        Loading...
      </Button>
    ),
  }
);

// PrdDocument must also be dynamically imported
const PrdDocument = dynamic(
  () => import('./prd-document').then((mod) => mod.PrdDocument),
  { ssr: false }
);

interface PrdPdfDownloadProps {
  prd: {
    id: string;
    title: string;
    content?: {
      markdown?: string;
      [key: string]: unknown;
    };
  };
}

export function PrdPdfDownload({ prd }: PrdPdfDownloadProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering PDF components
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate filename from title
  const fileName = `${(prd.title || 'untitled-prd').replace(/\s+/g, '-').toLowerCase()}.pdf`;

  // Show placeholder while not on client
  if (!isClient) {
    return (
      <Button variant="secondary" disabled className="gap-2">
        <Download className="h-4 w-4" />
        Preparing PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PrdDocument prd={prd} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button variant="secondary" disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          {loading ? 'Generating...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
