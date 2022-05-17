"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const models_1 = require("./models");
const associate = function () {
    //Users
    //Friends
    models_1.Users.belongsToMany(models_1.Users, {
        through: models_1.Friends,
        as: 'Users',
        foreignKey: 'user_id'
    });
    models_1.Users.belongsToMany(models_1.Users, {
        through: models_1.Friends,
        as: 'Friends',
        foreignKey: 'friend_id'
    });
    //Players
    models_1.Users.hasMany(models_1.Players, {
        foreignKey: "user_id",
    });
    models_1.Players.belongsTo(models_1.Users, {
        foreignKey: "user_id",
    });
    models_1.Lobbies.hasMany(models_1.Players, {
        foreignKey: "lobby_id",
    });
    models_1.Players.belongsTo(models_1.Lobbies, {
        foreignKey: "lobby_id",
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
    models_1.Sets.hasMany(models_1.Games, {
        foreignKey: "set_id",
    });
    models_1.Games.belongsTo(models_1.Sets, {
        foreignKey: "set_id",
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
    //Symbols
    models_1.Sets.hasMany(models_1.Symbols, {
        foreignKey: "set_id",
    });
    models_1.Symbols.belongsTo(models_1.Sets, {
        foreignKey: "set_id",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzb2NpYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvYXNzb2NpYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQWFrQjtBQUdYLE1BQU0sU0FBUyxHQUFHO0lBQ3ZCLE9BQU87SUFFUCxTQUFTO0lBQ1QsY0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFLLEVBQUU7UUFDekIsT0FBTyxFQUFFLGdCQUFPO1FBQ2hCLEVBQUUsRUFBRSxPQUFPO1FBQ1gsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsY0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFLLEVBQUU7UUFDekIsT0FBTyxFQUFFLGdCQUFPO1FBQ2hCLEVBQUUsRUFBRSxTQUFTO1FBQ2IsVUFBVSxFQUFFLFdBQVc7S0FDeEIsQ0FBQyxDQUFDO0lBRUgsU0FBUztJQUNULGNBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQU8sRUFBRTtRQUNyQixVQUFVLEVBQUUsU0FBUztLQUN0QixDQUFDLENBQUM7SUFDSCxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxjQUFLLEVBQUU7UUFDdkIsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQU8sRUFBRTtRQUN2QixVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFDSCxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxnQkFBTyxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUVILFNBQVM7SUFDVCxjQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFPLEVBQUU7UUFDcEIsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBQ0gsZ0JBQU8sQ0FBQyxTQUFTLENBQUMsY0FBSyxFQUFFO1FBQ3ZCLFVBQVUsRUFBRSxTQUFTO0tBQ3RCLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxnQkFBTyxDQUFDLE1BQU0sQ0FBQyxjQUFLLEVBQUU7UUFDcEIsVUFBVSxFQUFFLFVBQVU7S0FDdkIsQ0FBQyxDQUFDO0lBQ0gsY0FBSyxDQUFDLFNBQVMsQ0FBQyxnQkFBTyxFQUFFO1FBQ3ZCLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUVILGFBQUksQ0FBQyxPQUFPLENBQUMsY0FBSyxFQUFFO1FBQ2xCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUNILGNBQUssQ0FBQyxTQUFTLENBQUMsYUFBSSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUVILGFBQUksQ0FBQyxPQUFPLENBQUMsY0FBSyxFQUFFO1FBQ2xCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUNILGNBQUssQ0FBQyxTQUFTLENBQUMsYUFBSSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUVILFFBQVE7SUFDUixjQUFLLENBQUMsTUFBTSxDQUFDLGVBQU0sRUFBRTtRQUNuQixVQUFVLEVBQUUsU0FBUztLQUN0QixDQUFDLENBQUM7SUFDSCxlQUFNLENBQUMsU0FBUyxDQUFDLGNBQUssRUFBRTtRQUN0QixVQUFVLEVBQUUsU0FBUztLQUN0QixDQUFDLENBQUM7SUFFSCxZQUFZO0lBQ1osZUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBVSxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUNILG1CQUFVLENBQUMsU0FBUyxDQUFDLGVBQU0sRUFBRTtRQUMzQixVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFFSCxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBVSxFQUFFO1FBQzFCLFVBQVUsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQztJQUNILG1CQUFVLENBQUMsU0FBUyxDQUFDLGdCQUFPLEVBQUU7UUFDNUIsVUFBVSxFQUFFLFdBQVc7S0FDeEIsQ0FBQyxDQUFDO0lBRUgsTUFBTTtJQUVOLFNBQVM7SUFDVCxhQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFPLEVBQUU7UUFDcEIsVUFBVSxFQUFFLFFBQVE7S0FDckIsQ0FBQyxDQUFDO0lBQ0gsZ0JBQU8sQ0FBQyxTQUFTLENBQUMsYUFBSSxFQUFFO1FBQ3RCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUVILE1BQU07SUFFTixVQUFVO0lBQ1YsYUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBUSxFQUFFO1FBQ3JCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUNILGlCQUFRLENBQUMsU0FBUyxDQUFDLGFBQUksRUFBRTtRQUN2QixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFFSCxzQkFBYSxDQUFDLE9BQU8sQ0FBQyxpQkFBUSxFQUFFO1FBQzlCLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsaUJBQVEsQ0FBQyxTQUFTLENBQUMsc0JBQWEsRUFBRTtRQUNoQyxVQUFVLEVBQUUsa0JBQWtCO0tBQy9CLENBQUMsQ0FBQztJQUVILGVBQWU7QUFDakIsQ0FBQyxDQUFBO0FBaEhZLFFBQUEsU0FBUyxhQWdIckIifQ==