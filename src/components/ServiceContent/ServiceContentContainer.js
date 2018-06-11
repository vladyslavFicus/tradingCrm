import { graphql, compose } from 'react-apollo';
import ServiceContent from './ServiceContent';
import { servicesQuery } from '../../graphql/queries/options';

export default compose(
  graphql(servicesQuery, {
    name: 'optionServices',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(ServiceContent);
