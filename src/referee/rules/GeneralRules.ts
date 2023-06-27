import {Position, Piece} from "../../models";
import {TeamType} from "../../Types";

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
    const occupiedTile = boardState.find(piece => piece.samePosition(position));

    return !!occupiedTile;
}

export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    const occupiedTile = boardState.find(piece => piece.samePosition(position) && piece.team !== team);

    return !!occupiedTile;
}

export const tileIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    return !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team);
}