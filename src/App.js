import React, { Component } from 'react'
import Video from './Video';
import SendOtp from './components/sendOtp';
import abc from './components/abc';
import Home from './Home';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Profile from './components/Profile';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
class App extends Component {
	render() {
		return (
			<div>
				<Provider store={store}>
					<Switch>
						<Route path="/" exact component={Login} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route exact path ="/profile" component={Profile}/>
						<Route exact path ="/video" component={Video}/>
					</Switch>
				</Provider>
			</div>
		)
	}
}

export default App;