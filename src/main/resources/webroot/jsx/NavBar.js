//NavBar.jsx

var NavBar = React.createClass({
	contextTypes: {
		history: React.PropTypes.object,
	},
	 
	goToRegister: function(){
		this.context.history.replaceState(null,'/register');
	},
	goToLogin: function(){
		this.context.history.replaceState(null,'/login');
	},
  
  render: function() {
	return (
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">LightWallet Keyserver</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
    	<NavItem eventKey={1} onClick={this.goToRegister} >Register</NavItem>
    	<NavItem eventKey={2} onClick={this.goToLogin} >Login</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
  }
});