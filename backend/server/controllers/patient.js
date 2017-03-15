'use strict';

var mongodb = __mongodb;
var passport = require('passport');
var User = mongodb.model('user');
var Patient = mongodb.model('patient');

var async = require('async');
var usernameRegex = /^[a-z0-9_]{6,20}$/;

exports.checkPermission = function(req, res, next) {
	var _id = req.params.id;
	if (req.user.role === 'admin' || req.user.information_id == _id) {
		return next();
	}
	return res.status(400).send('ACCESS_DENIED');
}

exports.createPatient = function(req, res, next) {
	if (!req.user) {
		return res.status(401).send('ACCESS_DENIED');
	}

	if (req.user.information_id) {
		return res.status(400).send('PATIENT_HAD_EXISTS');
	}
	var body = req.body;

	var newPatient = {
		name: body.name,
		birthday: body.birthday,
		gender: body.gender,
		phone: body.phone,
		pastMedication: body.pastMedication,
		tags: body.tags,
		contacts: body.contacts || [{
			address: 					"",
			postalCode: 			"",
			email: 						"",
		}],
		profilePicture: body.profilePicture,
		plan: body.plan
	}

	Patient.create(newPatient, function(err, patient) {
		if (err) {
			return res.status(400).send(err);
		}
		console.log(req.user._id);
		User.update({
			_id: req.user._id
		}, {
			$set: {
				information_id: patient._id,
				dateModified: new Date().getTime()
			}
		}, function(err) {
			if (err) {
				return res.status(400).send(err);
			}
			return res.status(200).send(patient);
		})
	})
}

exports.updatePatient = function(req, res, next) {
	var _id = req.params.id;
	var updates = req.body.updates;
	if (!updates) {
		return res.status(400).send('UPDATES_REQUIRED');
	}
	Patient.findOne({
		_id: _id
	}, function(err, patient) {
		if (err) {
			return res.status(400).send('PATIENT_NOT_FOUND');
		}
		findOneAndUpdate(patient, updates, function(err, updatedPatient) {
			if (err) {
				return res.status(400).send('ERROR' + JSON.stringify(err));
			}
			return res.status(200).send(updatedPatient);
		})
	})
}

exports.getPatient = function(req, res, next) {
	var patient_id = req.params.id;
	Patient.findOne({
		_id: patient_id
	}, function(err, patient) {
		if (err) {
			return res.status(400).send('PLEASE_TRY_AGAIN');
		}
		if (!patient) {
			return res.status(400).send('PATIENT_NOT_FOUND');
		}
		return res.status(200).send(patient);
	})
}

exports.getPatients = function(req, res, next) {
	var conditions = safeParseJson(req.query.conditions) || {};
	var sort = safeParseJson(req.query.sort) || {};
	var limit = parseInt(req.query.limit) || 30;
	if (limit < 1 || limit > 30) limit = 30;
	var skip = parseInt(req.query.skip) || 0;
	if (skip < 0) skip = 0;
	var select = {
		name: 1,
		lastUpdatedTime: 1,
		profilePicture: 1,
		gender: 1,
		location: 1,
		status: 1,
		hospital: 1
	}

	Patient
		.find(conditions)
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.select(select)
		.exec(function(err, patients) {
			if (err) {
				return res.status(400).send('ERROR' + JSON.stringify(err));
			}
			return res.status(200).send(patients);
		})
}

function findOneAndUpdate(patientObj, updates, callback) {
	if (!patientObj) {
		return callback('PATIENT_NOT_FOUND');
	}

	var name = updates.name || patientObj.name || '';
	var phone = updates.phone || patientObj.phone || '';
	var valuesSearch = [patientObj._id, name, phone];
	console.log(updates.plans)
	updates['valuesSearch'] = valuesSearch;
	Patient.findOneAndUpdate({
		_id: patientObj._id
	}, {
		$set: updates
	},{
		new: true
	}, callback);
}

function safeParseJson(string) {
	try {
		var json = JSON.parse(string);
		return json;
	}
	catch (e) {
		console.log(e);
		return null;
	}
}