export default function reducer(state, action) {
    switch (action.type) {
        case 'IS_AUTORIZATION':
            return {
                ...state, 
                isAuthorization: action.payload
            }
        default:
            return state;
    }
}