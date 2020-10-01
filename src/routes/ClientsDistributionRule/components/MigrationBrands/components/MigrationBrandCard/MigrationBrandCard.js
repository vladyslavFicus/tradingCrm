import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EditButton from './components/EditButton';
import RemoveButton from './components/RemoveButton';
import './MigrationBrandCard.scss';

class MigrationBrandCard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    brandId: PropTypes.string.isRequired,
    clientsAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    clientsAmountUnit: PropTypes.string,
    sortMethod: PropTypes.string,
    operator: PropTypes.shape({
      uuid: PropTypes.string,
      fullName: PropTypes.string,
    }),
  }

  static defaultProps = {
    className: '',
    clientsAmountUnit: '',
    sortMethod: '',
    operator: null,
  }

  render() {
    const {
      className,
      brandId,
      clientsAmount,
      clientsAmountUnit,
      sortMethod,
      operator,
    } = this.props;

    return (
      <div className={classNames('MigrationBrandCard', className)}>
        <div className="MigrationBrandCard__inner">
          <div className="MigrationBrandCard__cell">
            <div className="MigrationBrandCard__dt">{brandId}</div>
            <div className="MigrationBrandCard__dd">{clientsAmount}{clientsAmountUnit} clients chosen</div>
          </div>
          <div className="MigrationBrandCard__cell">
            <If condition={sortMethod}>
              <div className="MigrationBrandCard__dt">Sort</div>
              <div className="MigrationBrandCard__dd">{sortMethod}</div>
            </If>
            <If condition={operator}>
              <div className="MigrationBrandCard__dt">{operator.fullName}</div>
              <div className="MigrationBrandCard__dd">Operator</div>
            </If>
          </div>
          <div className="MigrationBrandCard__actions">
            <EditButton className="MigrationBrandCard__action" />
            <RemoveButton className="MigrationBrandCard__action" />
          </div>
        </div>
      </div>
    );
  }
}

export default MigrationBrandCard;
