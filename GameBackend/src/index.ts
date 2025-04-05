import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";



const gameManager = new GameManager()
const wss = new WebSocketServer({port:8080})

wss.on("connection",(ws)=>{
    gameManager.handleUser(ws)
    ws.on("disconnect",()=>{gameManager.removeUser(ws)})
})