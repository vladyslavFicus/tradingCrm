import React, { PureComponent } from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';
import ShortLoader from 'components/ShortLoader';
import './ReleaseNotes.scss';

class ReleaseNotes extends PureComponent {
  state = {
    loading: true,
    content: null,
  };

  componentDidMount() {
    fetch('/cloud-static/RELEASE-NOTES.html')
      .then(response => response.text())
      .then((content) => {
        const newContent = content
          .replace(/<h2>[^]+?(?=<h2>)|<h2>[^]+/gmi, replacement => (
            `<div class="ReleaseNotes__item">
              ${replacement
              .replace(/((?<=<\/h2>)[^]+)/gmi, '<div class="ReleaseNotes__item-content">$1</div>')
              .replace(/(<h2>[^]+<\/h2>)/gmi, '<div class="ReleaseNotes__item-headline">$1</div>')
              }
            </div>`
          ));

        this.setState({ content: newContent, loading: false });
      });
  }

  componentDidUpdate() {
    const {
      content,
      loading,
    } = this.state;

    // Currently assumed that this condition will run only once
    // so there isn't any flag for restriction of event handlers initialization
    if (!loading && content) {
      document.querySelectorAll('.ReleaseNotes__item').forEach((item) => {
        const headline = item.querySelector('.ReleaseNotes__item-headline');
        const itemBody = item.querySelector('.ReleaseNotes__item-content');

        if (headline && itemBody) {
          headline.onclick = () => {
            if (itemBody.style.maxHeight) {
              itemBody.style.maxHeight = null;
            } else {
              itemBody.style.maxHeight = `${itemBody.scrollHeight}px`;
            }
          };
        }
      });
    }
  }

  render() {
    const { loading, content } = this.state;

    return (
      <div className="ReleaseNotes">
        <h1 className="ReleaseNotes__headline">
          {startCase(getBackofficeBrand().id)} CRM<br />Release notes
        </h1>
        <Choose>
          <When condition={loading}>
            <ShortLoader />
          </When>
          <Otherwise>
            <div
              className="ReleaseNotes__content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default ReleaseNotes;
