import { Piece, Position, samePosition, TeamType } from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";

export const bishopMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = 1; i < 8; ++i) {
        if (position.x > prevPosition.x && position.y > prevPosition.y) {
            let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y + i};

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

        if (position.x > prevPosition.x && position.y < prevPosition.y) {
            let passedPosition: Position = {x: prevPosition.x + i, y: prevPosition.y - i};

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

        if (position.x < prevPosition.x && position.y > prevPosition.y) {
            let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y + i};

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

        if (position.x < prevPosition.x && position.y < prevPosition.y) {
            let passedPosition: Position = {x: prevPosition.x - i, y: prevPosition.y - i};

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

export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 8; ++i) {
        const destination: Position = {x: bishop.position.x + i, y: bishop.position.y + i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        const destination: Position = {x: bishop.position.x + i, y: bishop.position.y - i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        const destination: Position = {x: bishop.position.x - i, y: bishop.position.y - i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; ++i) {
        const destination: Position = {x: bishop.position.x - i, y: bishop.position.y + i};

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}