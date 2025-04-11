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
    status:'idle',
    winner:null,
    selectedSquare:null,
    possibleMoves:[],

    setConnected:(isConnected)=>set({isConnected}),
    setPlayerId:(id)=>set({playerId:id}),

    setGame:(gameId,color,initialFen='start')=>{
        
    }
}))