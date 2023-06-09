import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";
import {Position, Piece} from "../../models";
import {TeamType} from "../../Types";

export const rookMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    if (prevPosition.x === position.x) {
        for (let i = 1; i < 8; ++i) {
            let multiplier = position.y < prevPosition.y ? -1 : 1;

            let passedPosition = new Position(prevPosition.x, prevPosition.y + (i * multiplier));
            if (passedPosition.samePosition(position)) {
                if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }
    }

    if (prevPosition.y === position.y) {
        for (let i = 1; i < 8; ++i) {
            let multiplier = position.x < prevPosition.x ? -1 : 1;

            let passedPosition = new Position(prevPosition.x + (i * multiplier), prevPosition.y);
            if (passedPosition.samePosition(position)) {
                if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }
    }

    return false;
}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 8; ++i) {
        if (rook.position.y + i > 7) {
            break;
        }

        const destination = new Position(rook.position.x, rook.position.y + i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        if (rook.position.y - i < 0) {
            break;
        }

        const destination = new Position(rook.position.x, rook.position.y - i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        if (rook.position.x - i < 0) {
            break;
        }

        const destination = new Position(rook.position.x - i, rook.position.y);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        if (rook.position.x + i > 7) {
            break;
        }

        const destination = new Position(rook.position.x + i, rook.position.y);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}