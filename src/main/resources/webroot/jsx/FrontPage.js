//FrontPage.jsx
var FrontPage = React.createClass({
  render: function() {
    return (
    	<ReactBootstrap.Row>
			<ReactBootstrap.Col md={6}>
			<Well>
			<h4>Welcome to the Keyserver</h4>
			<p>This a keyserver designed to store a <a href="https://github.com/ConsenSys/eth-lightwallet">lightwallet</a> keystore. 
			You probably will never need to interact with this server, you will be using it indirectly thru a dApp. Anyways, if you want to
			recover your keystore from a dead dApp or the dApp is sending you here to create/register a keystore we have created an inteface 
			to do that.</p>
			<p>If you want to create and register a new keystore, please do it at <Link to="/register">Register</Link></p>
			<p>If you have a seed and want to register it in this keyserver, please do it at <Link to="/register">Register</Link></p>
			<p>If you have keystore registered here and want to manage it, please log in first in <Link to="/login">Login</Link></p>
			</Well>
			</ReactBootstrap.Col>
			<ReactBootstrap.Col md={6}>
				<Well>
					<h4>API Access</h4>
					<p>If you are a developer and want to integreate your dApp with this keyserver
					for a better user experience, please use the API. For now the only documentation is
					at: <a href="https://github.com/ConsenSys/keyserver">https://github.com/ConsenSys/keyserver</a></p>
					<p>You may find <a href="https://github.com/ConsenSys/keyserver/blob/master/src/main/resources/webroot/js/keystore-api.js"> this </a> javascript file useful</p>
				</Well>
			</ReactBootstrap.Col>
		</ReactBootstrap.Row>
    );
  }
});