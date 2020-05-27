const initialState = {
    messages: [],
}

const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'CLEAR_MESSAGES':
            return { ...state, messages: [] }
        default:
            return state
    }
}

export default messagesReducer;