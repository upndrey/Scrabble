import {
  Users, 
  Friends,
  Players,
  Lobbies,
  Games,
  Fields,
  Maps,
  Sets,
  FieldCells,
  Symbols,
  MapCells,
  CellModifiers
} from './models';


export const associate = function() {
  //Users

  //Friends
  Users.belongsToMany(Users, {
    through: Friends, 
    as: 'Users',
    foreignKey: 'user_id'
  });

  Users.belongsToMany(Users, {
    through: Friends, 
    as: 'Friends',
    foreignKey: 'friend_id'
  });

  //Players
  Users.hasMany(Players, {
    foreignKey: "user_id",
  });
  Players.belongsTo(Users, {
    foreignKey: "user_id",
  });
  
  Lobbies.hasMany(Players, {
    foreignKey: "lobby_id",
  });
  Players.belongsTo(Lobbies, {
    foreignKey: "lobby_id",
  });

  //Lobbies
  Users.hasOne(Lobbies, {
    foreignKey: "host_id",
  });
  Lobbies.belongsTo(Users, {
    foreignKey: "host_id",
  });

  //Games
  Lobbies.hasOne(Games, {
    foreignKey: "lobby_id",
  });
  Games.belongsTo(Lobbies, {
    foreignKey: "lobby_id",
  });

  Maps.hasMany(Games, {
    foreignKey: "map_id",
  });
  Games.belongsTo(Maps, {
    foreignKey: "map_id",
  });

  Sets.hasMany(Games, {
    foreignKey: "set_id",
  });
  Games.belongsTo(Sets, {
    foreignKey: "set_id",
  });

  //Fields
  Games.hasOne(Fields, {
    foreignKey: "game_id",
  });
  Fields.belongsTo(Games, {
    foreignKey: "game_id",
  });

  //FieldCells
  Fields.hasMany(FieldCells, {
    foreignKey: "field_id",
  });
  FieldCells.belongsTo(Fields, {
    foreignKey: "field_id",
  });

  Symbols.hasMany(FieldCells, {
    foreignKey: "symbol_id",
  });
  FieldCells.belongsTo(Symbols, {
    foreignKey: "symbol_id",
  });

  //Sets

  //Symbols
  Sets.hasMany(Symbols, {
    foreignKey: "set_id",
  });
  Symbols.belongsTo(Sets, {
    foreignKey: "set_id",
  });

  //Maps

  //MapCells
  Maps.hasMany(MapCells, {
    foreignKey: "map_id",
  });
  MapCells.belongsTo(Maps, {
    foreignKey: "map_id",
  });
  
  CellModifiers.hasMany(MapCells, {
    foreignKey: "cell_modifier_id",
  });
  MapCells.belongsTo(CellModifiers, {
    foreignKey: "cell_modifier_id",
  });

  //CellModifiers
}