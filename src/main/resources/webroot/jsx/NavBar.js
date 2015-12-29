//NavBar.jsx

var NavBar = React.createClass({
  render: function() {
    return (
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">LightWallet Keyserver</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
        	<NavItem eventKey={2} href="#">Login</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
  }
});