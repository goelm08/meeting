const express = require('express')
const http = require('http')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const path = require("path")
var xss = require("xss")
const fs = require('fs');
const request = require('request-promise');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require('helmet');
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require('./routes/users');
const { fa } = require('faker/lib/locales')

var server = http.createServer(app)
var io = require('socket.io')(server)

app.use(cors())
app.use(bodyParser.json())

// Constants
const {
	HOST,
	PORT,
	SESS_SECRET,
	NODE_ENV,
	IS_PROD,
	COOKIE_NAME
} = require("./config/config");
const { MongoURI } = require("./config/database");
const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours
// const IS_PROD = NODE_ENV === "production";



// Connecting to Database
mongoose
	.connect(MongoURI, {
		useNewUrlParser: true,
	})
	.then(() => console.log("MongoDB connected..."))
	.catch((err) => console.log(err));

// setting up connect-mongodb-session store
//   const mongoDBstore = new MongoDBStore({
// 	uri: MongoURI,
// 	collection: "mySessions"
//   });

// Express Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Morgan setup
app.use(morgan("dev"));

// Express-Session
app.use(
	session({
		name: COOKIE_NAME, //name to be put in "key" field in postman etc
		secret: SESS_SECRET,
		resave: true,
		saveUninitialized: false,
		//   store: mongoDBstore,
		cookie: {
			maxAge: MAX_AGE,
			sameSite: false,
			secure: IS_PROD
		}
	})
);

app.use(helmet())

//   // Below corsOptions are for Local development
//   const corsOptions = {
// 	origin: 'http://localhost:4001',
// 	credentials: true,
// 	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

//   // Below corsOptions work in deployment as Docker containers
//   const corsOptionsProd = {
// 	origin: 'http://localhost',
// 	credentials: true,
// 	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

// app.use(cors(corsOptions));

app.get("/", (req, res) => res.status(200).send({ message: "HELLO FRIEND" }));

// API / Routes;
// Uncomment Below for Development
app.use("/api/users", router);


if (process.env.NODE_ENV === 'production') {
	app.use(express.static(__dirname + "/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname + "/build/index.html"))
	})
}

app.set('port', (process.env.PORT || 4001))

sanitizeString = (str) => {
	return xss(str)
}
const socckets = new Map();
connections = {}
messages = {}
timeOnline = {}



io.on('connection', (socket) => {

	socket.on('join-call', (path) => {
		if (connections[path] === undefined) {
			connections[path] = []
		}
		connections[path].push(socket.id)

		timeOnline[socket.id] = new Date()

		for (let a = 0; a < connections[path].length; ++a) {
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
		}

		if (messages[path] !== undefined) {
			for (let a = 0; a < messages[path].length; ++a) {
				io.to(socket.id).emit("chat-message", messages[path][a]['data'],
					messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
			}
		}

		console.log(path, connections[path])
	})

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('audio_file', async (socketId, audioBlob) => {

		if (socckets.has(socketId) === false)
			socckets.set(socketId, 0);
		else
			socckets.set(socketId, socckets.get(socketId) + 1);
		fille = __dirname + '\\src\\videos\\' + socketId + socckets.get(socketId).toString() + '.webm';
		if (audioBlob.size === 0) return;
		fs.writeFileSync(fille, Buffer.from(new Uint8Array(audioBlob)));

		var options = {
			method: 'POST',
			uri: 'http://127.0.0.1:5010/arraysum',
			body: {
				fileName: fille,
				id: socketId,
				parallel: socckets.get(socketId)
			},
			json: true
		};
		var sendrequest = await request(options).then(function (parsedBody) {
			console.log(parsedBody);
			// let result = parsedBody['result'];
		}).catch(function (err) {
			console.log(err);
		});
		// console.log(audioBlob);
	});

	socket.on('chat-message', async (data, sender) => {
		data = sanitizeString(data)
		sender = sanitizeString(sender)

		var options = {
			method: 'POST',
			uri: 'http://127.0.0.1:5010/text',
			body: {
				text: data,
			},
			json: true
		};
		
		var exit = false;
		var sendrequest = await request(options).then(function (parsedBody) {
			console.log(parsedBody)
			if(parsedBody.result=== 'spam'){
				exit = true;
			}
		}).catch(function (err) {
			console.log(err);
		});
		if(exit)	return;
		var key, ok = false
		for (const [k, v] of Object.entries(connections)) {
			for (let a = 0; a < v.length; ++a) {
				if (v[a] === socket.id) {
					key = k
					ok = true
				}
			}
		}

		if (ok === true) {
			if (messages[key] === undefined) {
				messages[key] = []
			}
			messages[key].push({ "sender": sender, "data": data, "socket-id-sender": socket.id })
			console.log("message", key, ":", sender, data)

			for (let a = 0; a < connections[key].length; ++a) {
				io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
			}
			// io.to(connections[key][key]).emit("chat-message", data, sender, socket.id)

		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for (let a = 0; a < v.length; ++a) {
				if (v[a] === socket.id) {
					key = k

					for (let a = 0; a < connections[key].length; ++a) {
						io.to(connections[key][a]).emit("user-left", socket.id)
					}

					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					console.log(key, socket.id, Math.ceil(diffTime / 1000))

					if (connections[key].length === 0) {
						delete connections[key]
					}
				}
			}
		}
	})
})

server.listen(app.get('port'), () => {
	console.log("listening on", app.get('port'))
})