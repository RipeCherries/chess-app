import { Piece, PieceType, Position, TeamType } from "../Constants";
import { pawnMove, kingMove, queenMove, rookMove, bishopMove, knightMove } from "./rules";

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
}

export default Referee;