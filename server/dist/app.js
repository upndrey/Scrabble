"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const associations_1 = require("./db/associations");
const Lobbies_1 = __importDefault(require("./models/Lobbies"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("./models/Users"));
const crypto_1 = __importDefault(require("crypto"));
const Players_1 = __importDefault(require("./models/Players"));
const Maps_1 = __importDefault(require("./models/Maps"));
const Sets_1 = __importDefault(require("./models/Sets"));
const Fields_1 = __importDefault(require("./models/Fields"));
const Games_1 = __importDefault(require("./models/Games"));
// Encrypt options
const saltRounds = 10;
// Db setup
(0, associations_1.associate)();
// init();
Maps_1.default.generateMap();
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
    const inviteId = crypto_1.default.randomBytes(8).toString("hex");
    try {
        const lobby = await Lobbies_1.default.create({
            host_id: req.session.user.id,
            name: req.body.name,
            is_private: req.body.is_private,
            max_players: req.body.max_players,
            password: encryptedPassword,
            invite_id: inviteId
        });
        if (!lobby)
            throw true;
        const player = await Players_1.default.create({
            user_id: req.session.user.id,
            lobby_id: lobby.id,
            is_host: false,
            slot: 1
        });
        if (!player)
            throw true;
        req.session.lobby = lobby;
        req.session.player = player;
        status = 200;
    }
    catch (err) {
        status = 422;
    }
    finally {
        res.status(status);
        res.json({
            invite_id: inviteId
        });
    }
});
app.get('/api/inviteLink/:id', async (req, res) => {
    let status = 400;
    try {
        const lobby = await Lobbies_1.default.findOne({
            where: {
                invite_id: req.params.id
            }
        });
        if (!lobby)
            throw true;
        const { count, rows } = await Players_1.default.findAndCountAll({
            where: {
                lobby_id: lobby.id
            }
        });
        if (count > 3)
            throw true;
        let freeSlotsArray = [true, true, true, true];
        for (let i = 0; i < rows.length; i++) {
            freeSlotsArray[rows[i].slot - 1] = false;
        }
        let freeSlotId = 0;
        for (let i = 0; i < freeSlotsArray.length; i++) {
            if (freeSlotsArray[i]) {
                freeSlotId = i;
                break;
            }
        }
        const player = await Players_1.default.create({
            user_id: req.session.user.id,
            lobby_id: lobby.id,
            is_host: false,
            slot: freeSlotId + 1
        });
        if (!player)
            throw true;
        req.session.lobby = lobby;
        req.session.player = player;
        status = 200;
    }
    catch (err) {
        status = 422;
    }
    finally {
        res.status(status);
        // res.json({});
        res.redirect('http://localhost:3001/lobby');
    }
});
app.post('/api/getUserData', async (req, res) => {
    let status = 400;
    let login = "";
    let lobby = null;
    let game = null;
    let lobbyBd;
    try {
        if (!req.session.user)
            throw 422;
        login = req.session.user.login;
        if (req.session.lobby) {
            lobbyBd = req.session.lobby;
        }
        else {
            const player = await Players_1.default.findOne({
                where: {
                    user_id: req.session.user.id,
                }
            });
            if (!player)
                throw 200;
            lobbyBd = await Lobbies_1.default.findOne({
                where: {
                    id: player.lobby_id,
                }
            });
        }
        if (!lobbyBd)
            throw 422;
        req.session.lobby = lobbyBd;
        const players = await Users_1.default.findAll({
            attributes: [
                'login',
                'id'
            ],
            include: [{
                    attributes: ['user_id', 'points', 'is_host', 'slot'],
                    model: Players_1.default,
                    as: 'player',
                    required: true,
                    where: {
                        lobby_id: lobbyBd.id
                    }
                }]
        });
        if (!players)
            throw 422;
        lobby = {
            name: lobbyBd.name,
            max_players: lobbyBd.max_players,
            invite_id: lobbyBd.invite_id,
            players
        };
        const gameBd = await Games_1.default.findOne({
            attributes: ['id', 'turn', 'is_closed'],
            where: {
                lobby_id: req.session.lobby.id
            }
        });
        if (!gameBd)
            throw 200;
        game = {};
        game.gameInfo = gameBd;
        const { set, symbols } = await Sets_1.default.generateRuSet();
        if (!set)
            throw 422;
        game.symbols = symbols;
        const { map, mapCells } = await Maps_1.default.generateMap();
        if (!map)
            throw 422;
        game.mapCells = mapCells;
        const { field, fieldCells } = await Fields_1.default.generateField(gameBd.id);
        if (!field)
            throw 422;
        game.fieldCells = fieldCells;
        status = 200;
    }
    catch (err) {
        console.log(err);
        if (err == 200)
            status = 200;
        else
            status = 422;
    }
    finally {
        res.status(status);
        res.json({ login, lobby, game });
    }
});
app.post('/api/startGame', async (req, res) => {
    let status = 400;
    let game = null;
    let symbolsArray = null;
    let mapCellsArray = null;
    let fieldCellsArray = null;
    try {
        const { set, symbols } = await Sets_1.default.generateRuSet();
        if (!set)
            throw true;
        symbolsArray = symbols;
        const { map, mapCells } = await Maps_1.default.generateMap();
        if (!map)
            throw true;
        mapCellsArray = mapCells;
        game = await Games_1.default.create({
            lobby_id: req.session.lobby.id,
            set_id: set[0].id,
            map_id: map[0].id,
        });
        if (!game)
            throw true;
        const { field, fieldCells } = await Fields_1.default.generateField(game.id);
        if (!field)
            throw true;
        fieldCellsArray = fieldCells;
        status = 200;
    }
    catch (err) {
        console.log(err);
        status = 422;
    }
    finally {
        res.status(status);
        res.json({
            game,
            symbolsArray,
            mapCellsArray,
            fieldCellsArray
        });
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBQ3hCLG9EQUE4QztBQUU5QywrREFBdUM7QUFDdkMsc0VBQXNDO0FBQ3RDLG9EQUE0QjtBQUM1QiwyREFBbUM7QUFDbkMsb0RBQTJCO0FBQzNCLCtEQUF1QztBQUN2Qyx5REFBaUM7QUFDakMseURBQWlDO0FBQ2pDLDZEQUFxQztBQUNyQywyREFBbUM7QUFFbkMsa0JBQWtCO0FBQ2xCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQVd0QixXQUFXO0FBQ1gsSUFBQSx3QkFBUyxHQUFFLENBQUM7QUFDWixVQUFVO0FBQ1YsY0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBRW5CLGdCQUFnQjtBQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN6QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM5QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV4QixJQUFJLFdBQVcsR0FBRztJQUNoQixXQUFXLEVBQUUsSUFBSTtJQUNqQixNQUFNLEVBQUUsSUFBSTtJQUNaLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQztDQUMvQixDQUFDO0FBQ0YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTNCLGdCQUFnQjtBQUNoQixHQUFHLENBQUMsR0FBRyxDQUNMLElBQUEseUJBQU8sRUFBQztJQUNOLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFB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