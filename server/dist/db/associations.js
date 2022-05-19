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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzb2NpYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvYXNzb2NpYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQWFrQjtBQUdYLE1BQU0sU0FBUyxHQUFHO0lBQ3ZCLE9BQU87SUFFUCxTQUFTO0lBQ1QsY0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFLLEVBQUU7UUFDekIsT0FBTyxFQUFFLGdCQUFPO1FBQ2hCLEVBQUUsRUFBRSxPQUFPO1FBQ1gsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsY0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFLLEVBQUU7UUFDekIsT0FBTyxFQUFFLGdCQUFPO1FBQ2hCLEVBQUUsRUFBRSxTQUFTO1FBQ2IsVUFBVSxFQUFFLFdBQVc7S0FDeEIsQ0FBQyxDQUFDO0lBRUgsU0FBUztJQUNULGNBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQU8sRUFBRTtRQUNyQixVQUFVLEVBQUUsU0FBUztRQUNyQixFQUFFLEVBQUUsUUFBUTtLQUNiLENBQUMsQ0FBQztJQUNILGdCQUFPLENBQUMsU0FBUyxDQUFDLGNBQUssRUFBRTtRQUN2QixVQUFVLEVBQUUsU0FBUztRQUNyQixFQUFFLEVBQUUsUUFBUTtLQUNiLENBQUMsQ0FBQztJQUVILGdCQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFPLEVBQUU7UUFDdkIsVUFBVSxFQUFFLFVBQVU7S0FDdkIsQ0FBQyxDQUFDO0lBQ0gsZ0JBQU8sQ0FBQyxTQUFTLENBQUMsZ0JBQU8sRUFBRTtRQUN6QixVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFFSCxTQUFTO0lBQ1QsY0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBTyxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxTQUFTO0tBQ3RCLENBQUMsQ0FBQztJQUNILGdCQUFPLENBQUMsU0FBUyxDQUFDLGNBQUssRUFBRTtRQUN2QixVQUFVLEVBQUUsU0FBUztLQUN0QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsZ0JBQU8sQ0FBQyxNQUFNLENBQUMsY0FBSyxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUNILGNBQUssQ0FBQyxTQUFTLENBQUMsZ0JBQU8sRUFBRTtRQUN2QixVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFFSCxhQUFJLENBQUMsT0FBTyxDQUFDLGNBQUssRUFBRTtRQUNsQixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFDSCxjQUFLLENBQUMsU0FBUyxDQUFDLGFBQUksRUFBRTtRQUNwQixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFFSCxhQUFJLENBQUMsT0FBTyxDQUFDLGNBQUssRUFBRTtRQUNsQixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFDSCxjQUFLLENBQUMsU0FBUyxDQUFDLGFBQUksRUFBRTtRQUNwQixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFFSCxRQUFRO0lBQ1IsY0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFNLEVBQUU7UUFDbkIsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBQ0gsZUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFLLEVBQUU7UUFDdEIsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsWUFBWTtJQUNaLGVBQU0sQ0FBQyxPQUFPLENBQUMsbUJBQVUsRUFBRTtRQUN6QixVQUFVLEVBQUUsVUFBVTtLQUN2QixDQUFDLENBQUM7SUFDSCxtQkFBVSxDQUFDLFNBQVMsQ0FBQyxlQUFNLEVBQUU7UUFDM0IsVUFBVSxFQUFFLFVBQVU7S0FDdkIsQ0FBQyxDQUFDO0lBRUgsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsbUJBQVUsRUFBRTtRQUMxQixVQUFVLEVBQUUsV0FBVztLQUN4QixDQUFDLENBQUM7SUFDSCxtQkFBVSxDQUFDLFNBQVMsQ0FBQyxnQkFBTyxFQUFFO1FBQzVCLFVBQVUsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQztJQUVILE1BQU07SUFFTixTQUFTO0lBQ1QsYUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBTyxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUNILGdCQUFPLENBQUMsU0FBUyxDQUFDLGFBQUksRUFBRTtRQUN0QixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFFSCxNQUFNO0lBRU4sVUFBVTtJQUNWLGFBQUksQ0FBQyxPQUFPLENBQUMsaUJBQVEsRUFBRTtRQUNyQixVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFDSCxpQkFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFJLEVBQUU7UUFDdkIsVUFBVSxFQUFFLFFBQVE7S0FDckIsQ0FBQyxDQUFDO0lBRUgsc0JBQWEsQ0FBQyxPQUFPLENBQUMsaUJBQVEsRUFBRTtRQUM5QixVQUFVLEVBQUUsa0JBQWtCO0tBQy9CLENBQUMsQ0FBQztJQUNILGlCQUFRLENBQUMsU0FBUyxDQUFDLHNCQUFhLEVBQUU7UUFDaEMsVUFBVSxFQUFFLGtCQUFrQjtLQUMvQixDQUFDLENBQUM7SUFFSCxlQUFlO0FBQ2pCLENBQUMsQ0FBQTtBQWxIWSxRQUFBLFNBQVMsYUFrSHJCIn0=