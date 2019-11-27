import React from 'react';
import I18n from 'i18n-js';
import Uuid from 'components/Uuid';
import PropTypes from 'constants/propTypes';

const ConvertedBy = ({
  convertedToClientUuid,
  convertedByOperatorUuid,
}) => (
  <If condition={convertedToClientUuid}>
    <Choose>
      <When condition={convertedByOperatorUuid}>
        <div className="font-size-11">
          {I18n.t('common.by')} <Uuid uuid={convertedByOperatorUuid} />
        </div>
      </When>
      <Otherwise condition={!convertedByOperatorUuid}>
        <div className="font-size-11">
          {I18n.t('LEADS.STATUSES.SELF_CONVETED')}
        </div>
      </Otherwise>
    </Choose>
  </If>
);

ConvertedBy.propTypes = {
  convertedToClientUuid: PropTypes.string,
  convertedByOperatorUuid: PropTypes.string,
};

ConvertedBy.defaultProps = {
  convertedToClientUuid: null,
  convertedByOperatorUuid: null,
};

export default ConvertedBy;
