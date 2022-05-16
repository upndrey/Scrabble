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
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });

  Users.belongsToMany(Users, {
    through: Friends, 
    as: 'Friends',
    foreignKey: 'friend_id',
    onDelete: 'CASCADE'
  });

  //Players
  Users.hasMany(Players);
  Players.belongsTo(Users, {
    foreignKey: "user_id",
  });
  
  Lobbies.hasMany(Players);
  Players.belongsTo(Lobbies, {
    foreignKey: "lobby_id",
  });

  //Lobbies
  Users.hasOne(Lobbies);
  Lobbies.belongsTo(Users, {
    foreignKey: "host_id",
  });

  //Games
  Lobbies.hasOne(Games);
  Games.belongsTo(Lobbies, {
    foreignKey: "lobby_id",
  });

  Maps.hasMany(Games);
  Games.belongsTo(Maps, {
    foreignKey: "map_id",
  });

  Sets.hasMany(Games);
  Games.belongsTo(Sets, {
    foreignKey: "set_id",
  });

  //Fields
  Games.hasOne(Fields);
  Fields.belongsTo(Games, {
    foreignKey: "game_id",
  });

  //FieldCells
  Fields.hasMany(FieldCells);
  FieldCells.belongsTo(Fields, {
    foreignKey: "field_id",
  });

  Symbols.hasMany(FieldCells);
  FieldCells.belongsTo(Symbols, {
    foreignKey: "symbol_id",
  });

  //Sets

  //Symbols
  Sets.hasMany(Symbols);
  Symbols.belongsTo(Sets, {
    foreignKey: "set_id",
  });

  //Maps

  //MapCells
  Maps.hasMany(MapCells);
  MapCells.belongsTo(Maps, {
    foreignKey: "map_id",
  });
  
  CellModifiers.hasMany(MapCells);
  MapCells.belongsTo(CellModifiers, {
    foreignKey: "cell_modifier_id",
  });

  //CellModifiers
}