//Login.js

var Login = React.createClass({
	getInitialState: function() {
	    return {error: ''};
	},	
	contextTypes: {
		history: React.PropTypes.object,
	},
	 
	goToRegister: function(){
		this.context.history.replaceState(null,'/register');
	},
	
	recover: function(){
		var identifier = this.refs.identifier.getValue().trim();
		var password = this.refs.password.getValue()
		var token = CryptoJS.SHA3(identifier+':'+password, { outputLength: 256 }).toString();
		//console.log(token);
		//console.log(identifier);	
		
	
		KeystoreAPI.keystoreGet(identifier,token,
			function(_postResult){
				//console.log(_postResult);
			    var keystoreData = _postResult;
			    this.props.setKeystoreData(keystoreData);
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
	
  render: function() {
	var footer = (
		<ButtonToolbar >
			<Button className="pull-right" bsStyle='primary' onClick={this.goToRegister}>Register</Button>
			<Button className="pull-right" bsStyle='primary' onClick={this.recover}>Recover Keystore</Button>
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
    return (
    	<ReactBootstrap.Row>
			<ReactBootstrap.Col md={6} mdOffset={3}>
				<Panel header="Recover Keystore from Server" footer={ footer }>
		    		{errorAlert}
		        	<form>
		          	<Label>Identifier</Label>
		        		<Input type="text" placeholder="identifier" ref='identifier' />
		          	<Label>Password</Label>
		        		<Input type="password" ref='password' />
		          	</form>
				</Panel>
			</ReactBootstrap.Col>
		</ReactBootstrap.Row>
    );
  }
});