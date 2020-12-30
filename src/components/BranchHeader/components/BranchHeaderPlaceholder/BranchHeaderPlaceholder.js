import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
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
      <ReactPlaceholder
        {...props}
        customPlaceholder={(
          <>
            <TextRow className="BranchHeaderPlaceholder__row" style={{ width: '220px', height: '20px' }} />
            <TextRow className="BranchHeaderPlaceholder__row" style={{ width: '220px', height: '12px' }} />
          </>
        )}
      >
        {children}
      </ReactPlaceholder>
    );
  }
}

export default BranchHeaderPlaceholder;
