/**
 * PRD Feature
 *
 * Handles PRD listing, viewing, and management
 */

// API functions
export { getPrds, type PrdListItem } from './api/get-prds';
export { getPrd, getPrdVersions, type PrdDetailItem, type PrdContent, type PrdVersionItem } from './api/get-prd';

// Hooks
export { usePrds, useInvalidatePrds, prdKeys } from './hooks/use-prds';

// UI components
export { PrdList } from './ui/prd-list';
export { PrdListClient } from './ui/prd-list-client';
export { PrdViewer } from './ui/prd-viewer';
export { CopyMarkdownButton } from './ui/copy-markdown-button';
export { PrdPdfDownload } from './ui/prd-pdf-download';
export { PrdDocument } from './ui/prd-document';
export { RevisionPanel } from './ui/revision-panel';
export { VersionHistory } from './ui/version-history';
