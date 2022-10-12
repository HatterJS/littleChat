export default function reducer(state, action) {
    switch (action.type) {
        case 'IS_AUTORIZATION':
            return {
                ...state, 
                isAuthorization: true,
                roomName: action.payload.roomName,
                password: action.payload.password,
                userName: action.payload.userName,
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                messageData: [...state.messageData, action.payload]
            }
        default:
            return state;
    }
}