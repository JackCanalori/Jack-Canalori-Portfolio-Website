/*--------------------------------------------------------------------------------------------------------------------
* Code in this block all relates to the functionality of the connect 4 part of my portfolio
--------------------------------------------------------------------------------------------------------------------*/
let game_board = [[' ',' ',' ',' ',' ',' ',' '],
                   [' ',' ',' ',' ',' ',' ',' '],
                   [' ',' ',' ',' ',' ',' ',' '],
                   [' ',' ',' ',' ',' ',' ',' '],
                   [' ',' ',' ',' ',' ',' ',' '],
                   [' ',' ',' ',' ',' ',' ',' ']];
let num_turns = 0;
let isAiThinking = false;


function start_c4_game()
{
    reset_board();
    const info_text = document.getElementById("c4-info-text");
    info_text.innerText = "";
    document.getElementById("toggleable-break-1").style.display = "inline";
    const buttons = document.getElementById("c4-buttons");
    buttons.style.display = "flex";
    const play_button = document.getElementById("play-button");
    play_button.style.display = "none";
    const play_button_div = document.getElementById("play-button");
    play_button_div.style.display = "none";
    update_board_colors();
}

async function play_col(index, player)
{
    if (isAiThinking && player) return;

    const info_text = document.getElementById("c4-info-text");
    const buttons = document.querySelectorAll("#c4-buttons button");

    if(game_board[0][index] !== ' ') {
        info_text.innerText = "Invalid Column! Try Again";
        return;
    }

    for(let i = 5; i >= 0; i--) {
        if(game_board[i][index] === ' ') {
            game_board[i][index] = player ? 'X' : 'O';
            break;
        }
    }

    update_board_colors();
    num_turns++;


    if(checkWin(game_board,'X'))
    {
        info_text.innerText = "You win!";
        return  switch_buttons();
    }
    if(checkWin(game_board,'O'))
    {
        info_text.innerText = "You lose!";
        return switch_buttons();
    }
    if(num_turns === 42)
    {
        info_text.innerText = "Tie Game";
        return switch_buttons();
    }

    if (player) {

        isAiThinking = true;
        buttons.forEach(btn => btn.disabled = true);
        info_text.innerText = "AI is thinking...";

        setTimeout(async () => {
            try {
                let ai_move = await get_ai_move();
                await play_col(ai_move, false);
                info_text.innerText = "Your turn!";
            } catch (err) {
                console.error(err);
                info_text.innerText = "AI Error!";
            } finally {
                isAiThinking = false;
                buttons.forEach(btn => btn.disabled = false);
            }
        }, 100);
        info_text.innerText = "";
    }

    info_text.innerText = "";

}

function get_ai_move()
{
    const result = minimax(game_board, 12, -Infinity, Infinity, true);
    return result.column;
}

function getNextOpenRow(board, col)
{
    for (let r = 5; r >= 0; r--)
    {
        if (board[r][col] === ' ')
        {
            return r;
        }
    }
    return null;
}



function minimax(currentBoard, depth, alpha, beta, maximizingPlayer) {
    let frontier = [0, 1, 2, 3, 4, 5, 6].filter(c => currentBoard[0][c] === ' ');

    // Check terminal states
    let aiWon = checkWin(currentBoard, 'O');
    let humanWon = checkWin(currentBoard, 'X');
    if (depth === 0 || aiWon || humanWon || frontier.length === 0) {
        if (aiWon) return {column: null, score: 10000000};
        if (humanWon) return {column: null, score: -10000000};
        return {column: null, score: 0};
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let column = frontier[0];

        for (const col of frontier) {
            const row = getNextOpenRow(currentBoard, col);
            let tempBoard = currentBoard.map(row => [...row]);
            tempBoard[row][col] = 'O'; // AI piece

            const newScore = minimax(tempBoard, depth - 1, alpha, beta, false).score;

            if (newScore > value) {
                value = newScore;
                column = col;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break;
        }
        return {column, score: value};

    } else {
        let value = Infinity;
        let column = frontier[0];

        for (const col of frontier) {
            const row = getNextOpenRow(currentBoard, col);
            let tempBoard = currentBoard.map(row => [...row]);
            tempBoard[row][col] = 'X'; // Human piece

            const newScore = minimax(tempBoard, depth - 1, alpha, beta, true).score;

            if (newScore < value) {
                value = newScore;
                column = col;
            }
            beta = Math.min(beta, value);
            if (alpha >= beta) break;
        }
        return {column, score: value};
    }
}


function switch_buttons() {
    document.getElementById("toggleable-break-1").style.display = "none";
    const buttons = document.getElementById("c4-buttons");
    buttons.style.display = "none";
    const play_button = document.getElementById("play-button");
    play_button.style.display = "flex";
    play_button.innerText = "New Game";
    const play_button_div = document.getElementById("play-button");
    play_button_div.style.display = "flex";
}

    function update_board_colors() {
        for (let i = 0; i < game_board.length; i++) {
            for (let j = 0; j < game_board[i].length; j++) {
                let s = i + "-" + j;
                if (game_board[i][j] === 'X') {
                    const cell = document.getElementById(s);
                    cell.style.backgroundColor = '#FF0000';
                } else if (game_board[i][j] === 'O') {
                    const cell = document.getElementById(s);
                    cell.style.backgroundColor = '#FFFF00';
                } else {
                    const cell = document.getElementById(s);
                    cell.style.backgroundColor = '#000';
                }
            }
        }
    }

    function checkWin(board, piece) {
        const rows = 6;
        const cols = 7;

        // 1. Check horizontal
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c <= cols - 4; c++) {
                if (board[r][c] === piece &&
                    board[r][c + 1] === piece &&
                    board[r][c + 2] === piece &&
                    board[r][c + 3] === piece) {
                    return true;
                }
            }
        }

        // 2. Check vertical
        for (let r = 0; r <= rows - 4; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c] === piece &&
                    board[r + 1][c] === piece &&
                    board[r + 2][c] === piece &&
                    board[r + 3][c] === piece) {
                    return true;
                }
            }
        }

        // 3. Check diagonal (down-right)
        for (let r = 0; r <= rows - 4; r++) {
            for (let c = 0; c <= cols - 4; c++) {
                if (board[r][c] === piece &&
                    board[r + 1][c + 1] === piece &&
                    board[r + 2][c + 2] === piece &&
                    board[r + 3][c + 3] === piece) {
                    return true;
                }
            }
        }

        // 4. Check diagonal (up-right)
        for (let r = 3; r < rows; r++) {
            for (let c = 0; c <= cols - 4; c++) {
                if (board[r][c] === piece &&
                    board[r - 1][c + 1] === piece &&
                    board[r - 2][c + 2] === piece &&
                    board[r - 3][c + 3] === piece) {
                    return true;
                }
            }
        }

        return false;
    }


function reset_board()
{
    game_board = [[' ',' ',' ',' ',' ',' ',' '],
             [' ',' ',' ',' ',' ',' ',' '],
             [' ',' ',' ',' ',' ',' ',' '],
             [' ',' ',' ',' ',' ',' ',' '],
             [' ',' ',' ',' ',' ',' ',' '],
             [' ',' ',' ',' ',' ',' ',' ']];
    num_turns = 0;
}


/*--------------------------------------------------------------------------------------------------------------------
* End block
--------------------------------------------------------------------------------------------------------------------*/