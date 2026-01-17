'use client';

/**
 * PRD PDF Download Button
 *
 * CRITICAL: @react-pdf/renderer must be loaded with dynamic import + ssr: false
 * to avoid SSR build errors.
 */

import { useState, useEffect, type ReactElement } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface PrdPdfDownloadProps {
  prd: {
    id: string;
    title: string;
    content?: {
      markdown?: string;
      raw?: string;  // Legacy field support
      [key: string]: unknown;
    };
  };
}

export function PrdPdfDownload({ prd }: PrdPdfDownloadProps) {
  const [isClient, setIsClient] = useState(false);
  const [PdfComponents, setPdfComponents] = useState<{
    PDFDownloadLink: React.ComponentType<{
      document: ReactElement;
      fileName: string;
      children: (props: { loading: boolean }) => ReactElement;
    }>;
    PrdDocument: React.ComponentType<{ prd: PrdPdfDownloadProps['prd'] }>;
  } | null>(null);

  // Load PDF components on client only
  useEffect(() => {
    setIsClient(true);

    // Dynamically import both components
    Promise.all([
      import('@react-pdf/renderer'),
      import('./prd-document'),
    ]).then(([pdfRenderer, prdDoc]) => {
      setPdfComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink as typeof PdfComponents extends null ? never : NonNullable<typeof PdfComponents>['PDFDownloadLink'],
        PrdDocument: prdDoc.PrdDocument,
      });
    });
  }, []);

  // Generate filename from title
  const fileName = `${(prd.title || 'untitled-prd').replace(/\s+/g, '-').toLowerCase()}.pdf`;

  // Show placeholder while not on client or components not loaded
  if (!isClient || !PdfComponents) {
    return (
      <Button variant="secondary" disabled className="gap-2">
        <Download className="h-4 w-4" />
        Preparing PDF...
      </Button>
    );
  }

  const { PDFDownloadLink, PrdDocument } = PdfComponents;

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
