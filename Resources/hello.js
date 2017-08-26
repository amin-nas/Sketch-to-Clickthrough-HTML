import React from 'react'
import ReactDOM from 'react-dom'
import pluginCall from 'sketch-module-web-view/client'

class Preferences extends React.Component {

	constructor (props) {
    super(props)
    this.state = {
      artboards: window.artboards || {}
    }
  }

  render () {
    console.log(this.state.artboards)
    return (
      <div>
        Hi there
      </div>
    )
  }
}

ReactDOM.render(<Preferences/>, document.getElementById('container'));