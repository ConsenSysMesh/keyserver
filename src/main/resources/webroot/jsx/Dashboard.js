//Dashboard.jsx
var Dashboard = React.createClass({
	contextTypes: {
		history: React.PropTypes.object,
	},	
	
	componentDidMount: function(){
		if(this.props.keystoreData == ''){
			console.log("no keystoreData. redirecting to /");
			this.context.history.replaceState(null,'/');
		}
	},
	
  render: function() {
	return (
      <div>
        (Dashboard to be included)
      </div>
    );
  }
});