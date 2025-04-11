import {Chess,Color,Square} from 'chess.js'

export type PieceColor = 'white' | 'black'
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type SquareId = string


export interface Piece{
    type:PieceType;
    color:PieceColor;
}

export interface GameState{
    game:Chess;
    fen:string;
    isConnected:boolean;
    playerId:string|null;
    playerColor:Color|null;
    opponentId:string|null;
    status:'idle' | 'waiting' | 'playing' | 'gameOver';
    winner:Color|'draw'|null;
    selectedSquare:Square | null;
    possibleMoves:Square[];
    gameId:string|null;

    setConnected:(isConnected:boolean)=>void;
    setPlayerId:(id:string)=>void;  

    setGame:(gameId:string,color:Color,initialFen?:string)=>void;
    setOpponent:(opponentId:string)=>void

    setFen:(fen:string)=>void;
    setSelectedSquare:(square:Square|null)=>void;

    makeMove:(from:Square,to:Square)=>boolean;
    updateGameFromFen:(fen:string)=>void;

    setGameOver:(winner:Color|'draw'|null)=>void;
    resetGame:()=>void
}