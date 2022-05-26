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
const redis_1 = require("redis");
const Friends_1 = __importDefault(require("./models/Friends"));
const connectRedis = require('connect-redis');
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
const RedisStore = connectRedis(express_session_1.default);
//Configure redis client
const redisClient = (0, redis_1.createClient)({
    host: 'localhost',
    port: 6379
});
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
const store = new RedisStore({ client: redisClient });
// Session setup
app.use((0, express_session_1.default)({
    store: store,
    resave: true,
    secret: '123456',
    cookie: {
        maxAge: 1000 * 60 * 60,
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
        res.redirect('http://localhost:3001/lobby?' + req.params.id);
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
        req.session.game = game;
        const { set, symbols } = await Sets_1.default.generateRuSet(game.id);
        if (!set)
            throw true;
        const { field } = await Fields_1.default.generateField(game.id);
        if (!field)
            throw true;
        const allPlayers = await Players_1.default.findAll({
            where: {
                lobby_id: req.session.lobby.id,
            },
        });
        const setResult = await Sets_1.default.getSet(game.id, true);
        if (!setResult || !setResult.symbols)
            throw true;
        shuffle(setResult.symbols);
        for (let i = 0; i < allPlayers.length; i++) {
            await allPlayers[i].update({
                points: 0
            });
            const hand = await Hands_1.default.findOne({
                where: {
                    player_id: allPlayers[i].id
                }
            });
            if ((setResult === null || setResult === void 0 ? void 0 : setResult.symbols) && hand)
                await fillHand(setResult.symbols, hand);
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
async function fillHand(symbols, currentHand) {
    try {
        let symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot1: currentHand.slot1 ? currentHand.slot1 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot2: currentHand.slot2 ? currentHand.slot2 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot3: currentHand.slot3 ? currentHand.slot3 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot4: currentHand.slot4 ? currentHand.slot4 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot5: currentHand.slot5 ? currentHand.slot5 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot6: currentHand.slot6 ? currentHand.slot6 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
        symbol = symbols.pop();
        if (symbol) {
            await currentHand.update({
                slot7: currentHand.slot7 ? currentHand.slot7 : symbol.id
            });
            await symbol.update({
                in_box: false
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}
app.post('/api/nextTurn', async (req, res) => {
    let status = 400;
    try {
        const game = await Games_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id
            }
        });
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
        if (req.body.points) {
            await currentPlayer.update({
                points: currentPlayer.points + req.body.points
            });
        }
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
        await fillHand(symbols, currentHand);
        game.set({
            turn: game.turn + 1
        });
        await game.save();
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
app.post('/api/exitGame', async (req, res) => {
    const player = await Players_1.default.findOne({
        where: {
            lobby_id: req.session.lobby.id,
            user_id: req.body.user_id
        },
    });
    if (!player)
        throw true;
    ;
    const currentHand = await Hands_1.default.findOne({
        where: {
            player_id: player.id
        }
    });
    if (!currentHand)
        throw true;
    await currentHand.destroy();
    await player.destroy();
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
app.get('/api/logout', async (req, res) => {
    let status = 200;
    store.destroy(req.sessionID, function () {
        req.session.destroy(() => {
            res.redirect('http://localhost:3001');
        });
    });
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
app.post('/api/addFriend', async (req, res) => {
    let status = 400;
    try {
        const user = await Users_1.default.findOne({
            where: {
                login: req.body.login,
            }
        });
        const friend = await Users_1.default.findOne({
            where: {
                login: req.body.friend,
            }
        });
        if (user && friend) {
            const friendBackDb = await Friends_1.default.findOne({
                where: {
                    user_id: friend.id,
                    friend_id: user.id
                }
            });
            const friendDb = await Friends_1.default.findOrCreate({
                where: {
                    user_id: user.id,
                    friend_id: friend.id
                },
                defaults: {
                    user_id: user.id,
                    friend_id: friend.id
                }
            });
            if (friendBackDb) {
                await friendDb[0].update({
                    is_accepted: true
                });
                await friendBackDb.update({
                    is_accepted: true
                });
            }
            status = 200;
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
app.post('/api/removeFriend', async (req, res) => {
    let status = 400;
    try {
        const user = await Users_1.default.findOne({
            where: {
                login: req.body.login,
            }
        });
        const friend = await Users_1.default.findOne({
            where: {
                login: req.body.friend,
            }
        });
        if (user && friend) {
            const friendBackDb = await Friends_1.default.findOne({
                where: {
                    user_id: friend.id,
                    friend_id: user.id
                }
            });
            const friendDb = await Friends_1.default.findOne({
                where: {
                    user_id: user.id,
                    friend_id: friend.id
                }
            });
            await (friendDb === null || friendDb === void 0 ? void 0 : friendDb.destroy());
            await (friendBackDb === null || friendBackDb === void 0 ? void 0 : friendBackDb.destroy());
            status = 200;
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
app.post('/api/findAllFriends', async (req, res) => {
    let status = 400;
    let friends = [];
    try {
        const user = await Users_1.default.findOne({
            where: {
                login: req.body.login
            }
        });
        if (user) {
            friends = await Users_1.default.findAll({
                attributes: ['login'],
                where: {
                    id: user.id
                },
                include: {
                    model: Users_1.default,
                    attributes: ['login'],
                    as: 'friend',
                    required: true,
                    through: {
                        where: {
                            is_accepted: true
                        }
                    }
                }
            });
            status = 200;
        }
        else
            status = 422;
    }
    catch (err) {
        console.log(err);
        status = 422;
    }
    finally {
        res.status(status);
        res.json(friends);
    }
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});
io.on("connection", (socket) => {
    socket.on('room', async (room) => {
        if (room) {
            socket.join(room);
            socket.broadcast.to(room).emit('newUser', room);
        }
        console.log('get room');
    });
    socket.on('addFriend', async (login) => {
        const user = await Users_1.default.findOne({
            where: {
                login: login
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('sendFriendInvite', user.login);
    });
    socket.on('login', async (login, socket_id) => {
        const user = await Users_1.default.findOne({
            where: {
                login: login
            }
        });
        await (user === null || user === void 0 ? void 0 : user.update({
            socket_id: socket_id
        }));
        // socket.broadcast.to(room).emit('newUser', room);
    });
});
httpServer.listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBMkM7QUFFM0MsZ0RBQXdCO0FBQ3hCLG9EQUE4QztBQUU5QywrREFBdUM7QUFDdkMsc0VBQXNDO0FBQ3RDLG9EQUE0QjtBQUM1QiwyREFBbUM7QUFDbkMsb0RBQTJCO0FBQzNCLCtEQUF1QztBQUN2Qyx5REFBaUM7QUFDakMseURBQWlDO0FBQ2pDLDZEQUFxQztBQUNyQywyREFBbUM7QUFFbkMsMkRBQW1DO0FBQ25DLHFFQUE2QztBQUM3QyxpQ0FBcUM7QUFFckMsK0RBQXVDO0FBQ3ZDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBYXRCLFdBQVc7QUFDWCxJQUFBLHdCQUFTLEdBQUUsQ0FBQztBQUNaLFVBQVU7QUFDVixzQkFBc0I7QUFFdEIsZ0JBQWdCO0FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRXhCLElBQUksV0FBVyxHQUFHO0lBQ2hCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0lBQ1osY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQy9CLENBQUM7QUFDRixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFHM0IsTUFBTSxVQUFVLEdBQUcsWUFB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