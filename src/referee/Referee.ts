import {Piece, PieceType, TeamType} from "../components/chessBoard/ChessBoard";

class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const occupiedTile = boardState.find(piece => piece.x === x && piece.y === y);

        return !!occupiedTile;
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
            }
        }

        return false;
    }
}

export default Referee;