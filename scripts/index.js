/* global hexo */
const logger = require('hexo-log')();

/**
 * Print welcome message
 */
logger.info(`=======================================
 ██╗ ██████╗ █████╗ ██████╗ ██╗   ██╗███████╗
 ██║██╔════╝██╔══██╗██╔══██╗██║   ██║██╔════╝
 ██║██║     ███████║██████╔╝██║   ██║███████╗
 ██║██║     ██╔══██║██╔══██╗██║   ██║╚════██║
 ██║╚██████╗██║  ██║██║  ██║╚██████╔╝███████║
 ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
=============================================`);

/**
 * Check if all dependencies are installed
 */
require('../include/dependency')(hexo);

/**
 * Configuration file checking and migration
 */
require('../include/config')(hexo);

/**
 * Register Hexo extensions and remove Hexo filters that could cause OOM
 */
require('../include/register')(hexo);

hexo.extend.filter.register('before_post_render', function(data) {
  data.content = data.content.replace(
    /\{([^}]+)\}\(([^)]+)\)/g,
    function(match, text, footnote) {
      return `<span class="dfoot" data-footnote="${footnote}">${text}</span>`;
    }
  );
  return data;
});