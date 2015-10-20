function home(req, res, next) {
  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    hideNavSearch: true,
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'home_search'}
  });
}

module.exports = exports = {
  home : home
};
