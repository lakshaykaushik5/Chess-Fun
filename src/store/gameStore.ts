import {create} from 'zustand'
import {Chess,Square,PieceSymbol,Color} from 'chess.js'
import { GameState } from '@/models/chessBoard'

export const useGameStore = create<GameState>((set,get)=>({
    game:new Chess(),
    fen:'start',
    isConnected:false,
    playerId:null,
    playerColor:null,
    opponentId:null,
    gameId:null,
    status:"idle",
    winner:null,
    selectedSquare:null,
    possibleMoves:[],

    setConnected:(isConnected)=>set({isConnected}),
    setPlayerId:(id)=>set({playerId:id}),

    setGame:(gameId,color,initialFen='start')=>{
        const newGame = new Chess(initialFen === 'start'?undefined:initialFen)
        set({
            gameId,
            playerColor:color,
            game:newGame,
            fen:newGame.fen(),
            status:'waiting',
            winner:null,
            selectedSquare:null,
            possibleMoves:[]
        })
    },

    setOpponent:(opponentId)=>set({opponentId,status:'playing'}),

    setFen:(fen)=>set({fen}),
    setSelectedSquare:(square)=>{
        const {game,playerColor,status}=get()
        if(status!=='playing'){
            set({selectedSquare:null,possibleMoves:[]})
            return
        }
        if(!square){
            set({selectedSquare:null,possibleMoves:[]})
            return
        }
        const piece = game.get(square)
        if(piece && piece.color === playerColor && game.turn()===playerColor){
            const moves = game.moves({square:square,verbose:true}).map((move)=>move.to)
            set({selectedSquare:square,possibleMoves:moves})
        }else{
            const selected=get().selectedSquare
            if(selected){
                get().makeMove(selected,square)
            }
            set({selectedSquare:null,possibleMoves:[]})
        }
    },
    makeMove:(from,to)=>{
        const {game,gameId,playerColor,status} = get()
        if(status !=='playing' || game.turn() !== playerColor){
            set({selectedSquare:null,possibleMoves:[]})
            return false
        }
        try {
            const move = game.move({from,to,promotion:'q'})
            if(move){
                const newFen=game.fen()
                set({
                    fen:newFen,
                    selectedSquare:null,
                    possibleMoves:[]
                })
            }
            if(game.isGameOver()){
                let winnerResult:Color | 'draw' |null=null
                if(game.isCheckmate()){
                    winnerResult=game.turn() === 'w'?'b':'w'
                }else if(game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()){
                    winnerResult='draw'
                }
                return true
            }
            else{
                set({selectedSquare:null,possibleMoves:[]})
                return false
            }
        } catch (error) {
            console.warn("Invalid Move attempt :: ",error)
            set({selectedSquare:null,possibleMoves:[]})
            return false
        }
    },
    
    updateGameFromFen:(fen)=>{
        const {game} = get()
        const validFen = game.load(fen)
        if(validFen){
            const newGame = new Chess(fen)
            set({
                game:newGame,
                fen:newGame.fen(),
                selectedSquare:null,
                possibleMoves:[]
            })
            if(newGame.isGameOver()){
                let winnerResult : Color |'draw'|null=null
                if(newGame.isCheckmate()){
                    winnerResult=newGame.turn() === 'w'?'b':'w'
                }else if(newGame.isDraw() || newGame.isStalemate() || newGame.isInsufficientMaterial() || newGame.isThreefoldRepetition()){
                    winnerResult='draw'
                }
                get().setGameOver(winnerResult)
            }
            else{
                if(get().status === 'gameOver'){
                    set({status:'playing',winner:null})
                }
            }
        }else{
            console.error("Recieve Invalid Fen String :: ")
        }
    },

    setGameOver:(winner)=>set({status:'gameOver',winner,selectedSquare:null,possibleMoves:[]}),
    resetGame:()=>{
        const newGame = new Chess()
        set({
            game:newGame,
            fen:newGame.fen(),
            gameId:null,
            playerColor:null,
            opponentId:null,
            status:'idle',
            winner:null,
            selectedSquare:null,
            possibleMoves:[]
        })
    }
}))


export const useGameFen = ()=>useGameStore((state)=>state.fen)
export const useIsConnected = ()=>useGameStore((state)=>state.isConnected)
export const useGameStatus = ()=>useGameStore((state)=>state.status)
export const usePlayerColor = ()=>useGameStore((state)=>state.playerColor)