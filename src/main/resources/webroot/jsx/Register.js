//Register.js

var Register = React.createClass({

	getInitialState: function() {
	    return {secretSeedInput: ''};
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
		var token = identifier+':'+password; //CryptoJS.SHA3(identifier+':'+password, { outputLength: 256 }).toString();
		
		var keystoreData={
			identifier: identifier,
			keystore: JSON.parse(ks.serialize()),
			token: token
		}
		
		console.log(keystoreData);	
		
	
		KeystoreAPI.keystorePost(keystoreData,
			function(_postResult){
				console.log(_postResult);
			}.bind(this),
			function(){
				console.log("error in keystorePost");
			}.bind(this)
		);
		
	},


  render: function() {
  	var footer = (
	        	<ButtonToolbar>
	        		<Button bsStyle='primary' onClick={this.registerOnServer}>Register</Button>
	        		<Button bsStyle='primary' onClick={this.generateRandomSeed}>Generate Random Secret Seed</Button>
	        	</ButtonToolbar>
        	
	);
	
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