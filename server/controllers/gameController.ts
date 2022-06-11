import * as express from 'express'; 
import { FieldCells, Fields, Games, Hands, Maps, Players, Sets, Symbols } from '../db/models';
import { io } from '../setup';
import { Op } from "sequelize";



function findSlotByTurn(turn: number, playersCount: number) {
  let slot = 1;
  switch(turn % playersCount) {
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

function shuffle(array: Array<any>) {
  array.sort(() => Math.random() - 0.5);
}

async function fillHand(symbols: Symbols[], currentHand: Hands) {
  try{ 
    let symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot1: currentHand.slot1 ? currentHand.slot1 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot2: currentHand.slot2 ? currentHand.slot2 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot3: currentHand.slot3 ? currentHand.slot3 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot4: currentHand.slot4 ? currentHand.slot4 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot5: currentHand.slot5 ? currentHand.slot5 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot6: currentHand.slot6 ? currentHand.slot6 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot7: currentHand.slot7 ? currentHand.slot7 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  }
  catch(err) {
    
  }
}

export const startGame = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {

    const {map} = await Maps.generateMap();
    if(!map)
      throw true;

    const game = await Games.create({
      lobby_id: req.session.lobby.id,
      map_id: map[0].id,
    });
    if(!game)
      throw true;
    req.session.game = game;
    const {set, symbols} = await Sets.generateRuSet(game.id);
    if(!set)
      throw true;
    const {field} = await Fields.generateField(game.id);
    if(!field)
      throw true;

    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
      },
    });
      
    const setResult = await Sets.getSet(game.id, true);
    if(!setResult || !setResult.symbols)
      throw true;

    shuffle(setResult.symbols);

    for(let i = 0; i < allPlayers.length; i++) {
      await allPlayers[i].update({
        points: 0
      });
      const hand = await Hands.findOne({
        where: {
          player_id: allPlayers[i].id
        }
      });
      if(setResult?.symbols && hand)
        await fillHand(setResult.symbols, hand);
    }
    
    status = 200;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const nextTurn = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    const game = await Games.findOne({
      where: {
        lobby_id: req.session.lobby.id
      }
    })
    if(!game)
      throw true;
      
    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
      },
    });

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(game.turn, allPlayers.length)
      },
    });
    if(!currentPlayer)
      throw true;
    if(req.body.points) {
      await currentPlayer.update({
        points: currentPlayer.points + req.body.points
      })
    }
    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;
      
    const {set, symbols} = await Sets.getSet(game.id, true);
    if(!symbols)
      throw true;
    
    shuffle(symbols);

    await fillHand(symbols, currentHand);
    game.set({
      turn: game.turn + 1
    });
    await game.save();
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const noMoreWays = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    const player = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        user_id: req.body.user_id
      },
    });
    if(!player)
      throw true;
    
    await player.update({
      is_ended: true
    });

    const playersWithTurns = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
        is_ended: false
      }
    });
    if(playersWithTurns.length === 0) {
      io.to(req.session.lobby.invite_id).emit('gameEnded');
    }
    status = 200;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const exitGame = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    const player = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        user_id: req.body.user_id
      },
    });
    if(!player)
      throw true;

    const playerSlot = player.slot;
  
    const currentHand = await Hands.findOne({
      where: {
        player_id: player.id
      }
    })
    if(!currentHand)
      throw true;
    await currentHand.destroy();
    await player.destroy();

    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
        slot: {
          [Op.gt]: playerSlot
        }
      },
    });

    allPlayers.forEach(async (row) => {
      await row.update({
        slot: row.slot - 1
      })
    });

    if(req.session.lobby)
      req.session.lobby = null!;
    if(req.session.game)
      req.session.game = null!;

    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const removeSymbolInField = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    if(!req.session.game)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        id: req.body.cellId
      }
    })
    if(!fieldCell)
      throw true;

        
      let toValue = null;
      if(req.body.toSlot) {
        const currentPlayer = await Players.findOne({
          where: {
            lobby_id: req.session.lobby.id,
            slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
          },
        });

        if(!currentPlayer)
          throw true;
        
        const currentHand = await Hands.findOne({
          where: {
            player_id: currentPlayer.id
          }
        })
  
        if(!currentHand)
          throw true;

        switch(req.body.toSlot) {
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
      else if(req.body.toCell) {
        const fieldCell = await FieldCells.findOne({
          where: {
            id: req.body.toCell
          }
        });
        toValue = fieldCell?.symbol_id;
      }

    await fieldCell?.update({
      symbol_id: toValue
    });
    
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const insertSymbolInField = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    if(!req.session.game)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        id: req.body.cellId
      }
    })
    if(!fieldCell)
      throw true;

    await fieldCell?.update({
      symbol_id: req.body.symbolId
    });
    
    status = 200;
  }
  catch(err) {
    
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const removeSymbolInHand = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    if(!req.session.game)
      throw true;

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
      },
    });
    if(!currentPlayer)
      throw true;

    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;

    let toValue = null;
    if(req.body.toSlot) {
      switch(req.body.toSlot) {
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
    else if(req.body.toCell) {
      const fieldCell = await FieldCells.findOne({
        where: {
          id: req.body.toCell
        }
      });
      toValue = fieldCell?.symbol_id;
    }
    
    switch(req.body.slot) {
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
  catch(err) {
    
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const insertSymbolInHand = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    if(!req.session.game)
      throw true;

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
      },
    });
    if(!currentPlayer)
      throw true;

    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;
    
    switch(req.body.slot) {
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
  catch(err) {
    
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const insertSymbolInSet = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    if(!req.session.game)
      throw true;
    
    const symbol = await Symbols.findOne({
      where: {
        id: req.body.symbolId
      }
    });

    if(!symbol)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        symbol_id: req.body.symbolId
      }
    });

    if(fieldCell) {
      await fieldCell.update({
        symbol_id: null
      })
    }
    else {
      const currentHand = await Hands.findOne({
        where: {
          [Op.or]: [
            {slot1: req.body.symbolId},
            {slot2: req.body.symbolId},
            {slot3: req.body.symbolId},
            {slot4: req.body.symbolId},
            {slot5: req.body.symbolId},
            {slot6: req.body.symbolId},
            {slot7: req.body.symbolId}
          ]
        }
      });
  
      if(currentHand) {
        if(currentHand.slot1 === req.body.symbolId)
          await currentHand.update({
            slot1: null
          })
        else if(currentHand.slot2 === req.body.symbolId)
          await currentHand.update({
            slot2: null
          })
        else if(currentHand.slot3 === req.body.symbolId)
          await currentHand.update({
            slot3: null
          })
        else if(currentHand.slot4 === req.body.symbolId)
          await currentHand.update({
            slot4: null
          })
        else if(currentHand.slot5 === req.body.symbolId)
          await currentHand.update({
            slot5: null
          })
        else if(currentHand.slot6 === req.body.symbolId)
          await currentHand.update({
            slot6: null
          })
        else if(currentHand.slot7 === req.body.symbolId)
          await currentHand.update({
            slot7: null
          })
      }
    }
    
    symbol.update({
      in_box: true
    })
    
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const getBoard = async (req: express.Request, res: express.Response) => {
  let status = 500;
  let result = null;
  try {
    if(!req.session.game)
      throw true;

    const {field, fieldCells} = await Fields.generateField(req.session.game.id);
    if(!field)
      throw true;
    
    result = fieldCells;
    
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 500;
  }
  finally {
    res.status(status);
    res.json(result);
  }
}
