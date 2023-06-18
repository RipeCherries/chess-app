import { Piece, Position, TeamType, samePosition } from "../../Constants";

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
    const occupiedTile = boardState.find(piece => samePosition(piece.position, position));

    return !!occupiedTile;
}

export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    const occupiedTile = boardState.find(piece => samePosition(piece.position, position) && piece.team !== team);

    return !!occupiedTile;
}

export const tileIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    return !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team);
}