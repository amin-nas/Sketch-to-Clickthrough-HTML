import React from 'react';
import ReactDOM from 'react-dom';
import pluginCall from 'sketch-module-web-view/client';


class Hello extends React.Component {

	constructor() {
		super();
		this.testFunction = this.testFunction.bind(this);
	}

	testFunction () {
		pluginCall('nativeLog', 'Called from the webview againnnn');
	}

	render() {
	// Any where else
		return (
			<div>
				<button onClick={(e) => this.testFunction(e)}>Hello there</button>
			</div>
		)
	}
}

ReactDOM.render(<Hello/>, document.getElementById('container'));