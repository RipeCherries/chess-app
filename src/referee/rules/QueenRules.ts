import {Piece, Position, samePosition, TeamType} from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";

export const queenMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = 1; i < 8; ++i) {
        let multiplierX = (position.x < prevPosition.x) ? -1 : (position.x > prevPosition.x) ? 1 : 0;
        let multiplierY = (position.y < prevPosition.y) ? -1 : (position.y > prevPosition.y) ? 1 : 0;

        let passedPosition: Position = {x: prevPosition.x + (i * multiplierX), y: prevPosition.y + (i * multiplierY)};
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

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x, y: queen.position.y + i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x, y: queen.position.y - i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x - i, y: queen.position.y};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y + i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y - i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x - i, y: queen.position.y - i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x - i, y: queen.position.y + i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}