import { Chess } from "chess.js";
import { WebSocket, WebSocketServer } from "ws";
import { GAMEOVER, INIT, MOVE } from "./messages";



export class Game{
    public player1:WebSocket
    public player2:WebSocket
    private board:Chess
    private moves:string[]
    private startTime:Date
    private moveCount:number

    constructor(player1:WebSocket,player2:WebSocket,id1:string,id2:string){
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.moves = []
        this.startTime = new Date()
        this.moveCount = 0
        this.player1.send(
            JSON.stringify({
                type:INIT,
                payload:{
                    color:'w',
                    id:id1
                }
            })
        )

        this.player2.send(
            JSON.stringify({
                type:INIT,
                payload:{
                    color:'b',
                    id:id2
                }
            })
        )

    }

    public makeMove(socket:WebSocket,move:{from:string,to:string},id:string, board:any){
        if(this.moveCount %2 ===0  && socket!== this.player1){
            return
        }
        if(this.moveCount %2 ===1 && socket!== this.player2){
            return
        }

        try{
            this.board.move(move)
            board = this.board.board()
            this.moveCount ++

        }catch(error){
            return
        }

        if(this.board.isGameOver()){
            this.player1.emit(
                JSON.stringify({
                    type:GAMEOVER,
                    payload:{
                        winner:this.board.isDraw()?"d":this.board.turn()==="w"?"b":"w"
                    }
                })
            )
        }

        if(this.board.isGameOver()){
            this.player2.emit(
                JSON.stringify({
                    type:GAMEOVER,
                    payload:{
                        winner:this.board.isDraw()?"d":this.board.turn()==="w"?"b":"w"
                    }
                })
            )
        }

        if(this.moveCount%2===0){
            this.player1.send(
                JSON.stringify({
                    type:MOVE,
                    payload:{
                        board:board
                    }
                })
            )
        }
        if(this.moveCount%2!==0){
            this.player2.send(
                JSON.stringify({
                    type:MOVE,
                    payload:{
                        board:board
                    }
                })
            )
        }
    }
}