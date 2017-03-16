import React from 'react';
import '../css/components/App.css';
import 'react-select/dist/react-select.css';
var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
})

export default App;
