import React from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from '../../../../../constants/propTypes';

const BonusHeaderNavigation = ({ params: { id } }) => (
  <div className="bonus-header-navigation">
    <Link className="font-size-20 btn btn-link" to={`/users/${id}/bonuses/bonus`} activeClassName="color-black">Bonuses</Link> /
    <Link className="font-size-20 btn btn-link" to={`/users/${id}/bonuses/campaigns`}>Eligible campaigns</Link> /
    <Link className="font-size-20 btn btn-link" to={`/users/${id}/bonuses/free-spins`}>Free spins</Link>
  </div>
);
BonusHeaderNavigation.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(BonusHeaderNavigation);
