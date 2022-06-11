"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyRouter = void 0;
const express_1 = __importDefault(require("express"));
const lobbyController = __importStar(require("../controllers/lobbyController"));
exports.lobbyRouter = express_1.default.Router();
exports.lobbyRouter.post('/createLobby', lobbyController.createLobby);
exports.lobbyRouter.post('/closeLobby', lobbyController.closeLobby);
exports.lobbyRouter.get('/inviteLink/:id', lobbyController.getInvite);
exports.lobbyRouter.post('/removeFromLobby', lobbyController.removeFromLobby);
exports.lobbyRouter.post('/removeLobbyData', lobbyController.removeLobbyData);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnlSb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXJzL2xvYmJ5Um91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLGdGQUFrRTtBQUVyRCxRQUFBLFdBQVcsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVDLG1CQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUQsbUJBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1RCxtQkFBVyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUQsbUJBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RFLG1CQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyJ9