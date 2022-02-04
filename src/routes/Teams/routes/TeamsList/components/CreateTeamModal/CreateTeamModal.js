import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Form, Field, withFormik } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import CreateTeamMutation from './graphql/CreateTeamMutation';
import './CreateTeamModal.scss';

const attributeLabels = {
  teamName: 'TEAMS.MODAL.LABELS.TEAM_NAME',
  officeUuid: 'TEAMS.MODAL.LABELS.OFFICE',
  deskUuid: 'TEAMS.MODAL.LABELS.DESK',
};

class CreateTeamModal extends PureComponent {
  static propTypes = {
    desksAndOffices: PropTypes.userBranchHierarchyResponse.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    values: PropTypes.shape({
      keyword: PropTypes.string,
      officeUuid: PropTypes.string,
      deskUuid: PropTypes.string,
    }).isRequired,
  };

  handleOfficeChange = (value) => {
    const { setFieldValue } = this.props;

    setFieldValue('deskUuid', '');
    setFieldValue('officeUuid', value);
  };

  render() {
    const {
      values: { officeUuid },
      desksAndOffices,
      isSubmitting,
      onCloseModal,
      isOpen,
    } = this.props;

    const isLoading = desksAndOffices.loading;
    const offices = get(desksAndOffices, 'data.userBranches.OFFICE') || [];
    const desks = get(desksAndOffices, 'data.userBranches.DESK') || [];
    const desksByOffice = desks.filter(desk => desk.parentBranch.uuid === officeUuid);

    const deskPlaceholder = (desksByOffice.length)
      ? 'COMMON.SELECT_OPTION.DEFAULT'
      : 'TEAMS.MODAL.PLACEHOLDERS.NO_OFFICE_DESK';

    return (
      <Modal className="CreateTeamModal" toggle={onCloseModal} isOpen={isOpen}>
        <Form>
          <ModalHeader toggle={onCloseModal}>{I18n.t('TEAMS.MODAL.HEADER')}</ModalHeader>
          <ModalBody>
            <Field
              name="teamName"
              label={I18n.t(attributeLabels.name)}
              placeholder={I18n.t('TEAMS.MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
              component={FormikInputField}
              disabled={isSubmitting}
            />
            <div>
              <Field
                name="officeUuid"
                className="CreateTeamModal__select"
                label={I18n.t(attributeLabels.officeUuid)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_OFFICE')}
                component={FormikSelectField}
                customOnChange={this.handleOfficeChange}
                disabled={isLoading}
                searchable
              >
                {offices.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>
              <Field
                name="deskUuid"
                className="CreateTeamModal__select"
                component={FormikSelectField}
                label={I18n.t(attributeLabels.deskUuid)}
                placeholder={I18n.t(
                  (officeUuid)
                    ? deskPlaceholder
                    : 'TEAMS.MODAL.PLACEHOLDERS.SELECT_OFFICE_FIRST',
                )}
                disabled={isSubmitting || !desksByOffice.length}
              >
                {desksByOffice.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onCloseModal}
              className="CreateTeamModal__button"
              commonOutline
            >
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </Button>

            <Button
              className="CreateTeamModal__button"
              primary
              disabled={isSubmitting}
              type="submit"
            >
              {I18n.t('TEAMS.MODAL.CREATE_BUTTON')}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    createTeam: CreateTeamMutation,
  }),
  withFormik({
    mapPropsToValues: () => ({
      keyword: '',
      officeUuid: '',
      deskUuid: '',
    }),
    validateOnChange: false,
    validateOnBlur: false,
    validate: values => createValidator({
      teamName: ['required', 'string'],
      deskUuid: ['required', 'string'],
    }, translateLabels(attributeLabels))(values),
    handleSubmit: async (values, { props, setSubmitting }) => {
      const {
        onCloseModal,
        createTeam,
        onSuccess,
        notify,
      } = props;

      setSubmitting(false);

      try {
        await createTeam({ variables: values });

        onSuccess();
        onCloseModal();

        notify({
          level: 'success',
          title: I18n.t('TEAMS.MODAL.NOTIFICATIONS.SUCCESS.TITLE'),
          message: I18n.t('TEAMS.MODAL.NOTIFICATIONS.SUCCESS.MESSAGE'),
        });
      } catch {
        notify({
          level: 'error',
          title: I18n.t('TEAMS.MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('TEAMS.MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    },
  }),
)(CreateTeamModal);
