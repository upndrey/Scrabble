"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("./models/Users"));
// Encrypt options
const saltRounds = 10;
// Db setup
// associate();
// init();
// Express setup
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
var corsOptions = {
    credentials: true,
    origin: true,
    exposedHeaders: ['set-cookie']
};
app.use((0, cors_1.default)(corsOptions));
// Session setup
app.use((0, express_session_1.default)({
    resave: true,
    secret: '123456',
    cookie: {
        maxAge: 36000,
        secure: false,
    },
    saveUninitialized: true
}));
// Routing
app.post('/api/createLobby', async (req, res) => {
    console.log("test3", req.sessionID);
    if (req.session.login)
        console.log(req.session.login);
    res.status(200);
    res.json({});
    res.end();
});
app.post('/api/getUser', async (req, res) => {
    console.log("test1", req.sessionID);
    let status = 400;
    let login = "";
    if (req.session.login) {
        status = 200;
        login = req.session.login;
    }
    else {
        status = 422;
    }
    res.status(status);
    res.json({ login });
    res.end();
});
app.post('/api/login', async (req, res) => {
    console.log("test2", req.sessionID);
    let status = 400;
    try {
        const user = await Users_1.default.findOne({
            where: {
                login: req.body.login
            }
        });
        if (user) {
            const compareResult = await bcrypt_1.default.compare(req.body.password, user.password);
            if (compareResult) {
                req.session.login = user.login;
                status = 200;
            }
            else
                status = 422;
        }
        else
            status = 422;
    }
    catch (err) {
        status = 422;
    }
    finally {
        console.log(status);
        res.status(status);
        res.json({});
        res.end();
    }
});
app.post('/api/logout', async (req, res) => {
    let status = 200;
    req.session.destroy((err) => {
        status = 422;
    });
    console.log(status);
    res.status(status);
    res.json({});
    res.end();
});
app.post('/api/signup', async (req, res) => {
    let status = 400;
    const encryptedPassword = await bcrypt_1.default.hash(req.body.password, saltRounds);
    try {
        const user = await Users_1.default.findOrCreate({
            where: {
                login: req.body.login
            },
            defaults: {
                login: req.body.login,
                password: encryptedPassword
            }
        });
        if (user[1]) {
            status = 200;
            console.log(req.session);
            if (!req.session.login)
                req.session.login = req.body.login;
        }
        else {
            status = 422;
        }
    }
    catch (err) {
        console.log(err);
        status = 422;
    }
    finally {
        console.log(status);
        res.status(status);
        res.json({});
        res.end();
    }
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});
io.on("connection", (socket) => {
    // ...
    console.log('runningMessage');
});
httpServer.listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBSXhCLHNFQUFzQztBQUN0QyxvREFBNEI7QUFDNUIsMkRBQW1DO0FBRW5DLGtCQUFrQjtBQUNsQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFTdEIsV0FBVztBQUNYLGVBQWU7QUFDZixVQUFVO0FBRVYsZ0JBQWdCO0FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRXhCLElBQUksV0FBVyxHQUFHO0lBQ2hCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0lBQ1osY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQy9CLENBQUM7QUFDRixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFM0IsZ0JBQWdCO0FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQ0wsSUFBQSx5QkFBTyxFQUFDO0lBQ04sTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUM7UUFDTCxNQUFNLEVBQUMsS0FBSztRQUNaLE1BQU0sRUFBRSxLQUFLO0tBQ2Q7SUFDRCxpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUMsQ0FDSCxDQUFDO0FBR0YsVUFBVTtBQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxFQUFF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