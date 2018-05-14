import React from 'react';
import {GridViewLoader} from '../../../../../components/GridView';

const Loader = () => (
  <div className="table-responsive">
    <table className="table data-grid-layout">
      <tbody>
        <GridViewLoader className="infinite-preloader" colSpan={1} />
      </tbody>
    </table>
  </div>
);

export default Loader;
