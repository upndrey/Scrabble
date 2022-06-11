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
exports.gameRouter = void 0;
const express_1 = __importDefault(require("express"));
const gameController = __importStar(require("../controllers/gameController"));
exports.gameRouter = express_1.default.Router();
exports.gameRouter.post('/startGame', gameController.startGame);
exports.gameRouter.post('/nextTurn', gameController.nextTurn);
exports.gameRouter.post('/noMoreWays', gameController.noMoreWays);
exports.gameRouter.post('/exitGame', gameController.exitGame);
exports.gameRouter.post('/removeSymbolInField', gameController.removeSymbolInField);
exports.gameRouter.post('/insertSymbolInField', gameController.insertSymbolInField);
exports.gameRouter.post('/removeSymbolInHand', gameController.removeSymbolInHand);
exports.gameRouter.post('/insertSymbolInHand', gameController.insertSymbolInHand);
exports.gameRouter.post('/insertSymbolInSet', gameController.insertSymbolInSet);
exports.gameRouter.post('/getBoard', gameController.getBoard);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZVJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3JvdXRlcnMvZ2FtZVJvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5Qiw4RUFBZ0U7QUFFbkQsUUFBQSxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUUzQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3hELGtCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQsa0JBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxRCxrQkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXRELGtCQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVFLGtCQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVFLGtCQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFFLGtCQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFFLGtCQUFVLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXhFLGtCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMifQ==