var Schema = __mongodb.Schema;
var uuid = require('node-uuid');

var schema = new Schema({
	name: 							String,
	birthday: 					Date,
	gender: 						String,
	pastMedication: 		String,	
	phone: 							String,
	location: 					String,
	tags: {type: 				[String], index: true},
	contacts: [{
		address: 					String,
		postalCode: 			Number,
		email: 						String,
		status: {type: 		String, default: 'created'}
	}],
	valuesSearch: {type: [String], index: true},
	hospital: {type: 		String, index: true},
	plans	: {},
	status: {type: 			String, default: 'open'},
	dateCreated: 				Number,
	lastUpdatedTime: 		Number,
	profilePicture: 		String,
	metadata: {}
})


schema.pre('save', function(next) {
	var date = new Date().getTime();
	var _this = this;
	if (_this.isNew) {
		_this.dateCreated = date;
	}
	_this.lastUpdatedTime = date;
	_this.valuesSearch = [_this._id, _this.name, _this.phone]
	return next();
})

module.exports = __mongodb.model('patient', schema);