import { Piece, Position, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            if (position.y - prevPosition.y === 2 * i) {
                if (position.x - prevPosition.x === j) {
                    if (tileIsEmptyOrOccupiedByOpponent(position, boardState, team)) {
                        return true;
                    }
                }
            }

            if (position.x - prevPosition.x === 2 * i) {
                if (position.y - prevPosition.y === j) {
                    if (tileIsEmptyOrOccupiedByOpponent(position, boardState, team)) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}
