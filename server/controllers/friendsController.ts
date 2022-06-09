import * as express from 'express'; 
import { Friends, Users } from '../db/models';

export const addFriend = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login,
      }
    });
    const friend = await Users.findOne({
      where: {
        login: req.body.friend,
      }
    });
    if(user && friend) {
      const friendBackDb = await Friends.findOne({
        where: {
          user_id: friend.id,
          friend_id: user.id
        }
      });
      const friendDb = await Friends.findOrCreate({
        where: {
          user_id: user.id,
          friend_id: friend.id
        },
        defaults: {
          user_id: user.id,
          friend_id: friend.id
        }
      });

      if(friendBackDb) {
        await friendDb[0].update({
          is_accepted: true
        });
        await friendBackDb.update({
          is_accepted: true
        });
      }
      status = 200;
    }
    else
      status = 401;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const removeFriend = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login,
      }
    });
    const friend = await Users.findOne({
      where: {
        login: req.body.friend,
      }
    });
    if(user && friend) {
      const friendBackDb = await Friends.findOne({
        where: {
          user_id: friend.id,
          friend_id: user.id
        }
      });
      const friendDb = await Friends.findOne({
        where: {
          user_id: user.id,
          friend_id: friend.id
        }
      });
      await friendDb?.destroy();
      await friendBackDb?.destroy();
      status = 200;
    }
    else
      status = 401;
  }
  catch(err) {
    
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const findAllFriends = async (req: express.Request, res: express.Response) => {
  let status = 500;
  let friends : Users[] = [];
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login
      }
    });
    if(user) {
      friends = await Users.findAll({
        attributes: ['login'],
        where: {
          id: user.id
        },
        include: {
          model: Users,
          attributes: ['login'],
          as: 'friend',
          required: true,
          through: {
            where: {
              is_accepted: true
            }
          }
        }
      });
      status = 200;
    } 
    else
      status = 401;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json(friends);
  }
}