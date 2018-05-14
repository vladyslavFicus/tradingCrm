import GridViewColumn from './GridViewColumn';
import PermissionContent from '../PermissionContent';

const getGridColumn = child => (
  child.type === PermissionContent && child.props.children.type === GridViewColumn
    ? child.props.children.props
    : child.props
);

export { getGridColumn };
