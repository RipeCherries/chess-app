import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

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