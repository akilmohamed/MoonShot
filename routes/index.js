exports.index = function(req, res){
  res.render('index', { 
    title: 'Moonshot',
    pagetitle: 'Hello there'
  });
};