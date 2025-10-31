'use strict';

const moment = require('moment');
const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');
const ArticleMedia = require('hexo-component-inferno/lib/view/common/article_media');

module.exports = class extends Component {
  render() {
    const { site, config, page, helper } = this.props;
    const { url_for, __, date_xml, date } = helper;

    const language = toMomentLocale(page.lang || page.language || config.language);

    // 🔍 Filter posts that are inside `source/diary/`
    const diaryPosts = site.pages.filter(p => p.path.startsWith('Diary/') && p.source !== page.source);
    if (diaryPosts.length === 0) {
      return <p style={{ textAlign: 'center' }}>No diary entries yet.</p>;
    }

    function renderArticleList(posts, year, month = null) {
      const time = moment([year, month ? month - 1 : null].filter(i => i !== null));
      return (
        <div class="card">
          <div class="card-content">
            <h3 class="tag is-primary">
              {month === null
                ? year
                : time.locale(language).format('MMMM YYYY')}
            </h3>
            <div class="timeline">
              {posts.map(post => (
                <ArticleMedia
                  url={url_for(post.link || post.path)}
                  title={post.title}
                  date={date(post.date)}
                  dateXml={date_xml(post.date)}
                  categories={[]} // diaries usually don’t need categories
                  thumbnail={post.thumbnail ? url_for(post.thumbnail) : null}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 📅 Group by year/month
    const years = {};
    diaryPosts.forEach(p => {
      const y = p.date.year();
      const m = p.date.month() + 1;
      if (!years[y]) years[y] = {};
      if (!years[y][m]) years[y][m] = [];
      years[y][m].push(p);
    });

    const articleList = Object.keys(years)
      .sort((a, b) => b - a)
      .map(year =>
        Object.keys(years[year])
          .sort((a, b) => b - a)
          .map(month => renderArticleList(years[year][month], year, month))
      );

    return (
      <Fragment>
        <h1 class="title" style={{ textAlign: 'center' }}>{page.title || 'Diary'}</h1>
        {articleList}
        {/* optional pagination (not needed unless you have >100 diary pages) */}
        {page.total > 1 ? (
          <Paginator
            current={page.current}
            total={page.total}
            baseUrl={page.base}
            path={config.pagination_dir}
            urlFor={url_for}
            prevTitle={__('common.prev')}
            nextTitle={__('common.next')}
          />
        ) : null}
      </Fragment>
    );
  }
};
