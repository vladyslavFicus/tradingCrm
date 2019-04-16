import React from 'react';
import ShortLoader from 'components/ShortLoader';

const METABASE_SITE_URL = 'https://metabase.flcn.pro';

const NewDashboard = React.memo(
  ({ metabaseToken: { loading, getMetabaseToken } }) => (
    /* 128px = 40(top padding) + 40(bot padding) + 48(header height) */
    <Choose>
      <When condition={!loading && getMetabaseToken.token}>
        <div style={{ height: 'calc(100vh - 128px)' }}>
          <iframe
            title="Dashboard"
            src={`${METABASE_SITE_URL}/embed/dashboard/${getMetabaseToken.token}#bordered=true&titled=true`}
            frameBorder={0}
            width="100%"
            height="100%"
            allowTransparency
          />
        </div>
      </When>
      <Otherwise>
        <ShortLoader />
      </Otherwise>
    </Choose>
  )
);

export default NewDashboard;
