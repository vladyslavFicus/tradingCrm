import { compose } from 'react-apollo';
import GamingView from './GamingView';
import { withReduxFormValues } from '../../../../components/HighOrder';

export default compose(
  withReduxFormValues
)(GamingView);
