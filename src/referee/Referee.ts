import {Piece, PieceType, TeamType} from "../components/chessBoard/ChessBoard";

class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const occupiedTile = boardState.find(piece => piece.x === x && piece.y === y);

        return !!occupiedTile;
    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
        const occupiedTile = boardState.find(piece => piece.x === x && piece.y === y && piece.team !== team);

        return !!occupiedTile;
    }

    isEnPassantMove(prevX: number, prevY: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]): boolean {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((x - prevX === -1 || x - prevX === 1) && y - prevY === pawnDirection) {
                const piece = boardState.find(piece => piece.x === x && piece.y === y - pawnDirection && piece.enPassant);
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(prevX: number, prevY: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]): boolean {
        if (type === PieceType.PAWN) {
            const specialRow = team === TeamType.OUR ? 1 : 6;
            const pawnDirection = team === TeamType.OUR ? 1 : -1;

            if (prevX === x && prevY === specialRow && y - prevY === 2 * pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)) {
                    return true;
                }
            } else if (prevX === x && y - prevY === pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState)) {
                    return true;
                }
            } else if (x - prevX === -1 && y - prevY === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
                    return true;
                }
            } else if (x - prevX === 1 && y - prevY === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default Referee;