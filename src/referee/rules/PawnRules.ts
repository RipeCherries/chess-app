import {tileIsOccupied, tileIsOccupiedByOpponent} from "./GeneralRules";
import {Position, Piece} from "../../models";
import {TeamType} from "../../Types";
import {Pawn} from "../../models/Pawn";

export const pawnMove = (prevPosition: Position, position: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = team === TeamType.OUR ? 1 : 6;
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (prevPosition.x === position.x && prevPosition.y === specialRow && position.y - prevPosition.y === 2 * pawnDirection) {
        if (!tileIsOccupied(position, boardState) && !tileIsOccupied(new Position(position.x, position.y - pawnDirection), boardState)) {
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

    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
    const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
    const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

    if (!tileIsOccupied(normalMove, boardState)) {
        possibleMoves.push(normalMove);

        if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push(specialMove);
        }
    }

    if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
        possibleMoves.push(upperLeftAttack);
    } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
        const leftPiece = boardState.find(piece => piece.samePosition(leftPosition));
        if (leftPiece != null && (leftPiece as Pawn).enPassant) {
            possibleMoves.push(upperLeftAttack);
        }
    }

    if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
        possibleMoves.push(upperRightAttack);
    } else if (!tileIsOccupied(upperRightAttack, boardState)) {
        const rightPiece = boardState.find(piece => piece.samePosition(rightPosition));
        if (rightPiece != null && (rightPiece as Pawn).enPassant) {
            possibleMoves.push(upperRightAttack);
        }
    }

    return possibleMoves;
}