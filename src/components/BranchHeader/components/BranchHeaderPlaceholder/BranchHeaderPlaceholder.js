import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextRow } from 'react-placeholder/lib/placeholders';
import Placeholder from 'components/Placeholder';
import './BranchHeaderPlaceholder.scss';

class BranchHeaderPlaceholder extends PureComponent {
  static propTypes = {
    ready: PropTypes.bool,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    ready: false,
  };

  render() {
    const {
      children,
      ...props
    } = this.props;

    return (
      <Placeholder
        {...props}
        className={null}
        customPlaceholder={(
          <>
            <TextRow className="BranchHeaderPlaceholder__row" style={{ width: '220px', height: '20px' }} />
            <TextRow className="BranchHeaderPlaceholder__row" style={{ width: '220px', height: '12px' }} />
          </>
        )}
      >
        {children}
      </Placeholder>
    );
  }
}

export default BranchHeaderPlaceholder;
