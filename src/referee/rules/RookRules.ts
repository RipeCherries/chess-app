import {Piece, Position, samePosition, TeamType} from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied} from "./GeneralRules";

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