import TYPES from '../constants/chatTypes';
import type { Message } from '../reducers/chatReducer';
import { Dispatch } from 'redux';


export const fetchMessages = () => async (dispatch: Dispatch) => {
  dispatch({ type: TYPES.FETCH_HISTORY_LOADING });
  try {
    const res = await fetch('/api/chat/history');
    const data = await res.json();
    dispatch({ type: TYPES.FETCH_HISTORY_SUCCESS, payload: data.messages });
  } catch (error: any) {
    dispatch({ type: TYPES.FETCH_HISTORY_FAILURE, payload: error.message });
  }
};

export const sendMessage = (userMessage: Message) => async (dispatch: Dispatch) => {
  // Optimistically add user message
  dispatch({ type: TYPES.SEND_MESSAGE_LOADING });
  dispatch({ type: TYPES.SEND_MESSAGE_USER, payload: userMessage });

  try {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.message }),
    });
    const aiMessage = await res.json();
    dispatch({ type: TYPES.SEND_MESSAGE_SUCCESS, payload: aiMessage });
  } catch (error: any) {
    dispatch({
      type: TYPES.SEND_MESSAGE_FAILURE,
      payload: error.message,
    });
  }
};

export const setTyping = (isTyping: boolean) => ({
  type: TYPES.SET_TYPING,
  payload: isTyping,
});
