"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const sequelize_1 = require("sequelize");
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
const associations_1 = require("./db/associations");
const init_1 = require("./db/init");
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
const Symbols_1 = __importDefault(require("./models/Symbols"));
const Hands_1 = __importDefault(require("./models/Hands"));
const FieldCells_1 = __importDefault(require("./models/FieldCells"));
const redis_1 = require("redis");
const Friends_1 = __importDefault(require("./models/Friends"));
const connectRedis = require('connect-redis');
var privateKey = fs.readFileSync('sslcert/private.key', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const SERVER_IP = true ? 'https://80.78.244.11' : 'http://localhost';
const CLIENT_ADDR = true ? 'https://upndrey.github.io/Scrabble' : 'http://localhost:3001';
// Encrypt options
const saltRounds = 10;
// Db setup
(0, associations_1.associate)();
(0, init_1.init)();
// Maps.generateMap();
// Express setup
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
const origin = true ? 'https://upndrey.github.io' : 'http://localhost:3001';
var corsOptions = {
    origin: origin,
    credentials: true,
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
        secure: true,
        sameSite: 'none'
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
app.post('/api/closeLobby', async (req, res) => {
    let status = 400;
    try {
        const lobby = await Lobbies_1.default.findOne({
            where: {
                invite_id: req.body.invite_id
            }
        });
        if (!lobby)
            throw true;
        await lobby.destroy();
        req.session.lobby = null;
        req.session.player = null;
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
        res.redirect(CLIENT_ADDR + '/lobby?' + req.params.id);
    }
});
app.post('/api/removeFromLobby', async (req, res) => {
    let status = 400;
    try {
        const player = await Players_1.default.findOne({
            where: {
                user_id: req.body.player_id
            }
        });
        if (!player)
            throw true;
        const hand = await Hands_1.default.findOne({
            where: {
                player_id: player.id
            }
        });
        if (!hand)
            throw true;
        await hand.destroy();
        await player.destroy();
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
app.post('/api/removeLobbyData', async (req, res) => {
    req.session.lobby = null;
    res.status(200);
    res.json({});
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
            attributes: ['user_id', 'points', 'is_host', 'slot', 'is_ended'],
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
        const allPlayers = await Players_1.default.findAll({
            where: {
                lobby_id: req.session.lobby.id,
            },
        });
        const currentPlayer = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(game.turn, allPlayers.length)
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
app.post('/api/noMoreWays', async (req, res) => {
    let status = 400;
    try {
        const player = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                user_id: req.body.user_id
            },
        });
        if (!player)
            throw true;
        await player.update({
            is_ended: true
        });
        const playersWithTurns = await Players_1.default.findAll({
            where: {
                lobby_id: req.session.lobby.id,
                is_ended: false
            }
        });
        if (playersWithTurns.length === 0) {
            io.to(req.session.lobby.invite_id).emit('gameEnded');
        }
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
app.post('/api/exitGame', async (req, res) => {
    let status = 400;
    try {
        const player = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                user_id: req.body.user_id
            },
        });
        if (!player)
            throw true;
        const playerSlot = player.slot;
        const currentHand = await Hands_1.default.findOne({
            where: {
                player_id: player.id
            }
        });
        if (!currentHand)
            throw true;
        await currentHand.destroy();
        await player.destroy();
        const allPlayers = await Players_1.default.findAll({
            where: {
                lobby_id: req.session.lobby.id,
                slot: {
                    [sequelize_1.Op.gt]: playerSlot
                }
            },
        });
        allPlayers.forEach(async (row) => {
            await row.update({
                slot: row.slot - 1
            });
        });
        if (req.session.lobby)
            req.session.lobby = null;
        if (req.session.game)
            req.session.game = null;
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
        let toValue = null;
        if (req.body.toSlot) {
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
            switch (req.body.toSlot) {
                case 1:
                    toValue = currentHand.slot1;
                    break;
                case 2:
                    toValue = currentHand.slot2;
                    break;
                case 3:
                    toValue = currentHand.slot3;
                    break;
                case 4:
                    toValue = currentHand.slot4;
                    break;
                case 5:
                    toValue = currentHand.slot5;
                    break;
                case 6:
                    toValue = currentHand.slot6;
                    break;
                case 7:
                    toValue = currentHand.slot7;
                    break;
            }
        }
        else if (req.body.toCell) {
            const fieldCell = await FieldCells_1.default.findOne({
                where: {
                    id: req.body.toCell
                }
            });
            toValue = fieldCell === null || fieldCell === void 0 ? void 0 : fieldCell.symbol_id;
        }
        await (fieldCell === null || fieldCell === void 0 ? void 0 : fieldCell.update({
            symbol_id: toValue
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
        let toValue = null;
        if (req.body.toSlot) {
            switch (req.body.toSlot) {
                case 1:
                    toValue = currentHand.slot1;
                    break;
                case 2:
                    toValue = currentHand.slot2;
                    break;
                case 3:
                    toValue = currentHand.slot3;
                    break;
                case 4:
                    toValue = currentHand.slot4;
                    break;
                case 5:
                    toValue = currentHand.slot5;
                    break;
                case 6:
                    toValue = currentHand.slot6;
                    break;
                case 7:
                    toValue = currentHand.slot7;
                    break;
            }
        }
        else if (req.body.toCell) {
            const fieldCell = await FieldCells_1.default.findOne({
                where: {
                    id: req.body.toCell
                }
            });
            toValue = fieldCell === null || fieldCell === void 0 ? void 0 : fieldCell.symbol_id;
        }
        switch (req.body.slot) {
            case 1:
                await currentHand.update({
                    slot1: toValue
                });
                break;
            case 2:
                await currentHand.update({
                    slot2: toValue
                });
                break;
            case 3:
                await currentHand.update({
                    slot3: toValue
                });
                break;
            case 4:
                await currentHand.update({
                    slot4: toValue
                });
                break;
            case 5:
                await currentHand.update({
                    slot5: toValue
                });
                break;
            case 6:
                await currentHand.update({
                    slot6: toValue
                });
                break;
            case 7:
                await currentHand.update({
                    slot7: toValue
                });
                break;
        }
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
        status = 422;
    }
    finally {
        res.status(status);
        res.json({});
    }
});
app.post('/api/insertSymbolInSet', async (req, res) => {
    let status = 400;
    try {
        if (!req.session.game)
            throw true;
        const symbol = await Symbols_1.default.findOne({
            where: {
                id: req.body.symbolId
            }
        });
        if (!symbol)
            throw true;
        const fieldCell = await FieldCells_1.default.findOne({
            where: {
                symbol_id: req.body.symbolId
            }
        });
        if (fieldCell) {
            await fieldCell.update({
                symbol_id: null
            });
        }
        else {
            const currentHand = await Hands_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        { slot1: req.body.symbolId },
                        { slot2: req.body.symbolId },
                        { slot3: req.body.symbolId },
                        { slot4: req.body.symbolId },
                        { slot5: req.body.symbolId },
                        { slot6: req.body.symbolId },
                        { slot7: req.body.symbolId }
                    ]
                }
            });
            if (currentHand) {
                if (currentHand.slot1 === req.body.symbolId)
                    await currentHand.update({
                        slot1: null
                    });
                else if (currentHand.slot2 === req.body.symbolId)
                    await currentHand.update({
                        slot2: null
                    });
                else if (currentHand.slot3 === req.body.symbolId)
                    await currentHand.update({
                        slot3: null
                    });
                else if (currentHand.slot4 === req.body.symbolId)
                    await currentHand.update({
                        slot4: null
                    });
                else if (currentHand.slot5 === req.body.symbolId)
                    await currentHand.update({
                        slot5: null
                    });
                else if (currentHand.slot6 === req.body.symbolId)
                    await currentHand.update({
                        slot6: null
                    });
                else if (currentHand.slot7 === req.body.symbolId)
                    await currentHand.update({
                        slot7: null
                    });
            }
        }
        symbol.update({
            in_box: true
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
            res.redirect(CLIENT_ADDR);
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
        status = 422;
    }
    finally {
        res.status(status);
        res.json(friends);
    }
});
var httpsServer = https.createServer(credentials, app);
// socket options
const io = new socket_io_1.Server(httpsServer, {
    cors: {
        origin: origin
    }
});
io.on("connection", (socket) => {
    // Lobby
    socket.on('room', async (room) => {
        if (room) {
            socket.join(room);
            socket.broadcast.to(room).emit('newUser', room);
        }
        console.log('get room');
    });
    socket.on('removeRoom', async (room) => {
        if (room) {
            socket.broadcast.to(room).emit('removedFromLobby');
            io.in(room).socketsLeave(room);
        }
    });
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });
    socket.on('removeFromRoom', async (user_id) => {
        const user = await Users_1.default.findOne({
            where: {
                id: user_id
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('removedFromLobby');
    });
    // Game
    socket.on('startGame', (room) => {
        socket.broadcast.to(room).emit('startGame');
    });
    socket.on('nextTurn', (room) => {
        socket.broadcast.to(room).emit('nextTurn');
    });
    socket.on('gameMove', (room) => {
        if (room)
            io.in(room).emit('gameMove');
    });
    // Friends
    socket.on('addFriend', async (login, friendName) => {
        const user = await Users_1.default.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('friendInvite', login);
    });
    socket.on('friendAdded', async (login, friendName) => {
        const user = await Users_1.default.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id) {
            io.to(user.socket_id).emit('friendAdded');
            io.to(socket.id).emit('friendAdded');
        }
    });
    socket.on('removeFriend', async (login, friendName) => {
        const user = await Users_1.default.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('removeFriend');
    });
    socket.on('inviteInLobby', async (friendName, invite_id) => {
        const user = await Users_1.default.findOne({
            where: {
                login: friendName
            }
        });
        console.log('invite');
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('inviteInLobby', invite_id);
    });
    // Login
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
httpsServer.listen(8443);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBOEI7QUFFOUIseUNBQTJDO0FBQzNDLHlDQUErQjtBQUUvQiw2Q0FBK0I7QUFDL0IsdUNBQXlCO0FBQ3pCLGdEQUF3QjtBQUN4QixvREFBOEM7QUFDOUMsb0NBQWlDO0FBQ2pDLCtEQUF1QztBQUN2QyxzRUFBc0M7QUFDdEMsb0RBQTRCO0FBQzVCLDJEQUFtQztBQUNuQyxvREFBMkI7QUFDM0IsK0RBQXVDO0FBQ3ZDLHlEQUFpQztBQUNqQyx5REFBaUM7QUFDakMsNkRBQXFDO0FBQ3JDLDJEQUFtQztBQUNuQywrREFBdUM7QUFDdkMsMkRBQW1DO0FBQ25DLHFFQUE2QztBQUM3QyxpQ0FBcUM7QUFFckMsK0RBQXVDO0FBQ3ZDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxJQUFJLFVBQVUsR0FBSSxFQUFFLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMseUJBQXlCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFckUsSUFBSSxXQUFXLEdBQUcsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQztBQUV2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztBQUNyRSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQztBQUUxRixrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBYXRCLFdBQVc7QUFDWCxJQUFBLHdCQUFTLEdBQUUsQ0FB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