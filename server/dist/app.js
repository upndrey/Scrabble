"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
require("./models/db");
const app = (0, express_1.default)();
// here we are adding middleware to parse all incoming requests as JSON 
app.use(express_1.default.json());
// here we are adding middleware to allow cross-origin requests
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});
io.on("connection", (socket) => {
    // ...
    console.log('runningMessage');
});
httpServer.listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFvQztBQUNwQyx5Q0FBbUM7QUFFbkMsZ0RBQXdCO0FBQ3hCLHVCQUFxQjtBQUVyQixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUV0Qix3RUFBd0U7QUFDeEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFeEIsK0RBQStEO0FBQy9ELEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEdBQUUsQ0FBQyxDQUFDO0FBSWhCLE1BQU0sVUFBVSxHQUFHLElBQUEsbUJBQVksRUFBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFNLENBQUMsVUFBVSxFQUFFO0lBQzlCLElBQUksRUFBRTtRQUNGLE1BQU0sRUFBRSx1QkFBdUI7S0FDbEM7Q0FDSCxDQUFDLENBQUM7QUFFSixFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBQzdCLE1BQU07SUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=