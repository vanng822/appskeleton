var detect = function(app) {
	return function(req, res, next) {
		if(req.headers.hasOwnProperty("user-agent") && /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(req.headers["user-agent"])) {
			res.locals.isMobile = true;
		} else {
			res.locals.isMobile = false;
		}
		next();
	};
};

module.exports.detect = detect;
