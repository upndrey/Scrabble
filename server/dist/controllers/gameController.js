"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoard = exports.insertSymbolInSet = exports.insertSymbolInHand = exports.removeSymbolInHand = exports.insertSymbolInField = exports.removeSymbolInField = exports.exitGame = exports.noMoreWays = exports.nextTurn = exports.startGame = void 0;
const models_1 = require("../db/models");
const setup_1 = require("../setup");
const sequelize_1 = require("sequelize");
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
const startGame = async (req, res) => {
    let status = 500;
    try {
        const { map } = await models_1.Maps.generateMap();
        if (!map)
            throw true;
        const game = await models_1.Games.create({
            lobby_id: req.session.lobby.id,
            map_id: map[0].id,
        });
        if (!game)
            throw true;
        req.session.game = game;
        const { set, symbols } = await models_1.Sets.generateRuSet(game.id);
        if (!set)
            throw true;
        const { field } = await models_1.Fields.generateField(game.id);
        if (!field)
            throw true;
        const allPlayers = await models_1.Players.findAll({
            where: {
                lobby_id: req.session.lobby.id,
            },
        });
        const setResult = await models_1.Sets.getSet(game.id, true);
        if (!setResult || !setResult.symbols)
            throw true;
        shuffle(setResult.symbols);
        for (let i = 0; i < allPlayers.length; i++) {
            await allPlayers[i].update({
                points: 0
            });
            const hand = await models_1.Hands.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.startGame = startGame;
const nextTurn = async (req, res) => {
    let status = 500;
    try {
        const game = await models_1.Games.findOne({
            where: {
                lobby_id: req.session.lobby.id
            }
        });
        if (!game)
            throw true;
        const allPlayers = await models_1.Players.findAll({
            where: {
                lobby_id: req.session.lobby.id,
            },
        });
        const currentPlayer = await models_1.Players.findOne({
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
        const currentHand = await models_1.Hands.findOne({
            where: {
                player_id: currentPlayer.id
            }
        });
        if (!currentHand)
            throw true;
        const { set, symbols } = await models_1.Sets.getSet(game.id, true);
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.nextTurn = nextTurn;
const noMoreWays = async (req, res) => {
    let status = 500;
    try {
        const player = await models_1.Players.findOne({
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
        const playersWithTurns = await models_1.Players.findAll({
            where: {
                lobby_id: req.session.lobby.id,
                is_ended: false
            }
        });
        if (playersWithTurns.length === 0) {
            setup_1.io.to(req.session.lobby.invite_id).emit('gameEnded');
        }
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
exports.noMoreWays = noMoreWays;
const exitGame = async (req, res) => {
    let status = 500;
    try {
        const player = await models_1.Players.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                user_id: req.body.user_id
            },
        });
        if (!player)
            throw true;
        const playerSlot = player.slot;
        const currentHand = await models_1.Hands.findOne({
            where: {
                player_id: player.id
            }
        });
        if (!currentHand)
            throw true;
        await currentHand.destroy();
        await player.destroy();
        const allPlayers = await models_1.Players.findAll({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.exitGame = exitGame;
const removeSymbolInField = async (req, res) => {
    let status = 500;
    try {
        if (!req.session.game)
            throw true;
        const fieldCell = await models_1.FieldCells.findOne({
            where: {
                id: req.body.cellId
            }
        });
        if (!fieldCell)
            throw true;
        let toValue = null;
        if (req.body.toSlot) {
            const currentPlayer = await models_1.Players.findOne({
                where: {
                    lobby_id: req.session.lobby.id,
                    slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
                },
            });
            if (!currentPlayer)
                throw true;
            const currentHand = await models_1.Hands.findOne({
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
            const fieldCell = await models_1.FieldCells.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.removeSymbolInField = removeSymbolInField;
const insertSymbolInField = async (req, res) => {
    let status = 500;
    try {
        if (!req.session.game)
            throw true;
        const fieldCell = await models_1.FieldCells.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.insertSymbolInField = insertSymbolInField;
const removeSymbolInHand = async (req, res) => {
    let status = 500;
    try {
        if (!req.session.game)
            throw true;
        const currentPlayer = await models_1.Players.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
            },
        });
        if (!currentPlayer)
            throw true;
        const currentHand = await models_1.Hands.findOne({
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
            const fieldCell = await models_1.FieldCells.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.removeSymbolInHand = removeSymbolInHand;
const insertSymbolInHand = async (req, res) => {
    let status = 500;
    try {
        if (!req.session.game)
            throw true;
        const currentPlayer = await models_1.Players.findOne({
            where: {
                lobby_id: req.session.lobby.id,
                slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
            },
        });
        if (!currentPlayer)
            throw true;
        const currentHand = await models_1.Hands.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.insertSymbolInHand = insertSymbolInHand;
const insertSymbolInSet = async (req, res) => {
    let status = 500;
    try {
        if (!req.session.game)
            throw true;
        const symbol = await models_1.Symbols.findOne({
            where: {
                id: req.body.symbolId
            }
        });
        if (!symbol)
            throw true;
        const fieldCell = await models_1.FieldCells.findOne({
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
            const currentHand = await models_1.Hands.findOne({
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
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.insertSymbolInSet = insertSymbolInSet;
const getBoard = async (req, res) => {
    let status = 500;
    let result = null;
    try {
        if (!req.session.game)
            throw true;
        const { field, fieldCells } = await models_1.Fields.generateField(req.session.game.id);
        if (!field)
            throw true;
        result = fieldCells;
        status = 200;
    }
    catch (err) {
        console.log(err);
        status = 500;
    }
    finally {
        res.status(status);
        res.json(result);
    }
};
exports.getBoard = getBoard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZUNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb250cm9sbGVycy9nYW1lQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBOEY7QUFDOUYsb0NBQThCO0FBQzlCLHlDQUErQjtBQUkvQixTQUFTLGNBQWMsQ0FBQyxJQUFZLEVBQUUsWUFBb0I7SUFDeEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsUUFBTyxJQUFJLEdBQUcsWUFBWSxFQUFFO1FBQzFCLEtBQUssQ0FBQztZQUNKLElBQUksR0FBRyxDQUFDLENBQUM7WUFDVCxNQUFNO1FBQ1IsS0FBSyxDQUFDO1lBQ0osSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNULE1BQU07UUFDUixLQUFLLENBQUM7WUFDSixJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ1QsTUFBTTtRQUNSLEtBQUssQ0FBQztZQUNKLElBQUksR0FBRyxDQUFDLENBQUM7WUFDVCxNQUFNO0tBQ1Q7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFpQjtJQUNoQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsS0FBSyxVQUFVLFFBQVEsQ0FBQyxPQUFrQixFQUFFLFdBQWtCO0lBQzVELElBQUc7UUFDRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBRyxNQUFNLEVBQUU7WUFDVCxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTthQUN6RCxDQUFDLENBQUM7WUFDSCxNQUFNLE1BQU0sQ0FBQyxN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QUMxQixFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQzt3QkFDMUIsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7d0JBQzFCLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO3dCQUMxQixFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQzt3QkFDMUIsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7d0JBQzFCLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO3FCQUMzQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILElBQUcsV0FBVyxFQUFFO2dCQUNkLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ3hDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO3FCQUNDLElBQUcsV0FBVyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzdDLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO2FBQ0w7U0FDRjtRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDWixNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQTtRQUVGLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNkO0FBQ0gsQ0FBQyxDQUFBO0FBdkZZLFFBQUEsaUJBQWlCLHFCQXVGN0I7QUFFTSxNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7SUFDNUUsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztJQUNsQixJQUFJO1FBQ0YsSUFBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUNsQixNQUFNLElBQUksQ0FBQztRQUViLE1BQU0sRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFDLEdBQUcsTUFBTSxlQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUcsQ0FBQyxLQUFLO1lBQ1AsTUFBTSxJQUFJLENBQUM7UUFFYixNQUFNLEdBQUcsVUFBVSxDQUFDO1FBRXBCLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FDZDtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQTtBQXZCWSxRQUFBLFFBQVEsWUF1QnBCIn0=