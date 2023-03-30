import React, { useState } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import Select from 'components/Select';
import { Button } from 'components/Buttons';
import { withNotifications } from 'hoc';
import { FormValues } from '../../types';
import { useNewGroupTemplatesQuery, NewGroupTemplatesQuery } from './graphql/__generated__/NewGroupTemplatesQuery';
import './GroupProfileHeaderNew.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

type Group = ExtractApolloTypeFromPageable<NewGroupTemplatesQuery['tradingEngine']['groups']>;

const GroupProfileHeaderNew = (props: Props) => {
  const { dirty, isSubmitting, isValid, setValues, values } = props.formik;

  const { groupName, description } = values;

  const [templateNameGroup, setTemplateName] = useState<String | null>(null);

  const groupTemplates = useNewGroupTemplatesQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 10000,
        },
      },
    },
  });

  const content = groupTemplates.data?.tradingEngine.groups.content || [];

  const onChangeHandler = (templateName: String) => {
    const group = content.find(item => item.groupName === templateName) as Group;

    setTemplateName(templateName);

    setValues({ ...group, groupName, description });
  };

  return (
    <div className="GroupProfileHeaderNew">
      <div className="GroupProfileHeaderNew__title">
        {I18n.t('TRADING_ENGINE.GROUP.NEW_GROUP')}
      </div>

      <div className="GroupProfileHeaderNew__actions">
        <div className="GroupProfileHeaderNew__select">
          <span className="GroupProfileHeaderNew__select-label">
            {I18n.t('TRADING_ENGINE.GROUP.TEMPLATES')}
          </span>
          <Select
            // Required because the Select component is not the TS component and doesn't support typing
            // @ts-ignore
            disabled={groupTemplates.loading}
            onChange={onChangeHandler}
            value={templateNameGroup}
            placeholder={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.GROUP_TEMPLATE')}
          >
            {content.map((group: Group) => (
              <option key={group.groupName} value={group.groupName}>
                {group.groupName}
              </option>
            ))}
          </Select>
        </div>

        <Button
          small
          primary
          disabled={!dirty || isSubmitting || !isValid}
          type="submit"
          className="GroupProfileHeaderNew__button"
        >
          {I18n.t('COMMON.SAVE')}
        </Button>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(GroupProfileHeaderNew);
