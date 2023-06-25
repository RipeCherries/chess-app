import {samePosition, TeamType} from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";
import {Position, Piece} from "../../models";

export const kingMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = 1; i < 2; ++i) {
        let multiplierX = (position.x < prevPosition.x) ? -1 : (position.x > prevPosition.x) ? 1 : 0;
        let multiplierY = (position.y < prevPosition.y) ? -1 : (position.y > prevPosition.y) ? 1 : 0;

        let passedPosition = new Position(prevPosition.x + (i * multiplierX), prevPosition.y + (i * multiplierY));
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

    return false;
}

export const getPossibleKingMove = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x, king.position.y + i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x, king.position.y - i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x - i, king.position.y);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x + i, king.position.y);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x + i, king.position.y + i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x + i, king.position.y - i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x - i, king.position.y - i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 2; ++i) {
        const destination = new Position(king.position.x - i, king.position.y + i);

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}