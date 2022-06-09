"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLobbyData = exports.removeFromLobby = exports.getInvite = exports.closeLobby = exports.createLobby = void 0;
const options_1 = require("../options");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("../db/models");
const createLobby = async (req, res) => {
    let status = 500;
    const encryptedPassword = await bcrypt_1.default.hash(req.body.password, options_1.saltRounds);
    const inviteId = crypto_1.default.randomBytes(8).toString("hex");
    try {
        const lobby = await models_1.Lobbies.create({
            host_id: req.session.user.id,
            name: req.body.name,
            is_private: req.body.is_private,
            max_players: req.body.max_players,
            password: encryptedPassword,
            invite_id: inviteId
        });
        if (!lobby)
            throw true;
        const player = await models_1.Players.create({
            user_id: req.session.user.id,
            lobby_id: lobby.id,
            is_host: false,
            slot: 1
        });
        if (!player)
            throw true;
        const hand = await models_1.Hands.create({
            player_id: player.id
        });
        if (!hand)
            throw true;
        req.session.lobby = lobby;
        req.session.player = player;
        status = 200;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({
            invite_id: inviteId
        });
    }
};
exports.createLobby = createLobby;
const closeLobby = async (req, res) => {
    let status = 500;
    try {
        const lobby = await models_1.Lobbies.findOne({
            where: {
                invite_id: req.body.invite_id
            }
        });
        if (!lobby)
            throw true;
        const players = await models_1.Players.findAll({
            where: {
                lobby_id: req.session.lobby.id
            }
        });
        if (!players)
            throw true;
        await lobby.destroy();
        players.forEach(async (player) => {
            await player.destroy();
        });
        req.session.lobby = null;
        req.session.player = null;
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
exports.closeLobby = closeLobby;
const getInvite = async (req, res) => {
    let status = 500;
    try {
        const lobby = await models_1.Lobbies.findOne({
            where: {
                invite_id: req.params.id
            }
        });
        if (!lobby)
            throw true;
        const { count, rows } = await models_1.Players.findAndCountAll({
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
        const player = await models_1.Players.findOrCreate({
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
        const hand = await models_1.Hands.create({
            player_id: player[0].id
        });
        if (!hand)
            throw true;
        req.session.lobby = lobby;
        req.session.player = player[0];
        status = 200;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.redirect(options_1.CLIENT_ADDR + '/lobby?' + req.params.id);
    }
};
exports.getInvite = getInvite;
const removeFromLobby = async (req, res) => {
    let status = 500;
    try {
        const player = await models_1.Players.findOne({
            where: {
                user_id: req.body.player_id
            }
        });
        if (!player)
            throw true;
        const hand = await models_1.Hands.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.removeFromLobby = removeFromLobby;
const removeLobbyData = async (req, res) => {
    let status = 500;
    try {
        req.session.lobby = null;
        req.session.player = null;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.removeLobbyData = removeLobbyData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnlDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vY29udHJvbGxlcnMvbG9iYnlDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUFxRDtBQUNyRCxvREFBNEI7QUFDNUIsb0RBQTJCO0FBQzNCLHlDQUF1RDtBQUVoRCxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7SUFDL0UsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxvQkFBVSxDQUFDLENBQUE7SUFDMUUsTUFBTSxRQUFRLEdBQUcsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELElBQUc7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7WUFDbkIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUMvQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxDQUFDLEtBQUs7WUFDUCxNQUFNLElBQUksQ0FBQztRQUViLE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsUUFBUSxFQUFFLEtB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