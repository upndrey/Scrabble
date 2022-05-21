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
        console.log(1);
        if (!game)
            throw true;
        const { set, symbols } = await Sets_1.default.generateRuSet(game.id);
        console.log(2);
        if (!set)
            throw true;
        const { field } = await Fields_1.default.generateField(game.id);
        console.log(3);
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
        console.log(4);
        if (!game)
            throw true;
        const currentPlayer = await Players_1.default.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(game.turn, req.session.lobby.max_players)
            },
        });
        console.log(5);
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
        console.log(6);
        if (!currentHand)
            throw true;
        console.log(7);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBQ3hCLG9EQUE4QztBQUU5QywrREFBdUM7QUFDdkMsc0VBQXNDO0FBQ3RDLG9EQUE0QjtBQUM1QiwyREFBbUM7QUFDbkMsb0RBQTJCO0FBQzNCLCtEQUF1QztBQUN2Qyx5REFBaUM7QUFDakMseURBQWlDO0FBQ2pDLDZEQUFxQztBQUNyQywyREFBbUM7QUFFbkMsMkRBQW1DO0FBRW5DLGtCQUFrQjtBQUNsQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFhdEIsV0FBVztBQUNYLElBQUEsd0JBQVMsR0FBRSxDQUFDO0FBQ1osVUFBVTtBQUNWLHNCQUFzQjtBQUV0QixnQkFBZ0I7QUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDekIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFeEIsSUFBSSxXQUFXLEdBQUc7SUFDaEIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixjQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUM7Q0FDL0IsQ0FBQztBQUNGLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUUzQixnQkFBZ0I7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FDTCxJQUFBLHlCQUFPLEVBQUM7SUFDTixNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLE1BQU0sRUFBQztRQUNMLE1BQU0sRUFBQyxLQUFLO1FBQ1osTUFBTSxFQUFFLEtBQUs7S0FDZDtJQUNELGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQyxDQUNILENBQUM7QUFHRixVQUFVO0FBQ1YsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzlDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixNQUFNLGlCQUFpQixHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDMUUsTUFBTSxRQUFRLEdBQUcsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELElBQUc7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLGlCQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7WUFDbkIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUMvQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLEtBQUs7WUFDUCxNQUFNLElBQUksQ0FBQztRQUViLE1BQU0sTUFBTSxHQUFHLE1BQU0saUJBQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsSUFBSSxFQUFFLENBQUM7U0FDUixDQUFDLENBQUM7UUFDSCxJQUFHLENBQUMsTUFBTTtZQUNSLE1BQU0sSUFBSSxDQUFDO1FBRWIsTUFBTSxJQUFJLEdBQUcsTUFBTSxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQzlCLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNyQixDQUFDLENBQUM7UUFDSCxJQUFHLENBQUMsSUFBSTtZQUNOLE1BQU0sSUFBSSxDQUFDO1FBRWIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM1QixNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7SUFDRCxPQUFNLEdBQUcsRUFBRTtRQUNULE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNoRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFDakIsSUFBRztRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxPQUFPLENBQUM7WUFDbEMsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDekI7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFHLENBQUMsS0FBSztZQUNQLE1BQU0sSUFBSSxDQUFDO1FBRWIsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLGlCQUFPLENBQUMsZUFBZSxDQUFDO1lBQ3BELEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFHLEtBQUssR0FBRyxDQUFDO1lBQ1YsTUFBTSxJQUFJLENBQUM7UUFDYixJQUFJLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUMxQztRQUNELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixNQUFNO2FBQ1A7U0FDRjtRQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0saUJBQU8sQ0FBQyxZQUFZLENBQUM7WUFDeEMsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1QixRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7YUFDbkI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVCLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFLFVBQVUsR0FBRyxDQUFDO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLE1BQU07WUFDUixNQUFNLElBQUksQ0FBQztRQUViLE1BQU0sSUFBSSxHQUFHLE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQztZQUM5QixTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLElBQUk7WUFDTixNQUFNLElBQUksQ0FBQztRQUViLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMxQixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUVkO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkIsZ0JBQWdCO1FBQ2hCLEdBQUcsQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUM3QztBQUNILENBQUMsQ0FBQyxDQUFBO0FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzlDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDZixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxJQUFJLEdBQVEsSUFBSSxDQUFDO0lBQ3JCLElBQUksT0FBTyxDQUFDO0lBQ1osSUFBSTtRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDbkIsTUFBTSxHQUFHLENBQUM7UUFFWixLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDckIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1NBQzdCO2FBQ0k7WUFDSCxNQUFNLE1BQU0sR0FBRyxNQUFNLGlCQUFPLENBQUMsT0FBTyxDQUFDO2dCQUNuQyxLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7aUJBQzdCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBRyxDQUFDLE1BQU07Z0JBQ1IsTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFFNUIsT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLEtBQUssRUFBRTtvQkFDTCxFQUFFLEVBQUUsTUFBTSxDQUFDLFFBQVE7aUJBQ3BCO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFHLENBQUMsT0FBTztZQUNULE1BQU0sR0FBRyxDQUFDO1FBQ1osR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxPQUFPLENBQUM7WUFDcEMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDO1lBQ25ELEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUU7YUFDckI7WUFDRCxPQUFPLEVBQUUsQ0FBQztvQkFDTixVQUFVLEVBQUU7d0JBQ1YsSUFBSTt3QkFDSixPQUFPO3FCQUNSO29CQUNELEtBQUssRUFBRSxlQUFLO29CQUNaLEVBQUUsRUFBRSxRQUFRO29CQUNaLFFBQVEsRUFBRSxJQUFJO2lCQUNmLEVBQUM7b0JBQ0EsVUFBVSxFQUFFLENBQUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO29CQUMxRSxLQUFLLEVBQUUsZUFBSztvQkFDWixFQUFFLEVBQUUsTUFBTTtvQkFDVixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLE9BQU87WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUVaLEtBQUssR0FBRztZQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDaEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQzVCLE9BQU87U0FDUixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDO1lBQ3ZDLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTthQUMvQjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUcsQ0FBQyxNQUFNO1lBQ1IsTUFBTSxHQUFHLENBQUM7UUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDdkIsTUFBTSxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsR0FBRyxNQUFNLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUcsQ0FBQyxHQUFHO1lBQ0wsTUFBTSxHQUFHLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFFMUIsTUFBTSxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUMsR0FBRyxNQUFNLGNBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqRCxJQUFHLENBQUMsR0FBRztZQUNMLE1BQU0sR0FBRyxDQUFDO1FBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsTUFBTSxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUMsR0FBRyxNQUFNLGdCQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFHLENBQUMsS0FBSztZQUNQLE1BQU0sR0FBRyxDQUFDO1FBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFN0IsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUcsR0FBRyxJQUFJLEdBQUc7WUFDWCxNQUFNLEdBQUcsR0FBRyxDQUFDOztZQUViLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDaEI7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUNoQztBQUVILENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzVDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBRUYsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLE1BQU0sY0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLElBQUcsQ0FBQyxHQUFHO1lBQ0wsTUFBTSxJQUFJLENBQUM7UUFFYixNQUFNLElBQUksR0FBRyxNQUFNLGVBQUssQ0FBQyxNQUFNLENBQUM7WUFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQ2xCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFHLENBQUMsSUFBSTtZQUNOLE1BQU0sSUFBSSxDQUFDO1FBRWIsTUFBTSxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsR0FBRyxNQUFNLGNBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFHLENBQUMsR0FBRztZQUNMLE1BQU0sSUFBSSxDQUFDO1FBQ2IsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFHLENBQUMsS0FBSztZQUNQLE1BQU0sSUFBSSxDQUFDO1FBRWIsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUlILFNBQVMsY0FBYyxDQUFDLElBQVksRUFBRSxZQUFvQjtJQUN4RCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixRQUFPLElBQUksR0FBRyxZQUFZLEVBQUU7UUFDMUIsS0FBSyxDQUFDO1lBQ0osSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNULE1BQU07UUFDUixLQUFLLENBQUM7WUFDSixJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ1QsTUFBTTtRQUNSLEtBQUssQ0FBQztZQUNKLElBQUksR0FBRyxDQUFDLENBQUM7WUFDVCxNQUFNO1FBQ1IsS0FBSyxDQUFDO1lBQ0osSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNULE1BQU07S0FDVDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLEtBQWlCO0lBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzNDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBQ0YsSUFBSSxJQUFJLEdBQWtCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzNDLElBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDUixJQUFJLEdBQUcsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDO2dCQUN6QixLQUFLLEVBQUU7b0JBQ0wsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7aUJBQy9CO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBRyxDQUFDLElBQUk7WUFDTixNQUFNLElBQUksQ0FBQztRQUViLE1BQU0sYUFBYSxHQUFHLE1BQU0saUJBQU8sQ0FBQyxPQUFPLENBQUM7WUFDMUMsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQy9EO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUcsQ0FBQyxhQUFhO1lBQ2YsTUFBTSxJQUFJLENBQUM7UUFFYixhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ25CLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxXQUFXLEdBQUcsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDO1lBQ3RDLEtBQUssRUFBRTtnQkFDTCxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUU7YUFDNUI7U0FDRixDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBRyxDQUFDLFdBQVc7WUFDYixNQUFNLElBQUksQ0FBQztRQUViLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxHQUFHLE1BQU0sY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUcsQ0FBQyxPQUFPO1lBQ1QsTUFBTSxJQUFJLENBQUM7UUFFYixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUcsTUFBTSxFQUFFO1lBQ1QsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDakIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDWixNQUFNLEVBQUUsS0FBSzthQUNkLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFHLE1BQU0sRUFBRTtZQUNULFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pCLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQzVDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ1osTUFBTSxFQUFFLEtBQUs7YUFDZCxDQUFDLENBQUM7U0FDSjtRQUVELE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBRyxNQUFNLEVBQUU7WUFDVCxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUNqQixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTthQUM1QyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxLQUFLO2FBQ2QsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUcsTUFBTSxFQUFFO1lBQ1QsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDakIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDWixNQUFNLEVBQUUsS0FBSzthQUNkLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFHLE1BQU0sRUFBRTtZQUNULFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pCLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQzVDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ1osTUFBTSxFQUFFLEtBQUs7YUFDZCxDQUFDLENBQUM7U0FDSjtRQUVELE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBRyxNQUFNLEVBQUU7WUFDVCxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUNqQixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTthQUM1QyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxLQUFLO2FBQ2QsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUcsTUFBTSxFQUFFO1lBQ1QsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDakIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDWixNQUFNLEVBQUUsS0FBSzthQUNkLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDeEMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFHLElBQUksRUFBRTtZQUNQLE1BQU0sYUFBYSxHQUNqQixNQUFNLGdCQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN4RCxJQUFHLGFBQWEsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixNQUFNLEdBQUcsR0FBRyxDQUFDO2FBQ2Q7O2dCQUVDLE1BQU0sR0FBRyxHQUFHLENBQUM7U0FDaEI7O1lBRUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNoQjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO1lBQ087UUFDTixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDZDtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN6QyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFDakIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUMxQixNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDekMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUMxRSxJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxlQUFLLENBQUMsWUFBWSxDQUFDO1lBQ3BDLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQ3RCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7YUFDNUI7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNWLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUNuQixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDN0I7YUFDSTtZQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7U0FDZDtLQUNGO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxHQUFHLElBQUEsbUJBQVksRUFBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFNLENBQUMsVUFBVSxFQUFFO0lBQzlCLElBQUksRUFBRTtRQUNGLE1BQU0sRUFBRSx1QkFBdUI7S0FDbEM7Q0FDSCxDQUFDLENBQUM7QUFFSixFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBQzdCLE1BQU07SUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=