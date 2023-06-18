import { Piece, Position, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = team === TeamType.OUR ? 1 : 6;
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (prevPosition.x === position.x && prevPosition.y === specialRow && position.y - prevPosition.y === 2 * pawnDirection) {
        if (!tileIsOccupied(position, boardState) && !tileIsOccupied({x: position.x, y: position.y - pawnDirection}, boardState)) {
            return true;
        }
    } else if (prevPosition.x === position.x && position.y - prevPosition.y === pawnDirection) {
        if (!tileIsOccupied(position, boardState)) {
            return true;
        }
    } else if (position.x - prevPosition.x === -1 && position.y - prevPosition.y === pawnDirection) {
        if (tileIsOccupiedByOpponent(position, boardState, team)) {
            return true;
        }
    } else if (position.x - prevPosition.x === 1 && position.y - prevPosition.y === pawnDirection) {
        if (tileIsOccupiedByOpponent(position, boardState, team)) {
            return true;
        }
    }

    return false;
}