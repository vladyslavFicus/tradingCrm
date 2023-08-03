import React from 'react';
import DocumentFilter from './components/DocumentFilter';
import DocumentsHeader from './components/DocumentsHeader';
import DocumentsGrid from './components/DocumentsGrid';

const DocumentsList = () => (
  <>
    <DocumentsHeader />

    <DocumentFilter />

    <DocumentsGrid />
  </>
);

export default React.memo(DocumentsList);
