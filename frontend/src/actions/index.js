const loginUser = user => ({
    type: 'LOGIN_USER',
    payload: user
});

const logoutUser = () => ({
    type: 'LOGOUT_USER',
});

const addMessage = message => ({
    type: 'ADD_MESSAGE',
    payload: message
});

const clearMessages = () => ({
    type: 'CLEAR_MESSAGES'
});

export { loginUser, logoutUser, addMessage, clearMessages };
