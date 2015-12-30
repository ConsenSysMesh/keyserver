// This makes ReactRouter more consumable.
window.DefaultRoute = ReactRouter.DefaultRoute;
window.Link = ReactRouter.Link;
window.Route = ReactRouter.Route;
window.Router = ReactRouter.Router;
window.IndexRoute = ReactRouter.IndexRoute;

//Bootstap-react
window.Glyphicon = ReactBootstrap.Glyphicon;
window.Panel = ReactBootstrap.Panel;
window.ButtonToolbar = ReactBootstrap.ButtonToolbar;
window.Button = ReactBootstrap.Button;
window.Label = ReactBootstrap.Label;
window.Input = ReactBootstrap.Input;
window.Table = ReactBootstrap.Table;
window.Modal = ReactBootstrap.Modal;
window.Alert = ReactBootstrap.Alert;
window.Navbar = ReactBootstrap.Navbar;
window.NavItem = ReactBootstrap.NavItem;
window.Nav = ReactBootstrap.Nav;
window.NavDropdown = ReactBootstrap.NavDropdown;
window.MenuItem = ReactBootstrap.MenuItem;
window.Well = ReactBootstrap.Well;

var App = React.createClass({
	getInitialState: function() {
	    return {keystoreData: ''};
	},
	
	setKeystoreData: function(_keystoreData){
		this.setState({keystoreData: _keystoreData})
	},
	
  render: function() {
	    return (
	      <div>
	        <NavBar keystoreData={this.state.keystoreData} setKeystoreData={this.setKeystoreData} />
	        <div className="container-fluid">
	        {React.cloneElement(this.props.children, {keystoreData: this.state.keystoreData, setKeystoreData: this.setKeystoreData})}
	        </div>
	      </div>
	    );
	  }
	});



window.onload = function() {
    ReactDOM.render((
    <Router>
      <Route path="/" component={App}>
        <IndexRoute component={FrontPage} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Route>
    </Router>
    ), document.getElementById('root'))
  };
