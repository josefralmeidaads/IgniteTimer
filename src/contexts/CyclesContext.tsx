import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { cyclesReducer } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface NewCycleFormData {
 task: string;
 minutesAmount: number;
}

export interface ICycle {
 id: string;
 task: string;
 minutesAmount: number;
 startDate: Date;
 interruptedDate?: Date;
 finishedDate?: Date;
}

interface ICyclesContextType {
 cycles: ICycle[];
 activeCycle: ICycle | undefined;
 activeCycleId: string | null;
 markCurrentCycleAsFinished: () => void;
 amountSecondsPassed: number;
 setSecondsPassed: (seconds: number) => void;
 createNewCycle: (data: NewCycleFormData) => void;
 interruptCurrentCycle: () => void;
}

interface ICycleContextProvider {
 children: ReactNode;
}

export const CyclesContext = createContext({} as ICyclesContextType);

export const CyclesContextProvider = ({ children }: ICycleContextProvider) => {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

    if(storedStateAsJSON){
      return JSON.parse(storedStateAsJSON);
    }

    return initialState;
  });

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activeCycle){
      return differenceInSeconds(new Date(), new Date(activeCycle?.startDate))
    }

    return 0
  });

  const setSecondsPassed = (seconds: number) => {
    setAmountSecondsPassed(seconds);
  }

 const markCurrentCycleAsFinished = () => {
  dispatch(markCurrentCycleAsFinishedAction())
 }

 const createNewCycle = (data: NewCycleFormData) => {
    const id = String(new Date().getTime())
    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0);
  }

  const interruptCurrentCycle = () => {
    dispatch(interruptCurrentCycleAction())
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
  }, [cyclesState])

 return (
  <CyclesContext.Provider value={{
   cycles, 
   activeCycle, 
   activeCycleId, 
   markCurrentCycleAsFinished, 
   amountSecondsPassed, 
   setSecondsPassed,
   createNewCycle,
   interruptCurrentCycle,
 }}>
  {children}
 </CyclesContext.Provider>
 )
}