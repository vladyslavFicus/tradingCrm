import React from 'react';

const year = (new Date()).getFullYear();

const Copyrights = () => (
  <div className="form-page__copyright">
    Copyright © {year} by Newage
  </div>
);

export default Copyrights;
