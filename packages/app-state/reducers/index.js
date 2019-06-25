import { ADD_REPO } from '../actions/constants';

const initialState = {
  repoList: []
};

export default function rootReducer(state = initialState, { type, payload }) {
  if (type === ADD_REPO) {
    // make a copy
    return Object.assign({}, state, {
      repoList: state.repoList.concat(payload)
    });
  }
  return state;
}