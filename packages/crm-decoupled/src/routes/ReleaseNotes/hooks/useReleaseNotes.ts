import { useEffect, useState } from 'react';

const useReleaseNotes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch('/cloud-static/RELEASE-NOTES.html')
      .then(response => response.text())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Currently assumed that this condition will run only once
    // so there isn't any flag for restriction of event handlers initialization
    if (!loading && content) {
      document.querySelectorAll('.ReleaseNotes__item').forEach((item) => {
        const headline: HTMLHeadingElement | null = item.querySelector('.ReleaseNotes__item-headline');
        const itemBody: HTMLElement | null = item.querySelector('.ReleaseNotes__item-content');

        if (headline && itemBody) {
          headline.onclick = () => {
            if (itemBody.style.maxHeight && itemBody.style.maxHeight !== '0px') {
              itemBody.style.maxHeight = '0';
            } else {
              itemBody.style.maxHeight = `${itemBody.scrollHeight}px`;
            }
          };
        }
      });
    }
  }, [loading, content]);

  return {
    loading,
    content,
  };
};

export default useReleaseNotes;
