import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HierarchyBranchTree from '../HierarchyBranchTree';
import './HierarchyUserBranchItem.scss';

class HierarchyUserBranchItem extends PureComponent {
  static propTypes = {
    branch: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      branchType: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    isOpen: false,
  };

  toggleHierarchyTree = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    const { branch: { uuid, name, branchType } } = this.props;

    const { isOpen } = this.state;

    return (
      <div>
        -
        <button type="button" className="HierarchyUserBranchItem__branchLink" onClick={this.toggleHierarchyTree}>
          {name}
        </button> [{branchType}]
        {isOpen && <HierarchyBranchTree branchUUID={uuid} />}
      </div>
    );
  }
}

export default HierarchyUserBranchItem;
