import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HolidaysList from './routes/HolidaysList';
import NewHoliday from './routes/NewHoliday';
import EditHoliday from './routes/EditHoliday';

const Holidays = () => (
  <Routes>
    <Route path="list" element={<HolidaysList />} />
    <Route path="new" element={<NewHoliday />} />
    <Route path=":id" element={<EditHoliday />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Holidays);
