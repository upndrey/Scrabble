"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = exports.signup = exports.logout = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const options_1 = require("../options");
const setup_1 = require("../setup");
const models_1 = require("../db/models");
const login = async (req, res) => {
    let status = 500;
    try {
        const user = await models_1.Users.findOne({
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
                status = 401;
        }
        else
            status = 401;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.login = login;
const logout = async (req, res) => {
    let status = 500;
    try {
        setup_1.store.destroy(req.sessionID, function () {
            req.session.destroy(() => {
                res.redirect(options_1.CLIENT_ADDR);
            });
        });
        status = 200;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.logout = logout;
const signup = async (req, res) => {
    let status = 500;
    const encryptedPassword = await bcrypt_1.default.hash(req.body.password, options_1.saltRounds);
    try {
        const user = await models_1.Users.findOrCreate({
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
            status = 401;
        }
    }
    catch (err) {
        status = 501;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.signup = signup;
const getUserData = async (req, res) => {
    let status = 500;
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
            const player = await models_1.Players.findOne({
                where: {
                    user_id: req.session.user.id,
                }
            });
            if (!player)
                throw 200;
            req.session.player = player;
            lobbyBd = await models_1.Lobbies.findOne({
                where: {
                    id: player.lobby_id,
                }
            });
        }
        if (!lobbyBd)
            throw 500;
        req.session.lobby = lobbyBd;
        const players = await models_1.Players.findAll({
            attributes: ['user_id', 'points', 'is_host', 'slot', 'is_ended'],
            where: {
                lobby_id: lobbyBd.id
            },
            include: [{
                    attributes: [
                        'id',
                        'login'
                    ],
                    model: models_1.Users,
                    as: 'player',
                    required: true
                }, {
                    attributes: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7'],
                    model: models_1.Hands,
                    as: 'hand',
                    required: true
                },
            ]
        });
        if (!players)
            throw 500;
        lobby = {
            name: lobbyBd.name,
            max_players: lobbyBd.max_players,
            invite_id: lobbyBd.invite_id,
            players
        };
        const gameBd = await models_1.Games.findOne({
            attributes: ['id', 'turn', 'is_closed'],
            where: {
                lobby_id: req.session.lobby.id
            }
        });
        if (!gameBd)
            throw 200;
        game = {};
        game.gameInfo = gameBd;
        const { set, symbols } = await models_1.Sets.getSet(gameBd.id);
        if (!set)
            throw 500;
        game.symbols = symbols;
        req.session.game = gameBd;
        const { map, mapCells } = await models_1.Maps.generateMap();
        if (!map)
            throw 500;
        game.mapCells = mapCells;
        const { field, fieldCells } = await models_1.Fields.generateField(gameBd.id);
        if (!field)
            throw 500;
        game.fieldCells = fieldCells;
        status = 200;
    }
    catch (err) {
        if (err == 200)
            status = 200;
        else
            status = 500;
    }
    finally {
        res.status(status);
        res.json({ login, lobby, game });
    }
};
exports.getUserData = getUserData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlckNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb250cm9sbGVycy91c2VyQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFBNEI7QUFDNUIsd0NBQXFEO0FBQ3JELG9DQUFpQztBQUNqQyx5Q0FBeUY7QUFFbEYsTUFBTSxLQUFLLEdBQUcsS0FBSyxFQUFFLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO0lBQ3pFLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxJQUFJLEVBQUU7WUFDUCxNQUFNLGFBQWEsR0FDakIsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDeEQsSUFBRyxhQUFhLEVBQUU7Z0JBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDeEIsTUFBTSxHQUFHLEdBQUcsQ0FBQzthQUNkOztnQkFFQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2hCOztZQUVDLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDaEI7SUFDRCxPQUFNLEdBQUcsRUFBRTtRQUNULE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtZQUNPO1FBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDLENBQUE7QUE1QlksUUFBQSxLQUFLLFNBNEJqQjtBQUVNLE1BQU0sTUFBTSxHQUFHLEtBQUss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