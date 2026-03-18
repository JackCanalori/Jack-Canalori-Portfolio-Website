import copy
import sys
import json

ai = 'O'
human = 'X'

def is_winner(board, piece):
    # Check horizontal, vertical, and diagonals for a specific piece
    rows, cols = 6, 7
    for r in range(rows):
        for c in range(cols - 3):
            if all(board[r][c+i] == piece for i in range(4)): return True
    for r in range(rows - 3):
        for c in range(cols):
            if all(board[r+i][c] == piece for i in range(4)): return True
    for r in range(rows - 3):
        for c in range(cols - 3):
            if all(board[r+i][c+i] == piece for i in range(4)): return True
    for r in range(3, rows):
        for c in range(cols - 3):
            if all(board[r-i][c+i] == piece for i in range(4)): return True
    return False

def get_valid_locations(board):
    return [c for c in range(7) if board[0][c] == ' ']

def get_next_open_row(board, col):
    for r in range(5, -1, -1):
        if board[r][col] == ' ':
            return r

def minimax(board, depth, alpha, beta, maximizingPlayer):
    valid_locations = get_valid_locations(board)
    is_terminal = is_winner(board, ai) or is_winner(board, human) or len(valid_locations) == 0

    if depth == 0 or is_terminal:
        if is_terminal:
            if is_winner(board, ai): return (None, 10000000)
            elif is_winner(board, human): return (None, -10000000)
            else: return (None, 0) # Draw
        else: return (None, 0)

    if maximizingPlayer:
        value = -float('inf')
        column = valid_locations[0]
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = copy.deepcopy(board)
            temp_board[row][col] = ai
            new_score = minimax(temp_board, depth - 1, alpha, beta, False)[1]
            if new_score > value:
                value = new_score
                column = col
            alpha = max(alpha, value)
            if alpha >= beta: break
        return column, value

    else: # Minimizing player
        value = float('inf')
        column = valid_locations[0]
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = copy.deepcopy(board)
            temp_board[row][col] = human
            new_score = minimax(temp_board, depth - 1, alpha, beta, True)[1]
            if new_score < value:
                value = new_score
                column = col
            beta = min(beta, value)
            if alpha >= beta: break
        return column, value

def play(state, move_count):
    col, score = minimax(state, 10, -float('inf'), float('inf'), True)
    return col


def main(args):
    board = json.loads(args[0])
    turns = int(args[1])
    col = play(board, turns)
    print(col)
    return 0

if __name__ == "__main__":
    main(sys.argv[1:])