import { ReactNode, createContext, useState } from "react";

interface NewCycleFormData {
 task: string;
 minutesAmount: number;
}

interface ICycle {
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
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycledId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const setSecondsPassed = (seconds: number) => {
   setAmountSecondsPassed(seconds);
 }

 const markCurrentCycleAsFinished = () => {
   setCycles((prevState) => prevState.map((cycle) => {
     if(cycle.id === activeCycleId){
       return {...cycle, finishedDate: new Date()}
     } else {
       return cycle
     }
   }))
 }

 const createNewCycle = (data: NewCycleFormData) => {
  const id = String(new Date().getTime())
  const newCycle: ICycle = {
    id,
    task: data.task,
    minutesAmount: data.minutesAmount,
    startDate: new Date(),
  }
  setCycles((prevState) => [...prevState, newCycle]);
  setActiveCycledId(id);
  setAmountSecondsPassed(0);
  // reset();
}

const interruptCurrentCycle = () => {
  setCycles((preState) =>
    preState.map((cycle) => {
      if(cycle.id === activeCycleId){
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    })
  )
  setActiveCycledId(null);
}

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