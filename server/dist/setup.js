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
exports.io = exports.httpServer = exports.app = exports.store = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const http = __importStar(require("http"));
const connectRedis = require('connect-redis');
const associations_1 = require("./db/associations");
const options_1 = require("./options");
const socket_io_1 = require("socket.io");
// Redis setup
const RedisStore = connectRedis(express_session_1.default);
const redisClient = (0, redis_1.createClient)({
    host: 'localhost',
    port: 6379
});
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
exports.store = new RedisStore({ client: redisClient });
// Express setup
exports.app = (0, express_1.default)();
exports.app.set('trust proxy', 1);
exports.app.use(express_1.default.urlencoded());
exports.app.use(express_1.default.json());
var corsOptions = {
    origin: options_1.CLIENT_ADDR,
    credentials: true,
    exposedHeaders: ['set-cookie']
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use((0, express_session_1.default)({
    store: exports.store,
    resave: true,
    secret: '123456',
    cookie: {
        maxAge: 1000 * 60 * 60,
    },
    saveUninitialized: true
}));
exports.httpServer = http.createServer(exports.app);
// Db setup
(0, associations_1.associate)();
// init(); // используется для создания бд при переносе на новый сервер
// Socket setup
exports.io = new socket_io_1.Server(exports.httpServer, {
    cors: {
        origin: options_1.CLIENT_ADDR
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUF3QjtBQUN4QixzREFBOEI7QUFDOUIsc0VBQXNDO0FBQ3RDLGlDQUFxQztBQUNyQywyQ0FBNkI7QUFDN0IsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlDLG9EQUE4QztBQUc5Qyx1Q0FBd0M7QUFDeEMseUNBQW1DO0FBRW5DLGNBQWM7QUFDZCxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMseUJBQU8sQ0FBQyxDQUFBO0FBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUEsb0JBQVksRUFBQztJQUM3QixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtDQUNiLENBQUMsQ0FBQTtBQUVGLFdBQVcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsR0FBUTtJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZFLENBQUMsQ0FBQyxDQUFDO0FBQ0gsV0FBVyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFRO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUMsQ0FBQztBQUNVLFFBQUEsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFHN0QsZ0JBQWdCO0FBQ0gsUUFBQSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDN0IsV0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDekIsV0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDOUIsV0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFeEIsSUFBSSxXQUFXLEdBQUc7SUFDaEIsTUFBTSxFQUFFLHFCQUFXO0lBQ25CLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQztDQUMvQixDQUFDO0FBQ0YsV0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTNCLFdBQUcsQ0FBQyxHQUFHLENBQ0wsSUFBQSx5QkFBTyxFQUFDO0lBQ04sS0FBSyxFQUFFLGFBQUs7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLE1BQU0sRUFBQztRQUNMLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUU7S0FDdkI7SUFDRCxpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUMsQ0FDSCxDQUFDO0FBYVcsUUFBQSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFHLENBQUMsQ0FBQztBQUVqRCxXQUFXO0FBQ1gsSUFBQSx3QkFBUyxHQUFFLENBQUM7QUFDWix1RUFBdUU7QUFFdkUsZUFBZTtBQUNGLFFBQUEsRUFBRSxHQUFHLElBQUksa0JBQU0sQ0FBQyxrQkFBVSxFQUFFO0lBQ3ZDLElBQUksRUFBRTtRQUNGLE1BQU0sRUFBRSxxQkFBVztLQUN0QjtDQUNGLENBQUMsQ0FBQyJ9