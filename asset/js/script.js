const WHO = { COMPUTER: 1, HUMAN: 2 }
const SYMBOL = { COMPUTERSYMBOL: 'O', HUMANSYMBOL: 'X' }


class TicTacToe {
    static #SIDE = 3
    #board
    #humanTurn = true
    #moveIndex = 0
    constructor() {
        this.#board = new Array()
        this.#board.push(['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-'])

        /////
        document.querySelector('.btn--ok').addEventListener('click', () => {
            this.#toggleWinnerModal()
            this.#reset()
        })
        document.querySelector('.btn--play').addEventListener('click', () => {
            this.#togglePlayerChoiceModal()
            this.#play()
        })
        document.querySelector('.btn--yes').addEventListener('click', () => {
            this.#humanTurn = true
            this.#togglePlayerChoiceModal()
        })
        document.querySelector('.btn--no').addEventListener('click', () => {
            this.#humanTurn = false
            this.#playComputer()
            this.#togglePlayerChoiceModal()
        })
    }
    #play() {
        //addListeners
        const boardContainer = document.querySelector('.board')
        boardContainer.addEventListener('click', (evnt) => {
            if (this.#humanTurn) {
                const cell = evnt.target
                if (cell.classList.contains('cell')) {
                    if (cell.innerHTML == '-') {
                        if (this.#checkWinner())
                            return
                        cell.innerHTML = SYMBOL.HUMANSYMBOL
                        const cellNo = cell.dataset.id
                        const row = Math.floor((cellNo - 1) / TicTacToe.#SIDE)
                        const col = Math.floor((cellNo - 1) % TicTacToe.#SIDE)
                        this.#board[row][col] = SYMBOL.HUMANSYMBOL
                        console.log(this.#board);
                        this.#moveIndex++;
                        this.#humanTurn = !this.#humanTurn
                        if (this.#checkWinner())
                            return
                        this.#playComputer()
                    }
                }
            }
        })
    }

    #togglePlayerChoiceModal() {
        document.querySelector('.backdrop').classList.toggle('hidden')
        document.querySelector('.modal').classList.toggle('hidden')
    }
    #toggleWinnerModal() {
        document.querySelector('.backdrop').classList.toggle('hidden')
        document.querySelector('.winnermodal').classList.toggle('hidden')
    }
    #checkWinner() {
        if (this.#gameOver() == false && this.#moveIndex == TicTacToe.#SIDE * TicTacToe.#SIDE) {
            const innerht = `
            <img class="resImage" src="./asset/images/prohibited.png" alt="prohibited">
            <p>It's a draw</p>
            `
            document.querySelector('.result').innerHTML = innerht
            this.#toggleWinnerModal()
            return true
        }
        else if (this.#gameOver()) {
            if (!this.#humanTurn) {
                const innerht = `
                <img class="resImage" src="./asset/images/win.png" alt="prohibited">
                <p>You Win!</p>
            `
                document.querySelector('.result').innerHTML = innerht
                this.#toggleWinnerModal()
            }
            else {
                const innerht = `
                    <img class="resImage" src="./asset/images/fail.png" alt="lost">
                    <p>You Lost!</p>
                `
                document.querySelector('.result').innerHTML = innerht
                this.#toggleWinnerModal()
            }
            return true
        }
        return false
    }
    #playComputer() {
        ///////////////////////
        if (this.#checkWinner()) {
            console.log('ok');
            return
        }
        if (this.#humanTurn)
            return
        let x = 0
        let y = 0

        let n = this.#bestMove(this.#moveIndex);
        console.log(n);
        x = Math.floor(n / TicTacToe.#SIDE);
        y = Math.floor(n % TicTacToe.#SIDE);
        console.log(x, y);
        this.#board[x][y] = SYMBOL.COMPUTERSYMBOL;
        const cell = document.querySelector(`[data-id="${n + 1}"]`)
        console.log(cell);
        cell.innerHTML = SYMBOL.COMPUTERSYMBOL
        this.#moveIndex++;

        this.#humanTurn = !this.#humanTurn
        if (this.#checkWinner()) {
            console.log('ok');
            return
        }
        // console.log(this.#board);
    }
    #bestMove() {
        let x = -1
        let y = -1;
        let score = 0
        let bestScore = -999;
        for (let i = 0; i < TicTacToe.#SIDE; i++) {
            for (let j = 0; j < TicTacToe.#SIDE; j++) {
                if (this.#board[i][j] == '-') {
                    this.#board[i][j] = SYMBOL.COMPUTERSYMBOL;
                    score = this.#minimax(this.#moveIndex + 1, false);
                    this.#board[i][j] = '-';
                    if (score > bestScore) {
                        bestScore = score;
                        x = i;
                        y = j;
                    }
                }
            }
        }
        return x * 3 + y;
    }
    #minimax(depth, isAI) {
        let score = 0;
        let bestScore = 0;
        if (this.#gameOver() == true) {
            if (isAI == true)
                return -10;
            if (isAI == false)
                return +10;
        }
        else {
            if (depth < 9) {
                if (isAI == true) {
                    bestScore = -999;
                    for (let i = 0; i < TicTacToe.#SIDE; i++) {
                        for (let j = 0; j < TicTacToe.#SIDE; j++) {
                            if (this.#board[i][j] == '-') {
                                this.#board[i][j] = SYMBOL.COMPUTERSYMBOL;
                                score = this.#minimax(depth + 1, false);
                                this.#board[i][j] = '-';
                                if (score > bestScore) {
                                    bestScore = score;
                                }
                            }
                        }
                    }
                    return bestScore;
                }
                else {
                    bestScore = 999;
                    for (let i = 0; i < TicTacToe.#SIDE; i++) {
                        for (let j = 0; j < TicTacToe.#SIDE; j++) {
                            if (this.#board[i][j] == '-') {
                                this.#board[i][j] = SYMBOL.HUMANSYMBOL;
                                score = this.#minimax(depth + 1, true);
                                this.#board[i][j] = '-';
                                if (score < bestScore) {
                                    bestScore = score;
                                }
                            }
                        }
                    }
                    return bestScore;
                }
            }
            else {
                return 0;
            }
        }
    }
    #rowCrossed() {
        for (let i = 0; i < TicTacToe.#SIDE; i++) {
            if (this.#board[i][0] == this.#board[i][1] &&
                this.#board[i][1] == this.#board[i][2] &&
                this.#board[i][0] != '-')
                return true;
        }
        return false;
    }
    #columnCrossed() {
        for (let i = 0; i < TicTacToe.#SIDE; i++) {
            if (this.#board[0][i] == this.#board[1][i] &&
                this.#board[1][i] == this.#board[2][i] &&
                this.#board[0][i] != '-')
                return true;
        }
        return false;
    }
    #diagonalCrossed() {
        if (this.#board[0][0] == this.#board[1][1] &&
            this.#board[1][1] == this.#board[2][2] &&
            this.#board[0][0] != '-')
            return true;
        if (this.#board[0][2] == this.#board[1][1] &&
            this.#board[1][1] == this.#board[2][0] &&
            this.#board[0][2] != '-')
            return true;
        return false;
    }
    #gameOver() {
        return (this.#rowCrossed() || this.#columnCrossed() || this.#diagonalCrossed());
    }
    #reset() {
        document.querySelectorAll('.cell').forEach((cell) => {
            cell.innerHTML = '-'
        })
        this.#board = new Array()
        this.#board.push(['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-'])
        this.#moveIndex = 0
    }

}

const ticTacToe = new TicTacToe()