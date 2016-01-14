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
			
			var keystoreData=this.props.keystoreData;
			keystoreData.keystore =  JSON.parse(ks.serialize());
			//console.log(keystoreData);	
			
		
			KeystoreAPI.keystorePut(keystoreData.token,keystoreData,
				function(_postResult){
					this.setState({ks: ks, addressError: null});
				}.bind(this),
				function(status,responseText){
					var resp=JSON.parse(responseText);
					this.setState({addressError: resp.data.message});
					//console.log("error in keystorePut");
				}.bind(this)
			);
			
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
	 
	 changePassword: function(){
		try{
			var keystoreData=this.props.keystoreData;
			var password = this.refs.passwordChange.getValue()
			var passwordNew = this.refs.passwordChangeNew.getValue()
			
			var countAddresses = this.state.ks.getAddresses().length;
			var secretSeed =this.state.ks.getSeed(password);
			var ks = new lightwallet.keystore(secretSeed, passwordNew);
			ks.generateNewAddress(passwordNew,countAddresses);
			
			var keystoreData=this.props.keystoreData;
			keystoreData.keystore =  JSON.parse(ks.serialize());
			
			var oldToken=keystoreData.token;
			scrypt(passwordNew, keystoreData.identifier, 1, 1, 256, 1000, function(_token) {
				keystoreData.token = _token;
				//console.log("token:"+_token);
				
				KeystoreAPI.keystorePut(oldToken,keystoreData,
					function(_postResult){
						this.setState({ks: ks, changePasswordError: null});
					}.bind(this),
					function(status,responseText){
						var resp=JSON.parse(responseText);
						this.setState({changePasswordError: resp.data.message});
						//console.log("error in keystorePut");
					}.bind(this)
				);
				
			}.bind(this), "hex");
			
			
		} catch(e){
			this.setState({changePasswordError: e.message})
		}
	},
	 
	 deleteKeystore: function(){
		try{
			var keystoreData=this.props.keystoreData;
			KeystoreAPI.keystoreDelete(keystoreData.identifier,keystoreData.token,
				function(_postResult){
					this.props.setKeystoreData('');
					this.context.history.replaceState(null,'/');
				}.bind(this),
				function(status,responseText){
					var resp=JSON.parse(responseText);
					this.setState({deleteError: resp.data.message});
					//console.log("error in keystoreDelete");
				}.bind(this)
			);
			
		} catch(e){
			this.setState({deleteError: e.message})
		}
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

	  var changePasswordError;
	  if(this.state.changePasswordError != undefined){
		  changePasswordError = ( <Alert bsStyle="danger"><p>{this.state.changePasswordError}</p></Alert>)
	  }

	  
	  var deleteError;
	  if(this.state.deleteError != undefined){
		  deleteError = ( <Alert bsStyle="danger"><p>{this.state.deleteError}</p></Alert>)
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
				<Panel header="Change password">
					{changePasswordError}
					<form>
		          	<Label>Actual Password</Label>
		        		<Input type="password" ref='passwordChange' placeholder="password"/>
		          	<Label>New Password</Label>
		        		<Input type="password" ref='passwordChangeNew' placeholder="password"/>
		          	</form>
					<ButtonToolbar >
						<Button className="pull-right" bsStyle='primary' onClick={this.changePassword}>Change Password</Button>
					</ButtonToolbar >
		    	</Panel>
				<Panel header="Delete keystore from keyserver">
					{deleteError}
					<Well>
					Delete keystore from server and from browser. Be sure to have backup. This action is irreversible.
					</Well>
					<ButtonToolbar >
						<Button className="pull-right" bsStyle='danger' onClick={this.deleteKeystore}>Delete permanently from keyserver</Button>
					</ButtonToolbar >
	        	</Panel>
			</ReactBootstrap.Col>
		</ReactBootstrap.Row>
    );
  }
});