function home(req, res, next) {
  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'about'}
  });
}

module.exports = exports = {
  home : home
};