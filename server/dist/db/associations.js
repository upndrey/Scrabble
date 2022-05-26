"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const Hands_1 = __importDefault(require("../models/Hands"));
const models_1 = require("./models");
const associate = function () {
    //Users
    //Friends
    models_1.Users.belongsToMany(models_1.Users, {
        through: models_1.Friends,
        as: 'user',
        foreignKey: 'user_id'
    });
    models_1.Users.belongsToMany(models_1.Users, {
        through: models_1.Friends,
        as: 'friend',
        foreignKey: 'friend_id'
    });
    //Players
    models_1.Users.hasMany(models_1.Players, {
        foreignKey: "user_id",
        as: 'player'
    });
    models_1.Players.belongsTo(models_1.Users, {
        foreignKey: "user_id",
        as: 'player'
    });
    models_1.Lobbies.hasMany(models_1.Players, {
        foreignKey: "lobby_id",
    });
    models_1.Players.belongsTo(models_1.Lobbies, {
        foreignKey: "lobby_id",
    });
    //Hands
    models_1.Players.hasOne(Hands_1.default, {
        foreignKey: "player_id",
        as: 'hand'
    });
    Hands_1.default.belongsTo(models_1.Players, {
        foreignKey: "player_id",
        as: 'hand'
    });
    //Lobbies
    models_1.Users.hasOne(models_1.Lobbies, {
        foreignKey: "host_id",
    });
    models_1.Lobbies.belongsTo(models_1.Users, {
        foreignKey: "host_id",
    });
    //Games
    models_1.Lobbies.hasOne(models_1.Games, {
        foreignKey: "lobby_id",
    });
    models_1.Games.belongsTo(models_1.Lobbies, {
        foreignKey: "lobby_id",
    });
    models_1.Maps.hasMany(models_1.Games, {
        foreignKey: "map_id",
    });
    models_1.Games.belongsTo(models_1.Maps, {
        foreignKey: "map_id",
    });
    //Fields
    models_1.Games.hasOne(models_1.Fields, {
        foreignKey: "game_id",
    });
    models_1.Fields.belongsTo(models_1.Games, {
        foreignKey: "game_id",
    });
    //FieldCells
    models_1.Fields.hasMany(models_1.FieldCells, {
        foreignKey: "field_id",
    });
    models_1.FieldCells.belongsTo(models_1.Fields, {
        foreignKey: "field_id",
    });
    models_1.Symbols.hasMany(models_1.FieldCells, {
        foreignKey: "symbol_id",
    });
    models_1.FieldCells.belongsTo(models_1.Symbols, {
        foreignKey: "symbol_id",
    });
    //Sets
    models_1.Games.hasOne(models_1.Sets, {
        foreignKey: "game_id",
        as: 'set'
    });
    models_1.Sets.belongsTo(models_1.Games, {
        foreignKey: "game_id",
        as: 'set'
    });
    //Symbols
    models_1.Sets.hasMany(models_1.Symbols, {
        foreignKey: "set_id",
    });
    models_1.Symbols.belongsTo(models_1.Sets, {
        foreignKey: "set_id",
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot1",
        as: 'slot1_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot1",
        as: 'slot1_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot2",
        as: 'slot2_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot2",
        as: 'slot2_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot3",
        as: 'slot3_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot3",
        as: 'slot3_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot4",
        as: 'slot4_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot4",
        as: 'slot4_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot5",
        as: 'slot5_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot5",
        as: 'slot5_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot6",
        as: 'slot6_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot6",
        as: 'slot6_symbol'
    });
    models_1.Symbols.hasOne(Hands_1.default, {
        foreignKey: "slot7",
        as: 'slot7_symbol'
    });
    Hands_1.default.belongsTo(models_1.Symbols, {
        foreignKey: "slot7",
        as: 'slot7_symbol'
    });
    //Maps
    //MapCells
    models_1.Maps.hasMany(models_1.MapCells, {
        foreignKey: "map_id",
    });
    models_1.MapCells.belongsTo(models_1.Maps, {
        foreignKey: "map_id",
    });
    models_1.CellModifiers.hasMany(models_1.MapCells, {
        foreignKey: "cell_modifier_id",
    });
    models_1.MapCells.belongsTo(models_1.CellModifiers, {
        foreignKey: "cell_modifier_id",
    });
    //CellModifiers
};
exports.associate = associate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzb2NpYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvYXNzb2NpYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFvQztBQUNwQyxxQ0Fha0I7QUFHWCxNQUFNLFNBQVMsR0FBRztJQUN2QixPQUFPO0lBRVAsU0FBUztJQUNULGNBQUssQ0FBQyxhQUFhLENBQUMsY0FBSyxFQUFFO1FBQ3pCLE9BQU8sRUFBRSxnQkFBTztRQUNoQixFQUFFLEVBQUUsTUFBTTtRQUNWLFVBQVUsRUFBRSxTQUFTO0tBQ3RCLENBQUMsQ0FBQztJQUVILGNBQUssQ0FBQyxhQUFhLENBQUMsY0FBSyxFQUFFO1FBQ3pCLE9BQU8sRUFBRSxnQkFBTztRQUNoQixFQUFFLEVBQUUsUUFBUTtRQUNaLFVBQVUsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQztJQUVILFNBQVM7SUFDVCxjQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFPLEVBQUU7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsRUFBRSxFQUFFLFFBQVE7S0FDYixDQUFDLENBQUM7SUFDSCxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxjQUFLLEVBQUU7UUFDdkIsVUFBVSxFQUFFLFNBQVM7UUFDckIsRUFBRSxFQUFFLFFBQVE7S0FDYixDQUFDLENBQUM7SUFFSCxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBTyxFQUFFO1FBQ3ZCLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUNILGdCQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFPLEVBQUU7UUFDekIsVUFBVSxFQUFFLFVBQVU7S0FDdkIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLGdCQUFPLENBQUMsTUFBTSxDQUFDLGVBQUssRUFBRTtRQUNwQixVQUFVLEVBQUUsV0FBVztRQUN2QixFQUFFLEVBQUUsTUFBTTtLQUNYLENBQUMsQ0FBQTtJQUNGLGVBQUssQ0FBQyxTQUFTLENBQUMsZ0JBQU8sRUFBRTtR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