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
    operatorEntity: PropTypes.shape({
      fullName: PropTypes.string,
    }),
    handleEditBrandCard: PropTypes.func.isRequired,
    handleRemoveBrandCard: PropTypes.func.isRequired,
    brandType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: '',
    distributionUnit: {},
    sortType: '',
    operatorEntity: null,
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
      operatorEntity,
    } = this.props;

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
          <If condition={operatorEntity?.fullName}>
            <div className="MigrationBrandCard__dt">{operatorEntity.fullName}</div>
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
