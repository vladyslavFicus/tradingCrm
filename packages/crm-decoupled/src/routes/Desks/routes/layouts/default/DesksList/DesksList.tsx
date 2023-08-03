import React from 'react';
import DesksHeader from './components/DesksHeader';
import DesksFilter from './components/DesksFilter';
import DesksGrid from './components/DesksGrid';
import './DesksList.scss';

const DesksList = () => (
  <div className="DesksList">
    <DesksHeader />

    <DesksFilter />

    <DesksGrid />
  </div>
);

export default React.memo(DesksList);
