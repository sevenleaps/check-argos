function home(req, res, next) {
  res.render('home', {
    title: 'Checkargos.com - An Irish Stock Checker',
    hideNavSearch: true,
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      home_search: 'home_search'}
  });
}

module.exports = exports = {
  home : home
};