import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import CreateOperatorModal from 'modals/CreateOperatorModal';
import ExistingOperatorModal from 'modals/ExistingOperatorModal';
import OperatorsGridFilter from './components/OperatorsGridFilter';
import OperatorsGrid from './components/OperatorsGrid';
import OperatorsQuery from './graphql/OperatorsQuery';
import './OperatorsList.scss';

class OperatorsList extends PureComponent {
  static propTypes = {
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operator),
    }).isRequired,
    modals: PropTypes.shape({
      createOperatorModal: PropTypes.modalType,
      existingOperatorModal: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenCreateOperatorModal = () => {
    const {
      modals: {
        existingOperatorModal,
        createOperatorModal,
      },
    } = this.props;

    createOperatorModal.show({
      onExists: values => existingOperatorModal.show(values),
    });
  };

  render() {
    const { operatorsQuery } = this.props;

    const totalElements = operatorsQuery.data?.operators?.totalElements;

    return (
      <div className="OperatorsList">
        <div className="OperatorsList__header">
          <div className="OperatorsList__header-left">
            <Choose>
              <When condition={totalElements}>
                <div className="OperatorsList__title">
                  <strong>{totalElements} </strong>
                  {I18n.t('COMMON.OPERATORS_FOUND')}
                </div>
              </When>
              <Otherwise>
                <div className="OperatorsList__title">{I18n.t('OPERATORS.HEADING')}</div>
              </Otherwise>
            </Choose>
          </div>

          <PermissionContent permissions={permissions.OPERATORS.CREATE}>
            <div className="OperatorsList__header-right">
              <Button
                onClick={this.handleOpenCreateOperatorModal}
                tertiary
              >
                {I18n.t('OPERATORS.CREATE_OPERATOR_BUTTON')}
              </Button>
            </div>
          </PermissionContent>
        </div>

        <OperatorsGridFilter handleRefetch={operatorsQuery.refetch} />
        <OperatorsGrid operatorsQuery={operatorsQuery} />
      </div>
    );
  }
}

export default compose(
  withModals({
    createOperatorModal: CreateOperatorModal,
    existingOperatorModal: ExistingOperatorModal,
  }),
  withRequests({ operatorsQuery: OperatorsQuery }),
)(OperatorsList);
