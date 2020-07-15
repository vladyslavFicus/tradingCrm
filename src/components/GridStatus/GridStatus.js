import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class GridStatus extends PureComponent {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    colorClassName: PropTypes.string,
    statusLabel: PropTypes.string,
    info: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.element,
      PropTypes.object,
    ]),
    infoLabel: PropTypes.func,
  };

  static defaultProps = {
    colorClassName: null,
    wrapperClassName: null,
    statusLabel: null,
    info: null,
    infoLabel: null,
  };

  render() {
    const {
      wrapperClassName,
      colorClassName,
      statusLabel,
      infoLabel,
      info,
    } = this.props;

    return (
      <div className={wrapperClassName ? `grid-status-border ${wrapperClassName}` : ''}>
        <If condition={statusLabel}>
          <div className={classNames(colorClassName, 'text-uppercase font-weight-700')}>
            {statusLabel}
          </div>
        </If>
        <If condition={info}>
          <div className="font-size-11">
            <Choose>
              <When condition={infoLabel && typeof infoLabel === 'function'}>
                {infoLabel(info)}
              </When>
              <Otherwise>
                {info}
              </Otherwise>
            </Choose>
          </div>
        </If>
      </div>
    );
  }
}

export default GridStatus;
