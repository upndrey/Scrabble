import Hands from '../models/Hands';
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
    as: 'user',
    foreignKey: 'user_id'
  });

  Users.belongsToMany(Users, {
    through: Friends, 
    as: 'friend',
    foreignKey: 'friend_id'
  });

  //Players
  Users.hasMany(Players, {
    foreignKey: "user_id",
    as: 'player'
  });
  Players.belongsTo(Users, {
    foreignKey: "user_id",
    as: 'player'
  });
  
  Lobbies.hasMany(Players, {
    foreignKey: "lobby_id",
  });
  Players.belongsTo(Lobbies, {
    foreignKey: "lobby_id",
  });

  //Hands
  Players.hasOne(Hands, {
    foreignKey: "player_id",
    as: 'hand'
  })
  Hands.belongsTo(Players, {
    foreignKey: "player_id",
    as: 'hand'
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
  Games.hasOne(Sets, {
    foreignKey: "game_id",
    as: 'set'
  });
  Sets.belongsTo(Games, {
    foreignKey: "game_id",
    as: 'set'
  });

  //Symbols
  Sets.hasMany(Symbols, {
    foreignKey: "set_id",
  });
  Symbols.belongsTo(Sets, {
    foreignKey: "set_id",
  });

  
  Symbols.hasOne(Hands, {
    foreignKey: "slot1",
    as: 'slot1_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot1",
    as: 'slot1_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot2",
    as: 'slot2_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot2",
    as: 'slot2_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot3",
    as: 'slot3_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot3",
    as: 'slot3_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot4",
    as: 'slot4_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot4",
    as: 'slot4_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot5",
    as: 'slot5_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot5",
    as: 'slot5_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot6",
    as: 'slot6_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot6",
    as: 'slot6_symbol'
  });
  Symbols.hasOne(Hands, {
    foreignKey: "slot7",
    as: 'slot7_symbol'
  });
  Hands.belongsTo(Symbols, {
    foreignKey: "slot7",
    as: 'slot7_symbol'
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