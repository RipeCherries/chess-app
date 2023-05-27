import {Piece, PieceType, Position, TeamType} from "../Constants";

class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const occupiedTile = boardState.find(piece => piece.position.x === x && piece.position.y === y);

        return !!occupiedTile;
    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
        const occupiedTile = boardState.find(piece => piece.position.x === x && piece.position.y === y && piece.team !== team);

        return !!occupiedTile;
    }

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
        if (type === PieceType.PAWN) {
            const specialRow = team === TeamType.OUR ? 1 : 6;
            const pawnDirection = team === TeamType.OUR ? 1 : -1;

            if (prevPosition.x === position.x && prevPosition.y === specialRow && position.y - prevPosition.y === 2 * pawnDirection) {
                if (!this.tileIsOccupied(position.x, position.y, boardState) && !this.tileIsOccupied(position.x, position.y - pawnDirection, boardState)) {
                    return true;
                }
            } else if (prevPosition.x === position.x && position.y - prevPosition.y === pawnDirection) {
                if (!this.tileIsOccupied(position.x, position.y, boardState)) {
                    return true;
                }
            } else if (position.x - prevPosition.x === -1 && position.y - prevPosition.y === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(position.x, position.y, boardState, team)) {
                    return true;
                }
            } else if (position.x - prevPosition.x === 1 && position.y - prevPosition.y === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(position.x, position.y, boardState, team)) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default Referee;