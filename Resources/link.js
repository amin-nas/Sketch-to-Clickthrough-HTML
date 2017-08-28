import React from 'react'
import ReactDOM from 'react-dom'
import pluginCall from 'sketch-module-web-view/client'
import Dropdown from 'react-dropdown'

class Link extends React.Component {

	constructor (props) {
    super(props)
    this.state = {
      artboards: window.data.artboards || {}
    }
    this.onSelect = this.onSelect.bind(this)
  }

  componentDidMount () {
    // this.refs.artboardSelect.focus();
  }

  onSelect (option) {
    const data = JSON.stringify(option)
    pluginCall('setLink', data)
  }

  render () {
    const options = this.state.artboards
    const defaultOption = options[0][0]
    return (
      <div>
        <Dropdown 
          ref="artboardSelect"
          options={options}
          onChange={this.onSelect}
          value={defaultOption} 
          placeholder="Select an artboard" />
        <button onClick={() => pluginCall('setLink', 'Hello there bitches')}>
          Set Link
        </button>
      </div>
    )
  }
}

ReactDOM.render(<Link/>, document.getElementById('container'));