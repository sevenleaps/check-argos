function home(req, res, next) {
  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    partials : {
      common_head: 'common_head',
      common_scripts: 'common_scripts',
      navbar: 'navbar',
      content: 'about'}
  });
}

module.exports = exports = {
  home : home
};
