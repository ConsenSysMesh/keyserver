//Dashboard.jsx
var Dashboard = React.createClass({
	contextTypes: {
		history: React.PropTypes.object,
	},	
	getInitialState: function() {
	    return {ks: ''};
	},	
	componentDidMount: function(){
		if(this.props.keystoreData == ''){
			console.log("no keystoreData. redirecting to /");
			this.context.history.replaceState(null,'/');
		}else{
			var ks= lightwallet.keystore.deserialize(JSON.stringify(this.props.keystoreData.keystore));
			this.setState({ks: ks});
			
		}
	},
	

	generateNewAddress: function(){
		var password = this.refs.passwordAddress.getValue()
		try{
			var ks=this.state.ks;
			ks.generateNewAddress(password);
			//TODO: Store ks in keyserver
			this.setState({ks: ks, addressError: null});
		} catch(e){
			this.setState({addressError: e.message})
		}
	},
	
	getSeed: function(){
		var password = this.refs.passwordSeed.getValue()
		var secretSeed;
		try{
			secretSeed =this.state.ks.getSeed(password);
			this.setState({seed: secretSeed})
		} catch(e){
			this.setState({seedError: e.message})
		}
	},
	
	handleSeedDismiss() {
	    this.setState({seed: null, seedError:null });
	 },
	
  render: function() {
	  var addresses;
	  if(this.state.ks!=''){
		  var rows = this.state.ks.getAddresses().map(function (addr) {
			return (
	      		<tr key={addr}>
		        	<td><code>0x{addr}</code></td>
		    	</tr>
			);
		  });
		  addresses = (
			  <Table striped bordered condensed hover>
			    <tbody>
			      {rows}
			    </tbody>
			  </Table>
		  );
	  }
	  
	  var newAddressButton = (<Button bsStyle='primary' onClick={this.generateNewAddress}>New Address</Button>);
	  var addressError;
	  if(this.state.addressError != undefined){
		  addressError = ( <Alert bsStyle="danger"><p>{this.state.addressError}</p></Alert>)
	  }
	  
	  var getSeedButton = (<Button bsStyle='primary' onClick={this.getSeed}>Show Secret Seed</Button>);
	  var secretSeed;
	  if(this.state.seed != undefined){
		  secretSeed = ( <Alert bsStyle="info" onDismiss={this.handleSeedDismiss} dismissAfter={5000} ><p>{this.state.seed}</p></Alert>)
	  }else if(this.state.seedError != undefined){
		  secretSeed = ( <Alert bsStyle="danger"><p>{this.state.seedError}</p></Alert>)
	  }
	  
		return (
			<ReactBootstrap.Row>
			<ReactBootstrap.Col md={6}>
				<Panel header="Keystore Addresses">
					{addressError}
					{addresses}
					<form>
		          	<Label>Generate New Address</Label>
		        		<Input type="password" ref='passwordAddress' placeholder="password" buttonAfter={newAddressButton}/>
		          	</form>
				</Panel>
				
				<Panel header="Keystore Seed">
				{secretSeed}
				<form>
	          	<Label>Show Keystore Secret Seed</Label>
	        		<Input type="password" ref='passwordSeed' placeholder="password" buttonAfter={getSeedButton}/>
	          	</form>
			</Panel>
			</ReactBootstrap.Col>
			<ReactBootstrap.Col md={6}>
				<Well>
					<h4>Change Password</h4>
					(not implemented yet)
				</Well>
				<Well>
					<h4>Delete from keyserver</h4>
					(not implemented yet)
				</Well>
			</ReactBootstrap.Col>
		</ReactBootstrap.Row>
    );
  }
});