import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(winningLines, squares) {
    for (let i = 0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
  
class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />;
    }

    renderRow(rowNumber, cols) {
        let row = [];
        for(let i = 0; i < cols; i++) {
            row.push(this.renderSquare(i + (rowNumber * cols)));
        }
        return (
            <div className="board-row" key={rowNumber}>
                {row}
            </div>
        );
    }
  
    render() {
        let grid = [];
        for(let i = 0; i < this.props.size.y; i++) {
            grid.push(this.renderRow(i, this.props.size.x));
        }

        return (
            <div>
                {grid}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: { x: 3, y: 3 },
            step: 0,
            xIsNext: true,
            winningLines: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ],
        };
        this.state = {...this.state, history: [{
            squares: Array(this.state.size.x * this.state.size.y).fill(null),
        }]};
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.step + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(this.state.winningLines, squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
            }]),
            step: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const size = this.state.size;
        const current = history[this.state.step];
        const winner = calculateWinner(this.state.winningLines, current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
        status = 'Winner: ' + winner;
        } else if(!winner && !current.squares.includes(null)) {
            status = 'Draw. No winner.';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board
                    size={size}
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  