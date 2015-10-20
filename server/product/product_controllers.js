function product(req, res, next) {
  res.render('product', {
    title: 'Title',
    body: 'Test'
  });
}

module.exports = exports = {
  product : product
};
