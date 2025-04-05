import { WebSocket, WebSocketServer } from "ws";
import { INIT, MOVE } from "./messages";
import { Game } from "./Game";
export class GameManager{

    private games : Set<Game> /*Game[]*/
    private pendingUser :WebSocket | null 
    private gameUsers:WebSocket[]
    private pendingUserId:string


    constructor(){
        this.games = new Set<Game>()
        this.pendingUser=null
        this.gameUsers = []
        this.pendingUserId=""
    }
    
    handleUser(socket:WebSocket){
        this.gameUsers.push(socket)
        this.handler(socket)
    }

    removeUser(socket:WebSocket){
        this.gameUsers = this.gameUsers.filter((user)=>user!==socket)
    }

    private handler(socket:WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());
            if(message.type === INIT){
                if(this.pendingUser){
                    const game = new Game(this.pendingUser,socket,this.pendingUserId,message.payload.id)
                    this.games.add(game)
                    this.pendingUser=null
                }
                else{
                    this.pendingUser=socket
                    this.pendingUserId=message.payload.id
                }
            }
            else if(message.type === MOVE){
                const gameFinder = (socket:WebSocket)=>{
                    for(const game of this.games){
                        if(game.player1 === socket || game.player2 === socket){
                            return game
                        }
                    }
                    return null
                }

                const game = gameFinder(socket)

                if(game){
                    game.makeMove(socket,message.payload.move,message.payload.board,message.payload.id)
                }
            }
        })
    }
}