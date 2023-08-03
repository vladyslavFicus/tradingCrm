import React, { useCallback } from 'react';
import { Navigate } from '@hrzn/react-big-calendar';
import { Button } from 'components/Buttons';
import './Toolbar.scss';

type Message = Record<string, string>;

type Localizer = {
  messages: Message,
};

type Props = {
  label: React.ReactNode,
  view: string,
  views: Array<string>,
  localizer: Localizer,
  onNavigate: (arg: string) => void,
  onView: (name: string) => void,
};

const Toolbar = (props: Props) => {
  const {
    label,
    localizer: { messages },
    views,
    view,
    onNavigate,
    onView,
  } = props;

  const navigateNext = useCallback(() => onNavigate(Navigate.NEXT), []);

  const navigatePrev = useCallback(() => onNavigate(Navigate.PREVIOUS), []);

  const viewNamesGroup = useCallback((message: Message) => {
    if (views.length > 1) {
      return views.map((name: string) => (
        <Button
          key={name}
          primary={view === name}
          tertiary={view !== name}
          onClick={() => onView(name)}
        >
          {message[name]}
        </Button>
      ));
    }

    return null;
  }, []);

  return (
    <div className="Toolbar d-flex align-items-center justify-content-between">
      <div className="col-3" />
      <div className="d-flex justify-content-center align-items-center col-6">
        <Button className="Toolbar__arrow" onClick={navigatePrev}>
          <i className="fa fa-angle-left" />
        </Button>

        <span className="Toolbar__label">{label}</span>

        <Button className="Toolbar__arrow" onClick={navigateNext}>
          <i className="fa fa-angle-right" />
        </Button>
      </div>

      <div className="col-3 d-flex justify-content-end">{viewNamesGroup(messages)}</div>
    </div>
  );
};

export default React.memo(Toolbar);
