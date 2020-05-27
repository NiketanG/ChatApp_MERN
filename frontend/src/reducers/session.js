const initialState = {
    currentUser: {}
}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('currentUser', action.payload.username);
            return { ...state, currentUser: action.payload };
        case 'LOGOUT_USER':
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            return initialState;
        default:
            return state
    }
}

export default sessionReducer;