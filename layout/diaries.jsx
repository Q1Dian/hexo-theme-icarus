'use strict';

const moment = require('moment');
const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');

module.exports = class extends Component {
  render() {
    const { site, page, config, helper } = this.props;
    const { url_for, __, date } = helper;

    const language = toMomentLocale(page.lang || page.language || config.language);

    // 🔍 Filter diary pages and sort newest first
    const diaryPosts = site.pages
      .filter(p => p.path.startsWith('Diary/') && p.source !== page.source)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!diaryPosts.length) {
      return <p style={{ textAlign: 'center' }}>No diary entries yet.</p>;
    }

    // 📅 Group posts by date string (YYYY-MM-DD)
    const postsByDate = {};
    diaryPosts.forEach(post => {
      const day = moment(post.date).format('YYYY-MM-DD');
      if (!postsByDate[day]) postsByDate[day] = [];
      postsByDate[day].push(post);
    });

    // Sort dates newest first
    const sortedDates = Object.keys(postsByDate).sort((a, b) => new Date(b) - new Date(a));

    return (
      <Fragment>
        <h1 class="title" style={{ textAlign: 'center' }}>{page.title || 'Diary'}</h1>
        <h5>Replaces social media for me. </h5>
        {sortedDates.map(day => (
          <div class="card" key={day}>
            <div class="card-content">
              <h3 class="tag is-primary">{moment(day).locale(language).format('MMM D, YYYY')}</h3>
              <div class="timeline">
                {postsByDate[day].map(post => (
                  <div class="media" key={post.path}>
                    <div class="media-content">
                      <div class="content">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {page.total > 1 && (
          <Paginator
            current={page.current}
            total={page.total}
            baseUrl={page.base}
            path={config.pagination_dir}
            urlFor={url_for}
            prevTitle={__('common.prev')}
            nextTitle={__('common.next')}
          />
        )}
      </Fragment>
    );
  }
};
