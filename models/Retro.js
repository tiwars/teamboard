var mongoose = require('mongoose');

// Create the RetroSchema.

var RetroSchema = new mongoose.Schema({
	feedback: {
		type: String,
		required: true
	},
	sessionId:{
		type: String,
		required: true
	},
	type:{
		type: String,
		required: true
	},
	user:{
		type: String,
		required: false	
	}

});

// Export the model.
var Feedback = module.exports = mongoose.model('retro', RetroSchema);

module.exports.addFeedback = function(newFeedback, callback){
	newFeedback.save(callback);
}

module.exports.getAllFeedback = function(callback){
	Feedback.find(callback);
}

module.exports.getFeedbackById = function(id, callback){
	Feedback.findById(id,callback);
}

module.exports.clearAllFeedback = function(callback){
	Feedback.remove({},callback);
}

module.exports.deleteFeedback = function(id, callback){
	Feedback.findByIdAndRemove(id,callback);
}

module.exports.updateFeedback = function(id, updatedFeedback, callback){
	Feedback.findByIdAndUpdate(id,{'feedback':updatedFeedback},callback);
}

module.exports.createOrUpdate = function(userName,sessionId, feedback, callback){
	Feedback.update({user:userName,sessionId:sessionId},feedback,{upsert:true,setDefaultsOnInsert:true},callback);
}