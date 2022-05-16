"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../models/Users"));
const Friends_1 = __importDefault(require("../models/Friends"));
Users_1.default.belongsToMany(Users_1.default, {
    through: Friends_1.default,
    as: 'Users',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
Users_1.default.belongsToMany(Users_1.default, {
    through: Friends_1.default,
    as: 'Friends',
    foreignKey: 'friend_id',
    onDelete: 'CASCADE'
});
(async () => {
    await Friends_1.default.sync({ alter: true });
    await Users_1.default.sync({ alter: true });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzb2NpYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGIvYXNzb2NpYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQW9DO0FBQ3BDLGdFQUF3QztBQUN4QyxlQUFLLENBQUMsYUFBYSxDQUFDLGVBQUssRUFBRTtJQUN6QixPQUFPLEVBQUUsaUJBQU87SUFDaEIsRUFBRSxFQUFFLE9BQU87SUFDWCxVQUFVLEVBQUUsU0FBUztJQUNyQixRQUFRLEVBQUUsU0FBUztDQUNwQixDQUFDLENBQUM7QUFDSCxlQUFLLENBQUMsYUFBYSxDQUFDLGVBQUssRUFBRTtJQUN6QixPQUFPLEVBQUUsaUJBQU87SUFDaEIsRUFBRSxFQUFFLFNBQVM7SUFDYixVQUFVLEVBQUUsV0FBVztJQUN2QixRQUFRLEVBQUUsU0FBUztDQUNwQixDQUFDLENBQUM7QUFFSCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1YsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==