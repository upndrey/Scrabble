"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const Lobbies_1 = __importDefault(require("./models/Lobbies"));
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
    let status = 400;
    const encryptedPassword = await bcrypt_1.default.hash(req.body.password, saltRounds);
    try {
        const lobby = await Lobbies_1.default.create({
            host_id: req.session.user.id,
            name: req.body.name,
            is_private: req.body.is_private,
            max_players: req.body.max_players,
            password: encryptedPassword
        });
        req.session.lobby = lobby;
        status = 200;
    }
    catch (err) {
        status = 422;
    }
    finally {
        res.status(status);
        res.json({});
    }
});
app.post('/api/getUser', async (req, res) => {
    let status = 400;
    let login = "";
    if (req.session.user) {
        status = 200;
        login = req.session.user.login;
    }
    else {
        status = 422;
    }
    res.status(status);
    res.json({ login });
});
app.post('/api/login', async (req, res) => {
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
                req.session.user = user;
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
        res.status(status);
        res.json({});
    }
});
app.post('/api/logout', async (req, res) => {
    let status = 200;
    req.session.destroy((err) => {
        status = 422;
    });
    res.status(status);
    res.json({});
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
            if (!req.session.user)
                req.session.user = user[0];
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
        res.status(status);
        res.json({});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBR3hCLCtEQUF1QztBQUN2QyxzRUFBc0M7QUFDdEMsb0RBQTRCO0FBQzVCLDJEQUFtQztBQUVuQyxrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBVXRCLFdBQVc7QUFDWCxlQUFlO0FBQ2YsVUFBVTtBQUVWLGdCQUFnQjtBQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN6QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM5QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV4QixJQUFJLFdBQVcsR0FBRztJQUNoQixXQUFXLEVBQUUsSUFBSTtJQUNqQixNQUFNLEVBQUUsSUFBSTtJQUNaLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQztDQUMvQixDQUFDO0FBQ0YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTNCLGdCQUFnQjtBQUNoQixHQUFHLENBQUMsR0FBRyxDQUNMLElBQUEseUJBQU8sRUFBQztJQUNOLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFDO1FBQ0wsTUFBTSxFQUFDLEtBQUs7UUFDWixNQUFNLEVBQUUsS0FBSztLQUNkO0lBQ0QsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDLENBQ0gsQ0FBQztBQUdGLFVBQVU7QUFDVixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDOUMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUMxRSxJQUFHO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxpQkFBTyxDQUFDLE1BQU0sQ0FBQztZQUNqQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ25CLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFDL0IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztZQUNqQyxRQUFRLEVBQUUsaUJBQWlCO1NBQzVCLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMxQixNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7SUFDRCxPQUFNLEdBQUcsRUFBRTtRQUNULE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDMUMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDcEIsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNiLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDaEM7U0FDSTtRQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtJQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ3hDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxJQUFJLEVBQUU7WUFDUCxNQUFNLGFBQWEsR0FDakIsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDeEQsSUFBRyxhQUFhLEVBQUU7Z0JBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDeEIsTUFBTSxHQUFHLEdBQUcsQ0FBQzthQUNkOztnQkFFQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2hCOztZQUVDLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDaEI7SUFDRCxPQUFNLEdBQUcsRUFBRTtRQUNULE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDekMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDMUIsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ3pDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixNQUFNLGlCQUFpQixHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDMUUsSUFBSTtRQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sZUFBSyxDQUFDLFlBQVksQ0FBQztZQUNwQyxLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSzthQUN0QjtZQUNELFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNyQixRQUFRLEVBQUUsaUJBQWlCO2FBQzVCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDbkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQzdCO2FBQ0k7WUFDSCxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2Q7S0FDRjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNkO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFBLG1CQUFZLEVBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsTUFBTSxFQUFFLEdBQUcsSUFBSSxrQkFBTSxDQUFDLFVBQVUsRUFBRTtJQUM5QixJQUFJLEVBQUU7UUFDRixNQUFNLEVBQUUsdUJBQXVCO0tBQ2xDO0NBQ0gsQ0FBQyxDQUFDO0FBRUosRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUM3QixNQUFNO0lBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDO0FBRUgsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9