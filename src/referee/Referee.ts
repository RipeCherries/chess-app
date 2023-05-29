import {Piece, PieceType, Position, samePosition, TeamType} from "../Constants";

class Referee {
    tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
        return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team);
    }
    tileIsOccupied(position: Position, boardState: Piece[]): boolean {
        const occupiedTile = boardState.find(piece => samePosition(piece.position, position));

        return !!occupiedTile;
    }

    tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
        const occupiedTile = boardState.find(piece => samePosition(piece.position, position) && piece.team !== team);

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
                if (!this.tileIsOccupied(position, boardState) && !this.tileIsOccupied({x: position.x, y: position.y - pawnDirection}, boardState)) {
                    return true;
                }
            } else if (prevPosition.x === position.x && position.y - prevPosition.y === pawnDirection) {
                if (!this.tileIsOccupied(position, boardState)) {
                    return true;
                }
            } else if (position.x - prevPosition.x === -1 && position.y - prevPosition.y === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(position, boardState, team)) {
                    return true;
                }
            } else if (position.x - prevPosition.x === 1 && position.y - prevPosition.y === pawnDirection) {
                if (this.tileIsOccupiedByOpponent(position, boardState, team)) {
                    return true;
                }
            }
        } else if (type === PieceType.KNIGHT) {
            for (let i = -1; i < 2; i += 2) {
                for (let j = -1; j < 2; j += 2) {
                    if (position.y - prevPosition.y === 2 * i) {
                        if (position.x - prevPosition.x === j) {
                            if (this.tileIsEmptyOrOccupiedByOpponent(position, boardState, team)) {
                                return true;
                            }
                        }
                    }

                    if (position.x - prevPosition.x === 2 * i) {
                        if (position.y - prevPosition.y === j) {
                            if (this.tileIsEmptyOrOccupiedByOpponent(position, boardState, team)) {
                                return true;
                            }
                        }
                    }
                }
            }
        } else if (type === PieceType.BISHOP) {
            for (let i = 1; i < 8; ++i) {
                if (position.x > prevPosition.x && position.y > prevPosition.y) {
                    let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y + i};

                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
                if (position.x - prevPosition.x === i && position.y - prevPosition.y === i) {
                    return true;
                }

                if (position.x > prevPosition.x && position.y < prevPosition.y) {
                    let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y - i};

                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
                if (position.x - prevPosition.x === i && position.y - prevPosition.y === -i) {
                    return true;
                }

                if (position.x < prevPosition.x && position.y > prevPosition.y) {
                    let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y + i};

                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
                if (position.x - prevPosition.x === -i && position.y - prevPosition.y === i) {
                    return true;
                }

                if (position.x < prevPosition.x && position.y < prevPosition.y) {
                    let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y - i};

                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
                if (position.x - prevPosition.x === -i && position.y - prevPosition.y === -i) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default Referee;