import { combineReducers } from "redux";
import {clientRuducer} from './clientReducer'
import { loadingRuducer } from "./loadingRuducer";
import { optionsBoardReducer } from "./optionsBoardReducer";
const allReducers = combineReducers({
  client: clientRuducer,
  isLoading: loadingRuducer,
  optionsBoard:optionsBoardReducer
});
export default allReducers