"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllFriends = exports.removeFriend = exports.addFriend = void 0;
const models_1 = require("../db/models");
const addFriend = async (req, res) => {
    let status = 500;
    try {
        const user = await models_1.Users.findOne({
            where: {
                login: req.body.login,
            }
        });
        const friend = await models_1.Users.findOne({
            where: {
                login: req.body.friend,
            }
        });
        if (user && friend) {
            const friendBackDb = await models_1.Friends.findOne({
                where: {
                    user_id: friend.id,
                    friend_id: user.id
                }
            });
            const friendDb = await models_1.Friends.findOrCreate({
                where: {
                    user_id: user.id,
                    friend_id: friend.id
                },
                defaults: {
                    user_id: user.id,
                    friend_id: friend.id
                }
            });
            if (friendBackDb) {
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
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.addFriend = addFriend;
const removeFriend = async (req, res) => {
    let status = 500;
    try {
        const user = await models_1.Users.findOne({
            where: {
                login: req.body.login,
            }
        });
        const friend = await models_1.Users.findOne({
            where: {
                login: req.body.friend,
            }
        });
        if (user && friend) {
            const friendBackDb = await models_1.Friends.findOne({
                where: {
                    user_id: friend.id,
                    friend_id: user.id
                }
            });
            const friendDb = await models_1.Friends.findOne({
                where: {
                    user_id: user.id,
                    friend_id: friend.id
                }
            });
            await (friendDb === null || friendDb === void 0 ? void 0 : friendDb.destroy());
            await (friendBackDb === null || friendBackDb === void 0 ? void 0 : friendBackDb.destroy());
            status = 200;
        }
        else
            status = 401;
    }
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json({});
    }
};
exports.removeFriend = removeFriend;
const findAllFriends = async (req, res) => {
    let status = 500;
    let friends = [];
    try {
        const user = await models_1.Users.findOne({
            where: {
                login: req.body.login
            }
        });
        if (user) {
            friends = await models_1.Users.findAll({
                attributes: ['login'],
                where: {
                    id: user.id
                },
                include: {
                    model: models_1.Users,
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
    catch (err) {
        status = 500;
    }
    finally {
        res.status(status);
        res.json(friends);
    }
};
exports.findAllFriends = findAllFriends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJpZW5kc0NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb250cm9sbGVycy9mcmllbmRzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBOEM7QUFFdkMsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO0lBQzdFLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2pDLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxJQUFJLElBQUksTUFBTSxFQUFFO1lBQ2pCLE1BQU0sWUFBWSxHQUFHLE1BQU0sZ0JBQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ3pDLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRTtpQkFDbkI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLGdCQUFPLENBQUMsWUFBWSxDQUFDO2dCQUMxQyxLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNoQixTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7aUJBQ3JCO2dCQUNELFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTtpQkFDckI7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFHLFlBQVksRUFBRTtnQkFDZixNQUFNLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ3ZCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDO29CQUN4QixXQUFXLEVBQUUsSUFBSTtpQkFDbEIsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2Q7O1lBRUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNoQjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBQ1QsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO1lBQ087UUFDTixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDZDtBQUNILENBQUMsQ0FBQTtBQW5EWSxRQUFBLFNBQVMsYUFtRHJCO0FBRU0sTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUFFLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO0lBQ2hGLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNqQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2pDLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBRyxJQUFJLElBQUksTUFBTSxFQUFFO1lBQ2pCLE1BQU0sWUFBWSxHQUFHLE1BQU0sZ0JBQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ3pDLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRTtpQkFDbkI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLGdCQUFPLENBQUMsT0FBTyxDQUFDO2dCQUNyQyxLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNoQixTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7aUJBQ3JCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFBLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLEVBQUUsQ0FBQSxDQUFDO1lBQzFCLE1BQU0sQ0FBQSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsT0FBTyxFQUFFLENBQUEsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2Q7O1lBRUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNoQjtJQUNELE9BQU0sR0FBRyxFQUFFO1FBRVQsTUFBTSxHQUFHLEdBQUcsQ0FBQztLQUNkO1lBQ087UUFDTixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDZDtBQUNILENBQUMsQ0FBQTtBQXpDWSxRQUFBLFlBQVksZ0JBeUN4QjtBQUVNLE1BQU0sY0FBYyxHQUFHLEtBQUssRUFBRSxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtJQUNsRixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFDakIsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzNCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxNQUFNLGNBQUssQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFHLElBQUksRUFBRTtZQUNQLE9BQU8sR0FBRyxNQUFNLGNBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDckIsS0FBSyxFQUFFO29CQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtpQkFDWjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsS0FBSyxFQUFFLGNBQUs7b0JBQ1osVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO29CQUNyQixFQUFFLEVBQUUsUUFBUTtvQkFDWixRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFOzRCQUNMLFdBQVcsRUFBRSxJQUFJO3lCQUNsQjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7U0FDZDs7WUFFQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2hCO0lBQ0QsT0FBTSxHQUFHLEVBQUU7UUFDVCxNQUFNLEdBQUcsR0FBRyxDQUFDO0tBQ2Q7WUFDTztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNuQjtBQUNILENBQUMsQ0FBQTtBQXZDWSxRQUFBLGNBQWMsa0JBdUMxQiJ9