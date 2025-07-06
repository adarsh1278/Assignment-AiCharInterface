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
      // Set typing to true when we start sending a message
      return { ...state, typing: true, error: null };

    case TYPES.SEND_MESSAGE_USER:
      // User message added, update its status to 'sent' and keep typing true as AI is about to respond
      const updatedUserMessage = { ...action.payload, status: 'sent' };
      return { 
        ...state, 
        messages: [...state.messages, updatedUserMessage],
        typing: true // Keep typing true until AI responds
      };

    case TYPES.SEND_MESSAGE_SUCCESS:
      // AI responded successfully, stop typing
      return {
        ...state,
        typing: false, // AI finished typing
        messages: [...state.messages, action.payload],
      };

    case TYPES.SEND_MESSAGE_FAILURE:
      // Failed to send message, stop typing
      return { 
        ...state, 
        typing: false, 
        error: action.payload 
      };

    case TYPES.SET_TYPING:
      return { ...state, typing: action.payload };

    default:
      return state;
  }
};

export default chatReducer;

