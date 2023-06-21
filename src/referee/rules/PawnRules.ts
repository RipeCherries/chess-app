import {Piece, Position, samePosition, TeamType} from "../../Constants";
import {tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";

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

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
    const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

    const normalMove: Position = {x: pawn.position.x, y: pawn.position.y + pawnDirection};
    const specialMove: Position = {x: normalMove.x, y: normalMove.y + pawnDirection};
    const upperLeftAttack: Position = {x: pawn.position.x - 1, y: pawn.position.y + pawnDirection};
    const upperRightAttack: Position = {x: pawn.position.x + 1, y: pawn.position.y + pawnDirection};
    const leftPosition: Position = {x: pawn.position.x - 1, y: pawn.position.y};
    const rightPosition: Position = {x: pawn.position.x + 1, y: pawn.position.y};

    if (!tileIsOccupied(normalMove, boardState)) {
        possibleMoves.push(normalMove);

        if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push(specialMove);
        }
    }

    if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
        possibleMoves.push(upperLeftAttack);
    } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
        const leftPiece = boardState.find(piece => samePosition(piece.position, leftPosition));
        if (leftPiece != null && leftPiece.enPassant) {
            possibleMoves.push(upperLeftAttack);
        }
    }

    if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
        possibleMoves.push(upperRightAttack);
    } else if (!tileIsOccupied(upperRightAttack, boardState)) {
        const rightPiece = boardState.find(piece => samePosition(piece.position, rightPosition));
        if (rightPiece != null && rightPiece.enPassant) {
            possibleMoves.push(upperRightAttack);
        }
    }

    return possibleMoves;
}