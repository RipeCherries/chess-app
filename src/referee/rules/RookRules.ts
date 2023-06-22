import {Piece, Position, samePosition, TeamType} from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";

export const rookMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    if (prevPosition.x === position.x) {
        for (let i = 1; i < 8; ++i) {
            let multiplier = position.y < prevPosition.y ? -1 : 1;

            let passedPosition: Position = {x: prevPosition.x, y: prevPosition.y + (i * multiplier)};
            if (samePosition(passedPosition, position)) {
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

            let passedPosition: Position = {x: prevPosition.x + (i * multiplier), y: prevPosition.y};
            if (samePosition(passedPosition, position)) {
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
        const destination: Position = {x: rook.position.x, y: rook.position.y + i};

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
        const destination: Position = {x: rook.position.x, y: rook.position.y - i};

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
        const destination: Position = {x: rook.position.x - i, y: rook.position.y};

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
        const destination: Position = {x: rook.position.x + i, y: rook.position.y};

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