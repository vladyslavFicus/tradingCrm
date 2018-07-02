import GridViewColumn from './GridViewColumn';
import PermissionContent from '../PermissionContent';

const getGridColumn = child => (
  child.type === PermissionContent && child.props.children.type === GridViewColumn
    ? child.props.children.props
    : child.props
);

const multiselectStateSvgPaths = {
  active: '/img/checkbox-active.svg',
  hover: '/img/checkbox-hover.svg',
  inactive: '/img/checkbox-inactive.svg',
};

export {
  getGridColumn,
  multiselectStateSvgPaths,
};
