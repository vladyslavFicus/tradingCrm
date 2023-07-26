import React, { useEffect } from 'react';
import './Lightbox.scss';

type Props = {
  source: string,
  onHide: () => void,
};

const Lightbox = (props: Props) => {
  const { source, onHide } = props;

  useEffect(() => {
    const handleKeydown = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        onHide();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="Lightbox" onClick={onHide}>
      <div className="Lightbox__content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <span className="Lightbox__close" onClick={onHide} />

        <img src={source} alt="" onError={(e) => { e.currentTarget.src = '/img/image-placeholder.svg'; }} />
      </div>
    </div>
  );
};

export default React.memo(Lightbox);
