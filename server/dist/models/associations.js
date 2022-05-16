"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("./Users"));
const Friends_1 = __importDefault(require("./Friends"));
Users_1.default.belongsToMany(Users_1.default, { through: Friends_1.default, as: 'user_id' });
Users_1.default.belongsToMany(Users_1.default, { through: Friends_1.default, as: 'friend_id' });
(async () => {
    await Users_1.default.sync({ alter: true });
    await Friends_1.default.sync({ alter: true });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzb2NpYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL2Fzc29jaWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1Qix3REFBZ0M7QUFDaEMsZUFBSyxDQUFDLGFBQWEsQ0FBQyxlQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQU8sRUFBRSxFQUFFLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUM3RCxlQUFLLENBQUMsYUFBYSxDQUFDLGVBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBTyxFQUFFLEVBQUUsRUFBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBRS9ELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDVixNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNsQyxNQUFNLGlCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyJ9