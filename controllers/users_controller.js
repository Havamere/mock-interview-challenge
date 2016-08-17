var user = function(req, res) {
	console.log(req.params)
	if (req.params.sign_in) {
		res.render('users/sign_in', {})
	} else if (req.params.new) {
		res.render('users/new', {})
	}
};

module.exports = user;