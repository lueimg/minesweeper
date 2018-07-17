import React, { Component } from 'react'

export default class Cell extends Component {

    static defaultProps = { 
        isBomb: false,
        row: 1,
        col: 1,
        showHint: false,
        hint: null,
        clickCell: () => ({})
    }

    onClick = () => {
        this.props.clickCell(this.props);
    }


  render() {
    return (
      <div className="cell" onClick={this.onClick}>
      { this.props.isBomb && '(b)'}
        {this.props.showHint && this.props.hint > 0 && `(${this.props.hint})` }
      </div>
    )
  }
}
