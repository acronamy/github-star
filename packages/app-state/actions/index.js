import { ADD_REPO } from './constants';

export function addRepo(payload) {
  return {
    type: ADD_REPO,
    payload
  };
}