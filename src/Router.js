import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Participate from './pages/Participate';
import Profile from './pages/Profile';
import Register from './pages/Register';

const RouterComponent = () => {
	return (
		<Router>
			<Scene key='root' hideNavBar>
				<Scene key='auth' initial>
					<Scene key='login' component={Login} title='Please Login' hideNavBar initial />
					<Scene key='register' component={Register} title='Please Register' hideNavBar />
				</Scene>
				<Scene key='participate' component={Participate} title='Secret code' hideNavBar />
				<Scene key='main'>
					<Scene key='dashboard' component={Dashboard} title='Dashboard' initial />
					<Scene key='profile' component={Profile} title='Profile' />
				</Scene>
			</Scene>
		</Router>
	);
};

export default RouterComponent;