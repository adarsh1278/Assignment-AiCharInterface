import TYPES from '../constants/chatTypes';

export interface Message {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  status: string;
  timestamp: string;
}

export interface ChatState {
  loading: boolean;
  messages: Message[];
  typing: boolean;
  error: string | null;
}

const initialState: ChatState = {
  loading: false,
  messages: [],
  typing: false,
  error: null,
};

interface Action {
  type: string;
  payload?: any;
}

const chatReducer = (state = initialState, action: Action): ChatState => {
  switch (action.type) {
    case TYPES.FETCH_HISTORY_LOADING:
      return { ...state, loading: true, error: null };

    case TYPES.FETCH_HISTORY_SUCCESS:
      return { ...state, loading: false, messages: action.payload };

    case TYPES.FETCH_HISTORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TYPES.SEND_MESSAGE_LOADING:
      return { ...state, typing: true, error: null };

    case TYPES.SEND_MESSAGE_USER:
      return { ...state, messages: [...state.messages, action.payload] };

    case TYPES.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        typing: false,
        messages: [...state.messages, action.payload],
      };

    case TYPES.SEND_MESSAGE_FAILURE:
      return { ...state, typing: false, error: action.payload };

    case TYPES.SET_TYPING:
      return { ...state, typing: action.payload };

    default:
      return state;
  }
};

export default chatReducer;
