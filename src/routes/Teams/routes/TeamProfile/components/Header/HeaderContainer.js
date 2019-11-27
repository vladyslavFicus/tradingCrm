import AddOperatorToBranchModal from 'components/AddOperatorToBranchModal';
import { withModals } from 'components/HighOrder';
import Header from './Header';

export default withModals({
  addOperatorModal: AddOperatorToBranchModal,
})(Header);
