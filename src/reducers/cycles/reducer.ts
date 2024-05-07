import { produce } from 'immer';

import { ActionTypes } from "./actions";

interface ICycle {
 id: string;
 task: string;
 minutesAmount: number;
 startDate: Date;
 interruptedDate?: Date;
 finishedDate?: Date;
}

interface ICyclesState {
 cycles: ICycle[];
 activeCycleId: string | null
}

export const cyclesReducer = (state: ICyclesState, action: any) => {
 switch (action.type) {
  case ActionTypes.ADD_NEW_CYCLE:
    return produce(state, (draft) => {
      draft.cycles.push(action.payload.newCycle)
      draft.activeCycleId = action.payload.newCycle.id
    });
  break;

  case ActionTypes.INTERRUPT_CURRENT_CYCLE:
    const currentCycleIndex = state.cycles.findIndex((cycle) => cycle.id === state.activeCycleId);
    if(currentCycleIndex < 0) return state;
    return produce(state, (draft) => {
      draft.activeCycleId = null;
      draft.cycles[currentCycleIndex].interruptedDate = new Date();
    })
  break;

  case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
    const currentCycleIndexAsFinished = state.cycles.findIndex((cycle) => cycle.id === state.activeCycleId);
    if(currentCycleIndexAsFinished < 0) return state;
    return produce(state, (draft) => {
      draft.activeCycleId = null;
      draft.cycles[currentCycleIndexAsFinished].finishedDate = new Date();
    })
  break;

  default:
    break;
}
return state
}