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
const Hands_1 = __importDefault(require("./models/Hands"));
const FieldCells_1 = __importDefault(require("./models/FieldCells"));
// Encrypt options
const saltRounds = 10;
// Db setup
(0, associations_1.associate)();
// init();
// Maps.generateMap();
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
        const hand = await Hands_1.default.create({
            player_id: player.id
        });
        if (!hand)
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
        const player = await Players_1.default.findOrCreate({
            where: {
                user_id: req.session.user.id,
                lobby_id: lobby.id,
            },
            defaults: {
                user_id: req.session.user.id,
                lobby_id: lobby.id,
                is_host: false,
                slot: freeSlotId + 1
            }
        });
        if (!player)
            throw true;
        const hand = await Hands_1.default.create({
            player_id: player[0].id
        });
        if (!hand)
            throw true;
        req.session.lobby = lobby;
        req.session.player = player[0];
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
            throw 200;
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
            req.session.player = player;
            lobbyBd = await Lobbies_1.default.findOne({
                where: {
                    id: player.lobby_id,
                }
            });
        }
        if (!lobbyBd)
            throw 422;
        req.session.lobby = lobbyBd;
        const players = await Players_1.default.findAll({
            attributes: ['user_id', 'points', 'is_host', 'slot'],
            where: {
                lobby_id: lobbyBd.id
            },
            include: [{
                    attributes: [
                        'id',
                        'login'
                    ],
                    model: Users_1.default,
                    as: 'player',
                    required: true
                }, {
                    attributes: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7'],
                    model: Hands_1.default,
                    as: 'hand',
                    required: true
                },
            ]
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
        const { set, symbols } = await Sets_1.default.getSet(gameBd.id);
        if (!set)
            throw 422;
        game.symbols = symbols;
        req.session.game = gameBd;
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
    try {
        const { map } = await Maps_1.default.generateMap();
        if (!map)
            throw true;
        const game = await Games_1.default.create({
            lobby_id: req.session.lobby.id,
            map_id: map[0].id,
        });
        if (!game)
            throw true;
        const { set, symbols } = await Sets_1.default.generateRuSet(game.id);
        if (!set)
            throw true;
        const { field } = await Fields_1.default.generateField(game.id);
        if (!field)
            throw true;
        status = 200;
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
function findSlotByTurn(turn, playersCount) {
    let slot = 1;
    switch (turn % playersCount) {
        case 0:
            slot = 1;
            break;
        case 1:
            slot = 2;
            break;
        case 2:
            slot = 3;
            break;
        case 3:
            slot = 4;
            break;
    }
    return slot;
}
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
app.post('/api/nextTurn', async (req, res) => {
    let status = 400;
    try {
        let game = req.session.game;
        if (!game) {
            game = await Games_1.default.findOne({
                where: {
                    lobby_id: req.session.lobby.id
                }
            });
        }
        if (!game)
            throw true;
        const currentPlayer = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(game.turn, req.session.lobby.max_players)
            },
        });
        if (!currentPlayer)
            throw true;
        currentPlayer.update({
            points: req.body.points
        });
        const currentHand = await Hands_1.default.findOne({
            where: {
                player_id: currentPlayer.id
            }
        });
        if (!currentHand)
            throw true;
        const { set, symbols } = await Sets_1.default.getSet(game.id, true);
        if (!symbols)
            throw true;
        shuffle(symbols);
        let symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot1: currentHand.slot1 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot2: currentHand.slot2 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot3: currentHand.slot3 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot4: currentHand.slot4 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot5: currentHand.slot5 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot6: currentHand.slot6 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            currentHand.update({
                slot7: currentHand.slot7 ? null : symbol.id
            });
            symbol.update({
                in_box: false
            });
        }
        await game.update({
            turn: game.turn + 1
        });
        status = 200;
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
app.post('/api/removeSymbolInField', async (req, res) => {
    let status = 400;
    try {
        if (!req.session.game)
            throw true;
        const fieldCell = await FieldCells_1.default.findOne({
            where: {
                id: req.body.cellId
            }
        });
        if (!fieldCell)
            throw true;
        await (fieldCell === null || fieldCell === void 0 ? void 0 : fieldCell.update({
            symbol_id: null
        }));
        status = 200;
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
app.post('/api/insertSymbolInField', async (req, res) => {
    let status = 400;
    try {
        if (!req.session.game)
            throw true;
        const fieldCell = await FieldCells_1.default.findOne({
            where: {
                id: req.body.cellId
            }
        });
        if (!fieldCell)
            throw true;
        await (fieldCell === null || fieldCell === void 0 ? void 0 : fieldCell.update({
            symbol_id: req.body.symbolId
        }));
        status = 200;
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
app.post('/api/removeSymbolInHand', async (req, res) => {
    let status = 400;
    try {
        if (!req.session.game)
            throw true;
        const currentPlayer = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
            },
        });
        if (!currentPlayer)
            throw true;
        const currentHand = await Hands_1.default.findOne({
            where: {
                player_id: currentPlayer.id
            }
        });
        if (!currentHand)
            throw true;
        switch (req.body.slot) {
            case 1:
                await currentHand.update({
                    slot1: null
                });
                break;
            case 2:
                await currentHand.update({
                    slot2: null
                });
                break;
            case 3:
                await currentHand.update({
                    slot3: null
                });
                break;
            case 4:
                await currentHand.update({
                    slot4: null
                });
                break;
            case 5:
                await currentHand.update({
                    slot5: null
                });
                break;
            case 6:
                await currentHand.update({
                    slot6: null
                });
                break;
            case 7:
                await currentHand.update({
                    slot7: null
                });
                break;
        }
        status = 200;
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
app.post('/api/insertSymbolInHand', async (req, res) => {
    let status = 400;
    try {
        if (!req.session.game)
            throw true;
        const currentPlayer = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
            },
        });
        if (!currentPlayer)
            throw true;
        const currentHand = await Hands_1.default.findOne({
            where: {
                player_id: currentPlayer.id
            }
        });
        if (!currentHand)
            throw true;
        switch (req.body.slot) {
            case 1:
                await currentHand.update({
                    slot1: req.body.symbolId
                });
                break;
            case 2:
                await currentHand.update({
                    slot2: req.body.symbolId
                });
                break;
            case 3:
                await currentHand.update({
                    slot3: req.body.symbolId
                });
                break;
            case 4:
                await currentHand.update({
                    slot4: req.body.symbolId
                });
                break;
            case 5:
                await currentHand.update({
                    slot5: req.body.symbolId
                });
                break;
            case 6:
                await currentHand.update({
                    slot6: req.body.symbolId
                });
                break;
            case 7:
                await currentHand.update({
                    slot7: req.body.symbolId
                });
                break;
        }
        status = 200;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBQ3hCLG9EQUE4QztBQUU5QywrREFBdUM7QUFDdkMsc0VBQXNDO0FBQ3RDLG9EQUE0QjtBQUM1QiwyREFBbUM7QUFDbkMsb0RBQTJCO0FBQzNCLCtEQUF1QztBQUN2Qyx5REFBaUM7QUFDakMseURBQWlDO0FBQ2pDLDZEQUFxQztBQUNyQywyREFBbUM7QUFFbkMsMkRBQW1DO0FBQ25DLHFFQUE2QztBQUU3QyxrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBYXRCLFdBQVc7QUFDWCxJQUFBLHdCQUFTLEdBQUUsQ0FBQztBQUNaLFVBQVU7QUFDVixzQkFBc0I7QUFFdEIsZ0JBQWdCO0FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRXhCLElBQUksV0FBVyxHQUFHO0lBQ2hCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0lBQ1osY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQy9CLENBQUM7QUFDRixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFM0IsZ0JBQWdCO0FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQ0wsSUFBQSx5QkFBTyxFQUFDO0lBQ04sTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsUUFBUTtJ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