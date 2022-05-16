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

export const init = async function() {
  await Friends.sync({ alter: true });
  await Users.sync({ alter: true });
  await Players.sync({ alter: true });
  await Lobbies.sync({ alter: true });
  await Games.sync({ alter: true });
  await Fields.sync({ alter: true });
  await Maps.sync({ alter: true });
  await Sets.sync({ alter: true });
  await FieldCells.sync({ alter: true });
  await Symbols.sync({ alter: true });
  await MapCells.sync({ alter: true });
  await CellModifiers.sync({ alter: true });
}