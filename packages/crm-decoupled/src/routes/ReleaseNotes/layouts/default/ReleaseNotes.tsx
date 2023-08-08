import React from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';
import { ShortLoader } from 'components';
import useReleaseNotes from 'routes/ReleaseNotes/hooks/useReleaseNotes';
import './ReleaseNotes.scss';

const ReleaseNotes = () => {
  const {
    loading,
    content,
  } = useReleaseNotes();

  return (
    <div className="ReleaseNotes">
      <h1 className="ReleaseNotes__headline">
        {startCase(getBackofficeBrand().id)} CRM<br />Release notes
      </h1>

      <Choose>
        <When condition={loading}>
          <ShortLoader />
        </When>

        <Otherwise>
          <div
            className="ReleaseNotes__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(ReleaseNotes);
