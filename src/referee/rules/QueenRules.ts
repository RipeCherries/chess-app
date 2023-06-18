import {Piece, Position, samePosition, TeamType} from "../../Constants";
import {tileIsEmptyOrOccupiedByOpponent, tileIsOccupied} from "./GeneralRules";

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