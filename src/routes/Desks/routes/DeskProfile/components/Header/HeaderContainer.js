import { withModals } from 'hoc';
import AddOperatorToBranchModal from 'components/AddOperatorToBranchModal';
import Header from './Header';

export default withModals({
  addOperatorModal: AddOperatorToBranchModal,
})(Header);
