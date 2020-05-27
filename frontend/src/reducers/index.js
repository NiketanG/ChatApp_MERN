import sessionReducer from './session';
import messagesReducer from './messages';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    session: sessionReducer,
    messages: messagesReducer
});

export default rootReducer;

