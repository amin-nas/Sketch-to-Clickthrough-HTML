import React from 'react'
import ReactDOM from 'react-dom'
import pluginCall from 'sketch-module-web-view/client'

class Preferences extends React.Component {

	constructor (props) {
    super(props)
    this.state = {
      prefs: window.prefs || {}
    }
  }

  render () {
    console.log(this.state.prefs)
    return (
      <div>
        {JSON.stringify(this.state.prefs)}
      </div>
    )
  }
}

ReactDOM.render(<Preferences/>, document.getElementById('container'))