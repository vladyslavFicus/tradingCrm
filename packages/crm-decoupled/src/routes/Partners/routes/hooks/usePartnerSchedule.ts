import { useCallback, useEffect, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { Partner, Partner__Schedule as Schedule } from '__generated__/types';
import { SetFieldValue } from 'types/formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import CreatePartnerScheduleModal, { CreatePartnerScheduleModalProps } from 'modals/CreatePartnerScheduleModal';
import { useChangeScheduleStatusMutation } from '../graphql/__generated__/ChangeScheduleStatusMutation';

type ScheduleDays = Record<string, boolean>;

type Props = {
  partner: Partner,
  onRefetch: () => void,
};

type PartnerSchedule = {
  getInitSchedule: ScheduleDays,
  partnerSchedule: Array<Schedule>,
  checkedDays: ScheduleDays,
  handleSubmit: () => void,
  hansleShowEditScheduleModal: (value: Schedule) => void,
  handleChangeActivate: (day: string, setFieldValue: SetFieldValue<ScheduleDays>) => void,
};

const usePartnerSchedule = (props: Props): PartnerSchedule => {
  const {
    partner: {
      uuid,
      schedule,
    },
    onRefetch,
  } = props;

  const partnerSchedule = schedule || [];

  const [checkedDays, setCheckedDays] = useState<ScheduleDays>({});

  const getInitSchedule = useMemo(() => partnerSchedule
    .reduce((acc, { day, activated }) => ({ ...acc, [day]: activated }), {} as ScheduleDays),
  [partnerSchedule]);

  // ===== Modals ===== //
  const createPartnerScheduleModal = useModal<CreatePartnerScheduleModalProps>(CreatePartnerScheduleModal);

  // ===== Requests ===== //
  const [changeScheduleStatusMutation] = useChangeScheduleStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async () => {
    try {
      await changeScheduleStatusMutation({
        variables: {
          affiliateUuid: uuid,
          data: Object.keys(checkedDays).map(day => ({ day, activated: checkedDays[day] })),
        },
      });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.SUCCESS'),

      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.ERROR'),
      });
    }
  }, [uuid, checkedDays]);

  const hansleShowEditScheduleModal = useCallback((value: Schedule) => {
    createPartnerScheduleModal.show({
      ...value,
      activated: checkedDays[value.day],
      affiliateUuid: uuid,
      refetch: onRefetch,
    });
  }, [uuid, checkedDays]);

  const handleChangeActivate = useCallback((day: string, setFieldValue: SetFieldValue<ScheduleDays>) => {
    const checked = !checkedDays[day];

    setCheckedDays(prevState => ({ ...prevState, [day]: checked }));

    setFieldValue(day, checked);
  }, []);

  // ===== Effects ===== //
  useEffect(() => {
    setCheckedDays(getInitSchedule);
  }, [schedule]);

  return {
    getInitSchedule,
    partnerSchedule,
    checkedDays,
    handleSubmit,
    hansleShowEditScheduleModal,
    handleChangeActivate,
  };
};

export default usePartnerSchedule;
