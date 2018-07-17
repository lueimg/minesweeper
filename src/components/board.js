import React, { Component } from 'react';
import Cell from './Cell';

export default class Board extends Component {

    static defaultProps = {
        rows: 10,
        columns: 5,
        mines: 10
    }

    state = {
        matrix: [],
        flatMatrix: [],
        bombs: [],
        game: 'started'
    };

    componentDidMount () {
        const flatMatrix = [];
        let matrix = this.getRange(this.props.rows)
            .map(row => (this.getRange(this.props.columns)
                .map( col => ( 
                    flatMatrix.push(`${row}${col}`) && ({ key: `${row}${col}`, row, col })))));

        const bombs = this.randoms(flatMatrix.length, this.props.mines).map(idx => flatMatrix[idx]);

        matrix = matrix.map( cells =>  cells.map(cell => {
            const isBomb = bombs.indexOf(cell.key) > -1;
            const adjacents = this.getAdjascents(cell.row, cell.col, flatMatrix);
            const hint = adjacents.reduce((acc , item) => (bombs.indexOf(item) > -1 && acc + 1 || acc), 0)
            return { 
                ...cell,
                isBomb,
                hint
            }
        }))

        
        this.setState({matrix, flatMatrix, bombs});
    }

    getAdjascents ( row, col, flatMatrix = []) {
        return [
            `${row - 1}${col - 1 }`,
            `${row - 1}${col  }`,
            `${row - 1}${col + 1 }`,
            `${row }${col - 1 }`,
            `${row }${col + 1 }`,
            `${row + 1}${col - 1 }`,
            `${row + 1}${col }`,
            `${row + 1}${col + 1 }`,
        ].filter( key => flatMatrix.indexOf(key) > -1);
    }

    getRange (amount) {
        return Array.apply(null, Array(amount)).map((x, i) => i + 1);
    }

    randoms(max, size, acc = [] ) {
        const limit = max < 11 && 10 || max < 101 && 100 || max < 1001 && 1000;
        const getValue = () => {
            const random = Math.ceil(Math.random() * limit);
            return random < max && random || getValue();
        }

        if (acc.length < size) {
            acc = [ ...acc , getValue()];
            return this.randoms(max, size, acc)
        } else {
            return acc;
        }
    }

    clickCell = ({ row, col , isBomb}) => {
        if (isBomb) {
            this.setState({ game: 'failed' })
            return;
        }

        const adjacents = this.getAdjascents(row, col, this.state.flatMatrix).concat(`${row}${col}`);
        const matrix = this.review(adjacents, this.state.matrix);
        this.setState({ matrix })
    }

    review = (arr, matrix) => {
        const empties = [];
        const newMatrix = matrix.map( cells => cells.map( cell => {
            if (arr.indexOf(cell.key) > -1 && !cell.isBomb && !cell.showHint && cell.hint === 0 ) {
                empties.push({ row: cell.row , col: cell.col});
            }
            return {
                ...cell,
                showHint: !cell.isBomb && arr.indexOf(cell.key) > -1 || cell.showHint
            }
        }))
        if (empties.length) {
            const list = empties.reduce((acc , { row, col}) => acc.concat(this.getAdjascents(row, col, this.state.flatMatrix)) , []);
            return this.review(list, newMatrix)
        } else {
            return newMatrix;
        }
    }

  render() {
    return (
      <div>
        <h3>Board</h3>
        { this.state.matrix.map( (cells, idx) => (
            <div className="row" key={idx} >{ cells.map( props => <Cell {...props} clickCell={this.clickCell} />)
            }</div>
        )) }
      </div>
    )
  }
}
