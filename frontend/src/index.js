import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/index';
import SignIn from './Home/Login'
import SignUp from './Home/SignUp'
import Home from './Home';
import Chat from './Chat';


const history = createBrowserHistory();

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Main = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/signup" component={SignUp} />
                    <Route path="/login" component={SignIn} />
                    <Route path="/Chat" component={Chat} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        </Provider>
    )
}

ReactDOM.render(
    <Router history={history}>
        <Main history={history} />
    </Router>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
