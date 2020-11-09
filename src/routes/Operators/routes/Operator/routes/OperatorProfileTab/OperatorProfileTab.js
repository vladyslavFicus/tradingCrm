import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import OperatorPersonal from './components/OperatorPersonal';
import OperatorDepartments from './components/OperatorDepartments';
import OperatorQuery from './graphql/OperatorQuery';
import './OperatorProfileTab.scss';

class OperatorProfileTab extends PureComponent {
  static propTypes = {
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
  }

  render() {
    const { operatorQuery } = this.props;

    return (
      <div className="OperatorProfileTab">
        <OperatorPersonal operatorQuery={operatorQuery} />
        <OperatorDepartments operatorQuery={operatorQuery} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    operatorQuery: OperatorQuery,
  }),
)(OperatorProfileTab);
