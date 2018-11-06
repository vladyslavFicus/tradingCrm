import React, { Fragment } from 'react';
import Uuid from '../../../../../../components/Uuid';
import PropTypes from '../../../../../../constants/propTypes';
import ProfileHeaderPlaceholder from '../../../../../../components/ProfileHeaderPlaceholder';

const Header = ({
  data: {
    uuid,
    name,
    country,
  },
  loading,
}) => (
  <Fragment>
    <div className="row no-gutters panel-heading-row">
      <ProfileHeaderPlaceholder ready={!loading}>
        <div className="panel-heading-row__info">
          <div className="panel-heading-row__info-title">
            {name}
          </div>
          <span className="panel-heading-row__info-ids">
            {!!uuid && <Uuid uuid={uuid} uuidPrefix="OF" />} {country && ` - ${country}`}
          </span>
        </div>
      </ProfileHeaderPlaceholder>
    </div>
  </Fragment>
);

Header.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  data: {},
};

export default Header;
