import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { brandsConfig } from 'constants/brands';
import { EditButton, RemoveButton } from 'components/UI';
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
    brandType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: '',
    distributionUnit: {},
    sortType: '',
    operator: '',
    operators: [],
  }

  renderSourceBrandContent = () => {
    const {
      brand,
      distributionUnit: {
        quantity,
        baseUnit,
      },
      sortType,
    } = this.props;

    return (
      <>
        <div className="MigrationBrandCard__cell">
          <div className="MigrationBrandCard__dt">{brandsConfig[brand]?.name || brand}</div>
          <div className="MigrationBrandCard__dd">
            {quantity}{baseUnit === 'PERCENTAGE' ? '%' : ''}&nbsp;
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.BRAND.CLIENTS_CHOOSEN')}
          </div>
        </div>
        <div className="MigrationBrandCard__cell">
          <If condition={sortType}>
            <div className="MigrationBrandCard__dt">{I18n.t('CLIENTS_DISTRIBUTION.RULE.BRAND.SORT')}</div>
            <div className="MigrationBrandCard__dd">{sortType}</div>
          </If>
        </div>
      </>
    );
  }

  renderTargetBrandContent = () => {
    const {
      brand,
      distributionUnit: {
        quantity,
        baseUnit,
      },
      operator: operatorUuid,
      operators,
    } = this.props;

    const operator = operatorUuid && (operators.find(({ uuid }) => uuid === operatorUuid)?.fullName || operatorUuid);

    return (
      <>
        <div className="MigrationBrandCard__cell">
          <div className="MigrationBrandCard__dt">{brandsConfig[brand]?.name || brand}</div>
          <div className="MigrationBrandCard__dd">
            {quantity}{baseUnit === 'PERCENTAGE' ? '%' : ''}&nbsp;
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.BRAND.CLIENTS_TO_MIGRATION')}
          </div>
        </div>
        <div className="MigrationBrandCard__cell">
          <If condition={operator}>
            <div className="MigrationBrandCard__dt">{operator}</div>
            <div className="MigrationBrandCard__dd">{I18n.t('CLIENTS_DISTRIBUTION.RULE.BRAND.OPERATOR')}</div>
          </If>
        </div>
      </>
    );
  }

  render() {
    const {
      className,
      brandType,
      handleEditBrandCard,
      handleRemoveBrandCard,
    } = this.props;

    return (
      <div
        className={classNames('MigrationBrandCard', className)}
        onClick={handleEditBrandCard}
      >
        <div className="MigrationBrandCard__inner">
          <Choose>
            <When condition={brandType === 'source'}>
              {this.renderSourceBrandContent()}
            </When>
            <Otherwise>
              {this.renderTargetBrandContent()}
            </Otherwise>
          </Choose>
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
