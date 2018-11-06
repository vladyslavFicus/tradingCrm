import { reduxForm } from 'redux-form';
import { withApollo, compose } from 'react-apollo';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { salesStatusValues } from '../../../../../../../constants/salesStatuses';
import { retentionStatusValues } from '../../../../../../../constants/retentionStatuses';
import RepresentativeModal from './RepresentativeModal';
import attributeLabels from './constants';

const FORM_NAME = 'representativeModalForm';

export default compose(
  withApollo,
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: (values, { desks, agents, i18nPrefix }) => createValidator({
      deskId: [`in:,${desks.map(({ uuid }) => uuid).join()}`],
      repId: [`in:,${agents.map(({ uuid }) => uuid).join()}`],
      status: [`in:,${[...Object.values(salesStatusValues), ...Object.values(retentionStatusValues)].join()}`],
    }, translateLabels(attributeLabels(i18nPrefix)), false)(values),
  }),
)(RepresentativeModal);
