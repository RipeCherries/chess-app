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

    pawnMove(prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean {
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

        return false;
    }

    knightMove(prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean {
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

        return false;
    }

    bishopMove(prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean {
        for (let i = 1; i < 8; ++i) {
            if (position.x > prevPosition.x && position.y > prevPosition.y) {
                let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y + i};

                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            if (position.x > prevPosition.x && position.y < prevPosition.y) {
                let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y - i};

                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            if (position.x < prevPosition.x && position.y > prevPosition.y) {
                let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y + i};

                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            if (position.x < prevPosition.x && position.y < prevPosition.y) {
                let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y - i};

                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }

        return false;
    }

    rookMove(prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean {
        if (prevPosition.x === position.x) {
            for (let i = 1; i < 8; ++i) {
                let multiplier = position.y < prevPosition.y ? -1 : 1;

                let passedPosition: Position = {x: prevPosition.x, y: prevPosition.y + (i * multiplier)};
                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }

        if (prevPosition.y === position.y) {
            for (let i = 1; i < 8; ++i) {
                let multiplier = position.x < prevPosition.x ? -1 : 1;

                let passedPosition: Position = {x: prevPosition.x + (i * multiplier), y: prevPosition.y};
                if (samePosition(passedPosition, position)) {
                    if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }

        return false;
    }

    queenMove(prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean {
        for (let i = 1; i < 8; ++i) {
            let multiplierX;
            let multiplierY;

            if (position.x < prevPosition.x) {
                multiplierX = -1;
            } else if (position.x > prevPosition.x) {
                multiplierX = 1;
            } else {
                multiplierX = 0;
            }

            if (position.y < prevPosition.y) {
                multiplierY = -1;
            } else if (position.y > prevPosition.y) {
                multiplierY = 1;
            } else {
                multiplierY = 0;
            }

            let passedPosition: Position = {x: prevPosition.x + (i * multiplierX), y: prevPosition.y + (i * multiplierY)};
            if (samePosition(passedPosition, position)) {
                if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (this.tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }

        return false;
    }

    isValidMove(prevPosition: Position, position: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean {
        let validMove = false;

        switch (type) {
            case PieceType.PAWN:
                validMove = this.pawnMove(prevPosition, position, team, boardState);
                break;
            case PieceType.BISHOP:
                validMove = this.bishopMove(prevPosition, position, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = this.knightMove(prevPosition, position, team, boardState);
                break;
            case PieceType.ROOK:
                validMove = this.rookMove(prevPosition, position, team, boardState);
                break;
            case PieceType.QUEEN:
                validMove = this.queenMove(prevPosition, position, team, boardState);
                break;
        }

        return validMove;
    }
}

export default Referee;