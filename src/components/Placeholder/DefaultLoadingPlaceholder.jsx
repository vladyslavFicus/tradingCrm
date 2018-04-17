import React from 'react';
import { TextRow } from 'react-placeholder/lib/placeholders';

const DefaultLoadingPlaceholder = () => (
  <div className="default-loading-placeholder">
    <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
    <TextRow className="animated-background" style={{ width: '60%', height: '12px' }} />
    <TextRow className="animated-background" style={{ width: '40%', height: '12px' }} />
  </div>
);

export default DefaultLoadingPlaceholder;
