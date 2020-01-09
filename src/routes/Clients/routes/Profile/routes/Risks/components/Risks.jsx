import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { risksQuestionnaireQuery } from 'graphql/queries/risks';
import { calculateRiskMutation, saveRiskDataMutation } from 'graphql/mutations/risks';
import NotificationModal from 'components/Modal/NotificationModal';
import { withModals } from 'components/HighOrder';
import RisksQuestionnaire from './RisksQuestionnaire';
import RisksResult from './RisksResult';
import '../Risks.scss';

class Risks extends Component {
  static propTypes = {
    risksQuestionnaireData: PropTypes.risksQuestionnaireData.isRequired,
    refetchProfile: PropTypes.func.isRequired,
    calculateRisk: PropTypes.func.isRequired,
    saveRiskData: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      notificationModal: PropTypes.modalType,
    }).isRequired,
  };

  state = {
    calcData: null,
  };

  componentDidUpdate() {
    const { calcData } = this.state;
    const questionnaireData = get(this.props, 'risksQuestionnaireData.riskQuestionnaire.data') || null;

    if (questionnaireData && !calcData) {
      return this.saveCalcDataToState(this.getCalcData(questionnaireData));
    }

    return null;
  }

  getCalcData = ({ totalScore, questionnaire: { questionGroups } }) => {
    const totalRiskResult = { title: I18n.t('CLIENT_PROFILE.RISKS.TAB.RESULT.TOTAL_TITLE'), score: totalScore };
    const groupsRiskResults = questionGroups.map(({ title, score }) => ({ title, score }));

    return [totalRiskResult, ...groupsRiskResults];
  };

  saveCalcDataToState = (calcData) => {
    this.setState({ calcData });
  };

  buildRequestBody = (formValues) => {
    const {
      risksQuestionnaireData: {
        riskQuestionnaire: {
          data: {
            playerUuid,
            questionnaire: {
              id: questionnaireId,
            },
          },
        },
      },
    } = this.props;

    const answers = Object.values(formValues).map(answer => JSON.parse(answer));

    return {
      questionnaireId,
      playerUuid,
      answers,
    };
  };

  onHandleCalculate = async (values) => {
    const { calculateRisk } = this.props;

    const response = await calculateRisk({ variables: this.buildRequestBody(values) });
    const data = get(response, 'data.risks.calculateRisk.data') || null;

    if (data) {
      this.saveCalcDataToState(this.getCalcData(data));
    }
  };

  onHandleSave = async (values) => {
    const {
      saveRiskData,
      refetchProfile,
      modals: { notificationModal },
    } = this.props;

    const response = await saveRiskData({ variables: this.buildRequestBody(values) });
    const data = get(response, 'data.risks.saveRiskData.data') || null;

    if (data && data.riskCategory === 'HIGH_RISK') {
      notificationModal.show({
        modalTitle: I18n.t('CLIENT_PROFILE.RISKS.TAB.MODAL.TITLE'),
        actionText: I18n.t('CLIENT_PROFILE.RISKS.TAB.MODAL.ACTION_TEXT'),
        submitButtonLabel: I18n.t('CLIENT_PROFILE.RISKS.TAB.MODAL.SUBMIT_TEXT'),
      });
    }

    if (data) {
      this.saveCalcDataToState(this.getCalcData(data));
      refetchProfile();
    }
  };

  render() {
    const { risksQuestionnaireData } = this.props;
    const { calcData } = this.state;

    const questionnaireData = get(risksQuestionnaireData, 'riskQuestionnaire.data') || null;

    return (
      <Fragment>
        <If condition={questionnaireData}>
          <div className="risk__columns">
            <div className="risk__columns-left">
              <RisksQuestionnaire
                questionnaireData={questionnaireData}
                onHandleCalculate={this.onHandleCalculate}
                onHandleSave={this.onHandleSave}
              />
            </div>

            <div className="risk__columns-right">
              <div className="risk__result">
                <RisksResult calcData={calcData || this.getCalcData(questionnaireData)} />
              </div>
            </div>
          </div>
        </If>
      </Fragment>
    );
  }
}

export default compose(
  withModals({
    notificationModal: NotificationModal,
  }),
  graphql(risksQuestionnaireQuery, {
    name: 'risksQuestionnaireData',
    options: ({
      match: {
        params: {
          id: clientUuid,
        },
      },
    }) => ({
      fetchPolicy: 'network-only',
      variables: {
        clientUuid,
      },
    }),
  }),
  graphql(calculateRiskMutation, {
    name: 'calculateRisk',
  }),
  graphql(saveRiskDataMutation, {
    name: 'saveRiskData',
  }),
)(Risks);
