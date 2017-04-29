var express = require('express');
var Handlebars = require('handlebars');

var router = express.Router();
var Feedback = require('../models/Retro');
// Get Homepage

router.get('/', function(req, res){
	Feedback.getAllFeedback(function(err, list){
		if(err) throw err;
		res.render('index',{
			feedback:list,
			sessionId:req.sessionID,
			helpers:{
				breaklines: function (text) {
					text = Handlebars.Utils.escapeExpression(text);
					text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
					return new Handlebars.SafeString(text);
				},
				compare :function(lvalue, rvalue, options){
					if( lvalue!=rvalue ) {
				        return options.inverse(this);
				    } else {
				        return options.fn(this);
				    }
				}
			}
		});
	});

});

router.delete('/', function(req, res){
	var password = req.body.password;
	if(password !== "tiwars"){
		res.json({'status':'404 page not found!'})
		return;
	}

	Feedback.clearAllFeedback(function(err, list){
		if(err) throw err;
		req.io.sockets.emit('refresh',{});
		res.json({'status':'success'})
	});

});


router.delete('/:id', function(req, res){

	Feedback.getFeedbackById(req.params.id, function(err, item){
		if(err) throw err;
		
		if(item.sessionId !== req.sessionID){
			res.redirect('/');
			return;
		}

		Feedback.deleteFeedback(req.params.id, function(err, msg){
			if(err) throw err;
			req.io.sockets.emit('refresh',{});
			res.redirect('/');
		});	
		
	});
	

});

router.post('/xedit/:id', function(req, res){
	// var feedback = req.body.value;
	var feedback = req.sanitize('value').trim();
	req.checkBody('value','Feedback is required').notEmpty();

	var error = req.validationErrors();
	if(error){
		res.redirect('/');
		return;
	}

	Feedback.getFeedbackById(req.params.id, function(err, item){
		if(err) throw err;

		if(item.sessionId !== req.sessionID || item.type === 'number'){

			res.json({status:'fail'});
			return;
		}

		Feedback.updateFeedback(req.params.id, feedback, function(err,feedback){
			if(err) throw err;
			req.io.sockets.emit('refresh',{});
			res.redirect('/');
		});
	});
	
});

router.post('/', function(req, res){
	var feedback = req.body.feedback;

	// feedback = req.sanitize('feedback').escape();
	feedback = req.sanitize('feedback').trim();
	req.checkBody('feedback','Feedback is required').notEmpty();

	var error = req.validationErrors();
	if(error){
		res.redirect('/');
		return;
	}

	var newFeedback = new Feedback({
		feedback: feedback,
		sessionId: req.sessionID,
		type:'texts',
		// user:'Anonymous'
	});

	Feedback.addFeedback(newFeedback, function(err,feedback){
		if(err) throw err;
		// console.log(feedback);
		req.io.sockets.emit('refresh',{});
		res.redirect('/');
	});
	
});

router.post('/points', function(req, res){
	//valid poists array
	var points=["1","2","3","5","8","13","20","40","?"];
	var feedback = req.body.feedback;
	// feedback = req.sanitize('feedback').escape();
	feedback = req.sanitize('feedback').trim();
	req.checkBody('feedback','Feedback is required').notEmpty();
	
	var error = req.validationErrors();
	if(error || points.indexOf(feedback) === -1){
		res.redirect('/');
		return;
	}
	
	var newFeedback = new Feedback({
		feedback: feedback,
		sessionId: req.sessionID,
		type:'number',
		user:req.body.user
	}).toObject();

	delete newFeedback._id;

	Feedback.createOrUpdate(req.body.user, req.sessionID, newFeedback, function(err,feedback){
		if(err) throw err;
		// console.log(feedback);
		req.io.sockets.emit('refresh',{});
		res.redirect('/');
	});
	
});

module.exports = router;