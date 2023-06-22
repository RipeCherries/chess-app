import { Piece, PieceType, Position, TeamType } from "../Constants";
import {
    pawnMove,
    kingMove,
    queenMove,
    rookMove,
    bishopMove,
    knightMove,
    getPossiblePawnMoves,
    getPossibleKnightMoves, getPossibleBishopMoves, getPossibleRookMoves, getPossibleQueenMoves
} from "./rules";

class Referee {
    isEnPassantMove(prevPosition: Position, position: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((position.x - prevPosition.x === -1 || position.x - prevPosition.x === 1) && position.y - prevPosition.y === pawnDirection) {
                const piece = boardState.find(piece => piece.position.x === position.x && piece.position.y === position.y - pawnDirection && piece.enPassant);
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(prevPosition: Position, position: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean {
        let validMove = false;

        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(prevPosition, position, team, boardState);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(prevPosition, position, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(prevPosition, position, team, boardState);
                break;
            case PieceType.ROOK:
                validMove = rookMove(prevPosition, position, team, boardState);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(prevPosition, position, team, boardState);
                break;
            case PieceType.KING:
                validMove = kingMove(prevPosition, position, team, boardState);
                break;
        }

        return validMove;
    }

    getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            default:
                return [];
        }
    }
}

export default Referee;