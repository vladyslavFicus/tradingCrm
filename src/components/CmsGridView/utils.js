import CmsGridViewColumn from './CmsGridViewColumn';
import PermissionContent from '../PermissionContent';

const getGridColumn = child => (
  child.type === PermissionContent && child.props.children.type === CmsGridViewColumn
    ? child.props.children.props
    : child.props
);

export { getGridColumn };
