var Schema = __mongodb.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var ObjectId = Schema.ObjectId;


var schema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
	role: {type: 			String, default: 'user'},
	type: {type: 			String, default: 'PATIENT'},
	status: {type: 		String, default: 'created'},
	dateCreated: 			Number,
	dateModifined: 		Number,
	information_id: {type: ObjectId, ref: 'patient'},
	facebookId: 			String,
	googleId: 				String,
	token: 						String
})

schema.pre('save', function(next) {
	var date = new Date().getTime();
  var user = this;
	if (user.isNew) {
		user.dateCreated = date;
	}
	user.dateModifined = date;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	var hash = bcrypt.hashSync(user.password, SALT_WORK_FACTOR);
	user.password = hash;
	return next();
});

schema.methods.authenticate = function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
};

schema.methods.userInfo = function() {
	return {
		_id: this._id,
		username: this.username,
		role: this.role,
		type: this.type,
		status: this.status,
		dateCreated: this.dateCreated,
		information_id: this.information_id
	}
}

module.exports = __mongodb.model('user', schema);