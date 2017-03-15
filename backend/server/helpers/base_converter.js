var convertBase = require('bigint-base-converter');
var hexSet = '0123456789abcdef';
var base62Set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


module.exports = {
	hexToBase62: function(hex) {
		return convertBase(hex.toString().toLowerCase(), hexSet, base62Set);
	}
}