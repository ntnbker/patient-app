module.exports = function(app) {
	require(__base + 'server/config/express')(app, {
		routes: require(__base + 'api/routes')
	});
}