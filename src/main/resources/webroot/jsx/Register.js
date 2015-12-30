//Register.js

var Register = React.createClass({
	contextTypes: {
		history: React.PropTypes.object,
	},

	getInitialState: function() {
	    return {secretSeedInput: '', error: ''};
	},
	
	handleSecretSeedChange: function(event){
		this.setState({secretSeedInput: event.target.value});
	},
	
	generateRandomSeed: function(){
		var randomSeed = lightwallet.keystore.generateRandomSeed();
		console.log(randomSeed);
		this.setState({secretSeedInput: randomSeed});
	},
	
	
	registerOnServer: function(){
		var identifier = this.refs.identifier.getValue().trim();
		var password = this.refs.password.getValue()
		var ks = new lightwallet.keystore(this.state.secretSeedInput, password)
		var token = CryptoJS.SHA3(identifier+':'+password, { outputLength: 256 }).toString();
		console.log(token);
		var keystoreData={
			identifier: identifier,
			keystore: JSON.parse(ks.serialize()),
			token: token
		}
		
		//console.log(keystoreData);	
		
	
		KeystoreAPI.keystorePost(keystoreData,
			function(_postResult){
				this.context.history.replaceState(null,'/dashboard');
			}.bind(this),
			function(status,responseText){
				var resp=JSON.parse(responseText);
				if(resp.status=='fail'){
					//console.log("Error:"+resp.data.message);
					this.setState({error: resp.data.message});				
				}
				//console.log("error in keystorePost");
			}.bind(this)
		);
		
	},

	handleAlertDismiss() {
	    this.setState({error: ''});
	 },
	  
  render: function() {
  	var footer = (
	        	<ButtonToolbar>
	        		<Button bsStyle='primary' onClick={this.registerOnServer}>Register</Button>
	        		<Button bsStyle='primary' onClick={this.generateRandomSeed}>Generate Random Secret Seed</Button>
	        	</ButtonToolbar>
        	
	);
  	
  	var errorAlert;
	if (this.state.error!='') {
		errorAlert = (
        <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss} >
          <h4>Something wrong!</h4>
          <p>{this.state.error}</p>
        </Alert>
      );
    }
	
	var secretSeedInputStatus;
	if(this.state.secretSeedInput==''){
		secretSeedInputStatus='';
	}else{
		if(lightwallet.keystore.isSeedValid(this.state.secretSeedInput)){
			secretSeedInputStatus='Seed OK';
		}else{
			secretSeedInputStatus='Seed Not Valid';
		}
	}
	
    return (
    	<Panel header="" footer={ footer }>
    		{errorAlert}
        	<form>
          	<Label>Identifier</Label>
        		<Input type="text" placeholder="identifier" ref='identifier' />
          	<Label>Password</Label>
        		<Input type="password" ref='password' />
          	<Label>Secret Seed</Label>
        		<Input type="password" ref='secredSeed' value={this.state.secretSeedInput}  
        			onChange={this.handleSecretSeedChange} addonAfter={secretSeedInputStatus}/>
	        </form>
		</Panel>
    );
  }
});