import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EditButton from './components/EditButton';
import RemoveButton from './components/RemoveButton';
import './MigrationBrandCard.scss';

class MigrationBrandCard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    brand: PropTypes.string.isRequired,
    distributionUnit: PropTypes.shape({
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      baseUnit: PropTypes.string,
    }),
    sortType: PropTypes.string,
    operator: PropTypes.string,
    handleEditBrandCard: PropTypes.func.isRequired,
    handleRemoveBrandCard: PropTypes.func.isRequired,
    operators: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      fullName: PropTypes.string,
    })),
  }

  static defaultProps = {
    className: '',
    distributionUnit: {},
    sortType: '',
    operator: '',
    operators: [],
  }

  render() {
    const {
      className,
      brand,
      distributionUnit: {
        quantity,
        baseUnit,
      },
      sortType,
      operator: operatorUuid,
      handleEditBrandCard,
      handleRemoveBrandCard,
      operators,
    } = this.props;

    const operator = operatorUuid && (operators.find(({ uuid }) => uuid === operatorUuid)?.fullName || operatorUuid);

    return (
      <div
        className={classNames('MigrationBrandCard', className)}
        onClick={handleEditBrandCard}
      >
        <div className="MigrationBrandCard__inner">
          <div className="MigrationBrandCard__cell">
            <div className="MigrationBrandCard__dt">{brand}</div>
            <div className="MigrationBrandCard__dd">{quantity}{baseUnit} clients chosen</div>
          </div>
          <div className="MigrationBrandCard__cell">
            <If condition={sortType}>
              <div className="MigrationBrandCard__dt">Sort</div>
              <div className="MigrationBrandCard__dd">{sortType}</div>
            </If>
            <If condition={operator}>
              <div className="MigrationBrandCard__dt">{operator}</div>
              <div className="MigrationBrandCard__dd">Operator</div>
            </If>
          </div>
          <div className="MigrationBrandCard__actions">
            <EditButton
              className="MigrationBrandCard__action"
              onClick={handleEditBrandCard}
            />
            <RemoveButton
              className="MigrationBrandCard__action"
              onClick={handleRemoveBrandCard}
              stopPropagation
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MigrationBrandCard;
