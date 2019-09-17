const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'chatbotdb';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
app.use(urlencodedParser);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js', express.static(__dirname + '/js'));

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
	assert.equal(null, err);
	console.log('banco de dados conectado com sucesso.');

	db = client.db(dbName);
});

app.listen(3000);
console.log('servidor rodando em: localhost:3000');
//INTERFACE #########################################################################
app.get('/', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./home.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 0'});
	}
});
app.get('/home', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./home.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 0'});
	}
});
// Admin
app.get('/admin', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./admin.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 1'});
	}
});
app.post('/admin/search', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.user_name) objJSON.user_name = req.body.user_name; 
		else objJSON.user_name = false;
		if(req.body.password) objJSON.password = req.body.password; 
		else objJSON.password = false;

		findAdmin(objJSON, function(result) {
			if(result) res.send(result);
			else res.send({user_name: false, password: false});
		});
	}catch(e) {
		console.log({error: 'erro de requisição 2'});
	}
});
const findAdmin = function(objJSON, callback) {
	try {
		const collection = db.collection('admin');
		collection.findOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 3'});
	}
}
// -----
app.get('/login', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./login.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 4'});
	}
});
app.get('/index', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.query.user_name) objJSON.user_name = req.query.user_name; 
		else objJSON.user_name = false;
		if(req.query.password) objJSON.password = req.query.password; 
		else objJSON.password = false;

		findUserOne(objJSON, function(result) {
			if((result)&&(result.activate==1)) {
				let code_user = Number(result.code_user);
				res.set('Content-Type', 'text/html');
				const fs = require('fs');
				let data = fs.readFileSync('./index.html', 'utf8');
				data = data.replace('[code_user]', code_user);
				data = data.replace('[code_user]', code_user);
				data = data.replace('[code_user]', code_user);
				res.send(data);	
			}else {
				res.set('Content-Type', 'text/html');
				const fs = require('fs');
				const data = fs.readFileSync('./login.html', 'utf8');
				res.send(data);
			}
		});
	}catch(e) {
		console.log({error: 'erro de requisição 5'});
	}
});
app.post('/user/search', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.user_name) objJSON.user_name = req.body.user_name; 
		else objJSON.user_name = false;
		if(req.body.password) objJSON.password = req.body.password; 
		else objJSON.password = false;

		findUserOne(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 6'});
	}
});
const findUserOne = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		collection.findOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 7'});
	}
}
app.post('/documents/find', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); 
		else objJSON.code_user = -1;
		if(req.body.activate) objJSON.activate = Number(req.body.activate); 
		else objJSON.activate = 1;

		findDocuments(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 8'});
	}
});
const findDocuments = function(objJSON, callback) {
	try {
		const collection = db.collection('documents');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 9'});
	}
}
// Janela do Chatbot
app.get('/chatbot', urlencodedParser, function(req, res) {
	try {
		let code_user = -1;
		if(req.query.code_user) code_user = Number(req.query.code_user);

		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		let data = fs.readFileSync('./chatbot.html', 'utf8');
		data = data.replace('[code_user]', code_user);
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 10'});
	}
});
//###################################################################################

app.post('/user/insert', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = cod();
		if(objJSON.code_user<=0) objJSON.code_user = cod();
		if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
		if(req.body.full_name) objJSON.full_name = req.body.full_name; else objJSON.full_name = '';
		if(req.body.user_name) objJSON.user_name = req.body.user_name; else objJSON.user_name = '';
		if(req.body.email) objJSON.email = req.body.email; else objJSON.email = '';
		if(req.body.password) objJSON.password = req.body.password; else objJSON.password = '';

		insertUser(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 11'});
	}
});

app.post('/user/update', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.full_name) objJSON.full_name = req.body.full_name;
		if(req.body.user_name) objJSON.user_name = req.body.user_name;
		if(req.body.email) objJSON.email = req.body.email;
		if(req.body.password) objJSON.password = req.body.password;

		updateUser(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 12'});
	}
});

app.post('/user/delete', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.full_name) objJSON.full_name = req.body.full_name;
		if(req.body.user_name) objJSON.user_name = req.body.user_name;
		if(req.body.email) objJSON.email = req.body.email;
		if(req.body.password) objJSON.password = req.body.password;

		deleteUser(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 13'});
	}
});

app.post('/user/find', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.full_name) objJSON.full_name = req.body.full_name;
		if(req.body.user_name) objJSON.user_name = req.body.user_name;
		if(req.body.email) objJSON.email = req.body.email;
		if(req.body.password) objJSON.password = req.body.password;

		findUser(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 14'});
	}
});

app.post('/user/activate/true', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

		activateUserTrue(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 15'});
	}
});

app.post('/user/activate/false', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

		activateUserFalse(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 16'});
	}
});

app.post('/user/delete/all', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;

		deleteUserAll(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 17'});
	}
});

app.post('/chatbot/insert', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;
		if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current); else objJSON.code_current = cod();
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation); else objJSON.code_relation = 0;
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before); else objJSON.code_before = 0;
		if(req.body.input) objJSON.input = req.body.input; else objJSON.input = '';
		if(req.body.output) objJSON.output = req.body.output; else objJSON.output = 'Desculpe, mas não entendi.';

		insertData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 18'});
	}
});

function cod() {
	try {
		const data = new Date();
		const ano = data.getFullYear();
		const mes = data.getMonth();
		const dia = data.getDate();
		const hora = data.getHours();
		const minuto = data.getMinutes();
		const segundo = data.getSeconds();
		const milesegundos = data.getMilliseconds();
		const result = Number(parseFloat(Number(ano+''+mes+''+dia+''+hora+''+minuto+''+segundo+''+milesegundos)/2).toFixed(0));
		return result;
	}catch(e) {
		return 0;
	}
}

app.post('/chatbot/update', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		updateData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 19'});
	}
});

app.post('/chatbot/delete', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		deleteData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 20'});
	}
});

app.post('/chatbot/find', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		findData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 21'});
	}
});

const insertUser = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		collection.insertOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 22'});
	}
}

const updateUser = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		const code_user = objJSON.code_user;
		collection.updateOne({code_user: code_user}, {$set: objJSON}, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 23'});
	}
}

const deleteUser = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		collection.deleteOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 24'});
	}
}

const findUser = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 25'});
	}
}

const activateUserTrue = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		const code_user = Number(objJSON.code_user);
		collection.updateOne({code_user: code_user}, {$set: {activate: 1}});
		collection = db.collection('documents');
		collection.updateMany({code_user: code_user}, {$set: {activate: 1}});
		collection = db.collection('chatbot');
		collection.updateMany({code_user: code_user}, {$set: {activate: 1}}, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 26'});
	}
}

const activateUserFalse = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		const code_user = Number(objJSON.code_user);
		collection.updateOne({code_user: code_user}, {$set: {activate: 0}});
		collection = db.collection('documents');
		collection.updateMany({code_user: code_user}, {$set: {activate: 0}});
		collection = db.collection('chatbot');
		collection.updateMany({code_user: code_user}, {$set: {activate: 0}}, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 27'});
	}
}

const deleteUserAll = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.deleteMany(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 28'});
	}
}

const insertData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.insertOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 29'});
	}
}

const updateData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		const code_current = objJSON.code_current;
		collection.updateOne({code_current: code_current}, {$set: objJSON}, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 30'});
	}
}

const deleteData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.deleteOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 31'});
	}
}

const findData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 32'});
	}
}

app.get('/chatbot/question', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.query.code_user) objJSON.code_user = Number(req.query.code_user); else objJSON.code_user = 0;
		if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
		if(req.query.code_before) objJSON.code_before = Number(req.query.code_before); else objJSON.code_before = 0;
		if(req.query.input) objJSON.input = req.query.input; else objJSON.input = '';

		questionData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 33'});
	}
});

const questionData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			if(result.length<=0) {
				let code_before = Number(objJSON.code_before);
				let objFind = {};
				if(code_before>0) {
					objFind = {
						code_user: Number(objJSON.code_user),
						code_relation: code_before
					};
				}else {
					objFind = {
						code_user: Number(objJSON.code_user)
					};
				}
				collection.find(objFind).toArray(function(err, result) {
					assert.equal(null, err);
					if(result.length<=0) {
						const questionUser = abreviacoes(objJSON.input);
						collection.find({code_user: Number(objJSON.code_user)}).toArray(function(err, result) {
							result = nlp(questionUser, result, Number(objJSON.code_user));
							callback(result);
						});
					}else {
						const questionUser = abreviacoes(objJSON.input);
						result = nlp(questionUser, result, Number(objJSON.code_user));
						callback(result);					
					}
				});
			}else callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 34'});
	}
}

const abreviacoes = function(Input='') {
	try {
		Input = Input.toString().trim();
		let result = Input.replace(/ vc /g, 'você');
		result = result.replace(/ tb /g, 'também');
		result = result.replace(/ oq /g, 'o que');
		result = result.replace(/ dq /g, 'de que');
		result = result.replace(/ td /g, 'tudo');
		result = result.replace(/ pq /g, 'por quê');
		result.toString().trim();
		return result;
	}catch(e) {
		return Input;
		console.log({error: 'erro de requisição 35'});
	}
}

const nlp = function(question='', array=[], code_user=-1) {
	let originalQuestion = question.toString().trim();
	try {
		let findInput = 0;
		let findIndex = 0;

		let documents = getDocuments(originalQuestion, code_user);
		if(documents) {
			return [{
						"_id": "0",
						"code_user": code_user,
						"activate": 1,
						"code_current": -1,
						"code_relation": -1,
						"code_before": -1,
						"input": originalQuestion,
						"output": "Ok! Entendido."		
					}];
		}else {
			for(let i=0; i<array.length; i++) {
				question = question.toString().trim();
				let input = array[i].input.toString().trim();
				if(input.length<=0) input = array[i].output.toString().trim();
				question = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
				input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
				question = question.replace(/[^a-zA-Z0-9\s]/g, '');
				input = input.replace(/[^a-zA-Z0-9\s]/g, '');

				let tokenizationQuestion = question.split(' ');
				let tokenizationInput = input.split(' ');

				tokenizationQuestion = tokenizationQuestion.map(function(e) {
					if(e.length>3) return e.substr(0, e.length-3); else return e;
				});
				tokenizationInput = tokenizationInput.map(function(e) {
					if(e.length>3) return e.substr(0, e.length-3); else return e;
				});

				let words = 0;
				for(let x=0; x<tokenizationQuestion.length; x++) {
					if(tokenizationInput.indexOf(tokenizationQuestion[x])>=0) words++;
				}
				if(words>findInput) {
					findInput = words;
					findIndex = i;
				}
			}

			if(findInput>0) return [{
				"_id": array[findIndex]._id,
				"code_user": array[findIndex].code_user,
				"activate": array[findIndex].activate,
				"code_current": array[findIndex].code_current,
				"code_relation": array[findIndex].code_relation,
				"code_before": array[findIndex].code_before,
				"input": originalQuestion,
				"output": array[findIndex].output
			}];
			else return [{
				"_id": "0",
				"code_user": array[findIndex].code_user,
				"activate": array[findIndex].activate,
				"code_current": array[findIndex].code_current,
				"code_relation": array[findIndex].code_relation,
				"code_before": array[findIndex].code_before,
				"input": originalQuestion,
				"output": "Desculpe, mas não sei te responder."		
			}];
		}
	}catch(e) {
			return [{
				"_id": "0",
				"code_user": code_user,
				"activate": 0,
				"code_current": 0,
				"code_relation": 0,
				"code_before": 0,
				"input": originalQuestion,
				"output": "Desculpe, mas não sei te responder."		
			}];		
	}
}

const getDocuments = function(question='', code_user=-1) {
	try {
		question = question.toString().trim();

		let _nome = getName(question);
		let _idade = getYears(question);
		let _email = '';
		let _celular = '';
		let _telefone = '';
		let _cep = '';
		let _endereco = getEndereco(question);
		let _bairro = getBairro(question);
		let _numero = '';
		let _cpf = '';
		let _cnpj = '';

		const questionTokens = question.split(' ');
		for(let i=0; i<questionTokens.length; i++) {
			let word = questionTokens[i].toString().trim();

			if(word.length>=1) {
				if(_email.length<=0) _email = email(word);
				if(_celular.length<=0) _celular = celular(word);
				if(_telefone.length<=0) _telefone = telefone(word);
				if(_cep.length<=0) _cep = cep(word);
				if(_numero.length<=0) _numero = numero(word, question);
				if(_cpf.length<=0) _cpf = cpf(word);
				if(_cnpj.length<=0) _cnpj = cnpj(word);
			}
		}

		let objJSON = {};
		if(code_user>0) objJSON.code_user = code_user; else objJSON.code_user = -1;
		if(_nome.length>0) objJSON.nome = _nome; else objJSON.nome = '';
		if(_idade.length>0) objJSON.idade = Number(_idade); else objJSON.idade = '';
		if(_email.length>0) objJSON.email = _email; else objJSON.email = '';
		if(_celular.length>0) objJSON.celular = Number(_celular); else objJSON.celular = '';
		if(_telefone.length>0) objJSON.telefone = Number(_telefone); else objJSON.telefone = '';
		if(_cep.length>0) objJSON.cep = Number(_cep); else objJSON.cep = '';
		if(_endereco.length>0) objJSON.endereco = _endereco; else objJSON.endereco = '';
		if(_bairro.length>0) objJSON.bairro = _bairro; else objJSON.bairro = '';
		if(_numero.length>0) objJSON.numero = Number(_numero); else objJSON.numero = '';
		if(_cpf.length>0) objJSON.cpf = Number(_cpf); else objJSON.cpf = '';
		if(_cnpj.length>0) objJSON.cnpj = Number(_cnpj); else objJSON.cnpj = '';
		objJSON.activate = 1;

		if((_nome.length>0)||
		   (_idade.length>0)||
		   (_email.length>0)||
		   (_celular.length>0)||
		   (_telefone.length>0)||
		   (_cep.length>0)||
		   (_endereco.length>0)||
		   (_bairro.length>0)||
		   (_numero.length>0)||
		   (_cpf.length>0)||
		   (_cnpj.length>0)) {
			const collection = db.collection('documents');
			collection.insertOne(objJSON);
			return true;
		}else return false;
	}catch(e) {
		return false;
		console.log({error: 'erro de requisição 36'});
	}
}

const defaultName = function(question='') {
	try {
		let nome = '';
		const fs = require('fs');
		const data = fs.readFileSync('./names.csv', 'utf8');
		const names = data.toString().trim().split(',');
		let tempName = '';
		let tempIndex = Infinity;
		for(let i=0; i<names.length; i++) {
			let name = names[i].toString().trim();
			let indexStart = question.indexOf(name);
			if(indexStart>=0) {
				if((name!=tempName)&&(indexStart<tempIndex)) {
					tempName = name;
					tempIndex = indexStart;

					let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
					let index2 = question.indexOf(' é '); if((index2<0)||(index2<indexStart)) index2 = Infinity;
					let index3 = question.indexOf(','); if((index3<0)||(index3<indexStart)) index3 = Infinity;
					let index4 = question.indexOf(';'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
					let index5 = question.indexOf('.'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
					let indexEnd = [
						Math.abs(index1-indexStart),
						Math.abs(index2-indexStart),
						Math.abs(index3-indexStart),
						Math.abs(index4-indexStart),
						Math.abs(index5-indexStart)
					].sort((a, b) => a - b)[0]+indexStart;
					if(indexEnd<indexStart) indexEnd = question.length;
					if(indexEnd<0) indexEnd = question.length;
					nome = question.substring(indexStart, indexEnd);
					nome = nome.replace(/ é /g, '');
					nome = nome.replace(/:/g, '');
					nome = nome.replace(/[0-9]/g, '').trim();

					if(nome.indexOf(' e ')>0) {
						nome = nome.split(' e ');
						nome = nome[0].toString().trim();
					}
					if(nome.indexOf(' é ')>0) {
						nome = nome.split(' é ');
						nome = nome[0].toString().trim();
					}
					if(nome.indexOf(',')>0) {
						nome = nome.split(',');
						nome = nome[0].toString().trim();
					}
					if(nome.indexOf(';')>0) {
						nome = nome.split(';');
						nome = nome[0].toString().trim();
					}
					if(nome.indexOf('.')>0) {
						nome = nome.split('.');
						nome = nome[0].toString().trim();
					}			
				}
			}
		}
		return nome.trim();
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 37'});
	}
}

const getName = function(question='') {
	try {
		question = question.toString().trim();
		let nome = '';
		let Default = defaultName(question);
		if(Default.length<=0) {
			let start = '';
			if(question.indexOf('Nome')>=0) start = 'Nome';
			if(question.indexOf('nome')>=0) start = 'nome';
			if(question.indexOf('chamo')>=0) start = 'chamo';

			if((start.length>0)&&(question.indexOf('seu')<0)) {
				let indexStart = question.indexOf(start)+start.length+1;

				let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
				let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
				let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
				let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
				let indexEnd = [
					Math.abs(index1-indexStart),
					Math.abs(index2-indexStart),
					Math.abs(index3-indexStart),
					Math.abs(index4-indexStart)
				].sort((a, b) => a - b)[0]+indexStart;
				if(indexEnd<indexStart) indexEnd = question.length;
				nome = question.substring(indexStart, indexEnd);
				nome = nome.replace(/ é /g, '');
				nome = nome.replace(/:/g, '');
				nome = nome.replace(/[0-9]/g, '').trim();

				if(nome.indexOf(' e ')>0) {
					nome = nome.split(' e ');
					nome = nome[0].toString().trim();
				}
				if(nome.indexOf(',')>0) {
					nome = nome.split(',');
					nome = nome[0].toString().trim();
				}
				if(nome.indexOf(';')>0) {
					nome = nome.split(';');
					nome = nome[0].toString().trim();
				}
				if(nome.indexOf('.')>0) {
					nome = nome.split('.');
					nome = nome[0].toString().trim();
				}
			}
		}else nome = Default;
		return nome;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 38'});
	}
}

const getYears = function(question='') {
	try {
		question = question.toString().trim();
		question = question.replace(/[^0-9a-zA-Z\s]/g, '');
		let idade = '';
		if(question.indexOf('anos')>0) {
			let arr = question.split(' ');
			let anos = arr[arr.indexOf('anos')-1];
			if((Number(anos)>0)&&(Number(anos)<125)) idade = anos;
		}
		return idade;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 39'});
	}
}

const email = function(_email='') {
	try {
		_email = _email.toString().trim();
		_email = _email.replace(/[^0-9a-zA-Z@.-_]/g, '');
		if((_email.indexOf('@')>0)&&(_email.indexOf('.')>0)&&(_email.length>=5)) {
			let c = _email.charAt(_email.length-1);
			if(c=='.') _email = _email.substring(0, _email.length-1);
			return _email;
		}
		else return '';
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 40'});
	}
}

const celular = function(_celular='') {
	try {
		_celular = _celular.toString().trim();
		_celular = _celular.replace(/[^0-9]/g, '');
		if(_celular.indexOf('55')==0) _celular = _celular.replace('55', '');
		let _cpf = cpf(_celular);
		if((_celular.length==11)&&(_cpf.length<=0)&&(_celular.indexOf('9')>0)) return _celular;
		else return '';
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 41'});
	}
}

const telefone = function(_telefone='') {
	try {
		_telefone = _telefone.toString().trim();
		_telefone = _telefone.replace(/[^0-9]/g, '');
		if(_telefone.indexOf('55')==0) _telefone = _telefone.replace('55', '');
		if(_telefone.length==10) return _telefone;
		else return '';
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 42'});
	}
}

const cep = function(_cep='') {
	try {
		_cep = _cep.toString().trim();
		_cep = _cep.replace(/[^0-9]/g, '');
		if(_cep.length!=8) return '';
		else return _cep;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 43'});
	}
}

const getEndereco = function(question='') {
	try {
		question = question.toString().trim();
		let endereco = '';
		let start = '';
		if(question.indexOf('Endereço')>=0) start = 'Endereço';
		if(question.indexOf('Rua')>=0) start = 'Rua';
		if(question.indexOf('R.')>=0) start = 'R.';
		if(question.indexOf('Avenida')>=0) start = 'Avenida';
		if(question.indexOf('Av.')>=0) start = 'Av.';
		if(question.indexOf('Travessa')>=0) start = 'Travessa';

		if(start.length>0) {
			let indexStart = question.indexOf(start);

			let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
			let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
			let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
			let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
			let index5 = question.indexOf('-'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
			let indexEnd = [
				Math.abs(index1-indexStart),
				Math.abs(index2-indexStart),
				Math.abs(index3-indexStart),
				Math.abs(index4-indexStart),
				Math.abs(index5-indexStart)
			].sort((a, b) => a - b)[0]+indexStart;
			if(indexEnd<indexStart) indexEnd = question.length;
			endereco = question.substring(indexStart, indexEnd);
			endereco = endereco.replace(/ é /g, '').trim();

			let carac = '';
			index1 = endereco.indexOf(' e '); if(index1>=0) carac = ' e ';
			index2 = endereco.indexOf(','); if(index2>=0) carac = ',';
			index3 = endereco.indexOf(';'); if(index3>=0) carac = ';';
			index4 = endereco.indexOf('.'); if(index4>=0) carac = '.';
			index5 = endereco.indexOf('-'); if(index5>=0) carac = '-';
			let arrEndereco = endereco.split(carac);
			endereco = arrEndereco[0].toString().trim();
		}
		return endereco;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 44'});
	}
}

const getBairro = function(question='') {
	try {
		question = question.toString().trim();
		let bairro = '';
		let start = '';
		if(question.indexOf('Bairro')>=0) start = 'Bairro';

		if(start.length>0) {
			let indexStart = question.indexOf(start)+start.length+1;

			let index1 = question.indexOf(' e '); if((index1<0)||(index1<indexStart)) index1 = Infinity;
			let index2 = question.indexOf(','); if((index2<0)||(index2<indexStart)) index2 = Infinity;
			let index3 = question.indexOf(';'); if((index3<0)||(index3<indexStart)) index3 = Infinity;
			let index4 = question.indexOf('.'); if((index4<0)||(index4<indexStart)) index4 = Infinity;
			let index5 = question.indexOf('-'); if((index5<0)||(index5<indexStart)) index5 = Infinity;
			let indexEnd = [
				Math.abs(index1-indexStart),
				Math.abs(index2-indexStart),
				Math.abs(index3-indexStart),
				Math.abs(index4-indexStart),
				Math.abs(index5-indexStart)
			].sort((a, b) => a - b)[0]+indexStart;
			if(indexEnd<indexStart) indexEnd = question.length;
			bairro = question.substring(indexStart, indexEnd);
			bairro = bairro.replace(/:/g, '')
			bairro = bairro.replace(/ é /g, '').trim();

			let carac = '';
			index1 = bairro.indexOf(' e '); if(index1>=0) carac = ' e ';
			index2 = bairro.indexOf(','); if(index2>=0) carac = ',';
			index3 = bairro.indexOf(';'); if(index3>=0) carac = ';';
			index4 = bairro.indexOf('.'); if(index4>=0) carac = '.';
			index5 = bairro.indexOf('-'); if(index5>=0) carac = '-';
			let arrBairro = bairro.split(carac);
			bairro = arrBairro[0].toString().trim();
		}
		return bairro;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 45'});
	}
}

const numero = function(_numero='', question='') {
	try {
		let Numero = '';
		let idade = getYears(question);
		Numero = _numero.toString().trim();
		Numero = Numero.replace(/[^0-9]/g, '');
		if((Numero.length>=1)&&(Numero.length<=4)&&(Numero!=idade)) return Numero;
		else return '';
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 46'});
	}
}

const cpf = function(_cpf='') { // 46395485083
	try {
		_cpf = _cpf.toString().trim().replace(/\D/g, '');
		if(_cpf.toString().length != 11) return '';
		let result = _cpf;
		[9, 10].forEach(function(j) {
			let soma = 0, r;
			_cpf.split('').splice(0, j).forEach(function(e, i) {
				soma += parseInt(e) * ((j+2)-(i+1));
			});
			r = soma % 11;
			r = (r < 2) ? 0 : 11 - r;
			if(r != _cpf.substring(j, j+1)) result = '';
		});
		return result;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 47'});
	}
}

const cnpj = function(_cnpj='') { // 31835728000167
	try {
		_cnpj = _cnpj.toString().trim().replace(/[^\d]+/g, '');
		if(_cnpj=='') return '';
		if(_cnpj.length!=14) return '';

		if(_cnpj == '00000000000000' ||
		   _cnpj == '11111111111111' ||
		   _cnpj == '22222222222222' ||
		   _cnpj == '33333333333333' ||
		   _cnpj == '44444444444444' ||
		   _cnpj == '55555555555555' ||
		   _cnpj == '66666666666666' ||
		   _cnpj == '77777777777777' ||
		   _cnpj == '88888888888888' ||
		   _cnpj == '99999999999999')
		   return '';

		let tamanho = _cnpj.length-2;
		let numeros = _cnpj.substring(0, tamanho);
		let digitos = _cnpj.substring(tamanho);
		let soma = 0;
		let pos = tamanho-7;
		for(let i=tamanho; i>=1; i--) {
			soma += numeros.charAt(tamanho-i) * pos--;
			if(pos<2) pos=9;
		}
		let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if(resultado != digitos.charAt(0)) return '';
		tamanho = tamanho+1;
		numeros = _cnpj.substring(0, tamanho);
		soma = 0;
		pos = tamanho-7;
		for(let i=tamanho; i>=1; i--) {
			soma += numeros.charAt(tamanho-i) * pos--;
			if(pos<2) pos=9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if(resultado != digitos.charAt(1)) return '';

		return _cnpj;
	}catch(e) {
		return '';
		console.log({error: 'erro de requisição 48'});
	}
}
