import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EmailTemplatesList, EmailTemplatesCreator, EmailTemplatesEditor } from './routes/layouts';

const EmailTemplates = () => (
  <Routes>
    <Route path="list" element={<EmailTemplatesList />} />
    <Route path=":id" element={<EmailTemplatesEditor />} />
    <Route path="create" element={<EmailTemplatesCreator />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(EmailTemplates);
