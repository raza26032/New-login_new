var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var path = require("path")
var jwt = require('jsonwebtoken')
var { userModel, tweetModel } = require('./dbconn/modules');
var app = express();
var authRoutes = require('./routes/auth')
var SERVER_SECRET = process.env.SECRET || "1234";
var http = require("http");
var socketIO = require("socket.io");
var server = http.createServer(app);
var io = socketIO(server);

io.on("connection", () => {
    console.log("user connected");
})

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));
app.use("/", express.static(path.resolve(path.join(__dirname, "public"))))

app.use('/', authRoutes);
app.use(function (req, res, next) {
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

// app.get("/profile", (req, res, next) => {

//     console.log(req.body)

//     userModel.findById(req.body.jToken.id, 'name email phone gender createdOn',
//         function (err, doc) {
//             if (!err) {
//                 res.send({
//                     status: 200,
//                     profile: doc
//                 })

//             } else {
//                 res.status(500).send({
//                     message: "server error"
//                 })
//             }
//         })
// })

// app.post('/tweet', (req, res, next) => {
//     if (!req.body.userName && !req.body.tweet) {
//         res.status(403).send({
//             message: "please provide email or tweet"
//         })
//     }
//     console.log(req.body.userName)
//     var newTweet = new tweetModel({
//         "name": req.body.userName,
//         "tweets": req.body.tweet
//     })
//     newTweet.save((err, data) => {
//         if (!err) {
//             res.send({
//                 status: 200,
//                 message: "Post created",
//                 data: data
//             })
//             console.log(data.tweets)
//             io.emit("NEW_POST", data)
//         } else {
//             console.log(err);
//             res.status(500).send({
//                 message: "user create error, " + err
//             })
//         }
//     });
// })

// app.get('/getTweets', (req, res, next) => {

//     tweetModel.find({}, (err, data) => {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             console.log(data)
//             res.send(data)
//         }
//     })
// })


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})