import React, { createContext, useEffect, useState } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import {  
  HomeContainer,  
  StartCountDownButton, 
  StopCountDownButton, 
} from './styles';
import NewCycleForm from './components/NewCycleForm';
import CountDown from './components/CountDown';

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface ICyclesContextType {
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
 }
 
export const CyclesContext = createContext({} as ICyclesContextType);

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1, 'O ciclo precisa ser no mínimo de 5 minutos')
  .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
})

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycledId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const methods = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  const { handleSubmit, watch, reset } = methods;

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

  const handleCreateNewCycle = (data: NewCycleFormData) => {
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
    reset();
  }

  const handleInterruptCycle = () => {
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

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <CyclesContext.Provider value={{ 
      activeCycle, 
      activeCycleId, 
      markCurrentCycleAsFinished, 
      amountSecondsPassed, 
      setSecondsPassed,
    }}>
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
          <FormProvider {...methods}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />

          {activeCycle ? (
            <StopCountDownButton onClick={handleInterruptCycle} type="button">
              <HandPalm size={24}/>
              Interromper
            </StopCountDownButton>
          ) : 
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24}/>
            Começar
          </StartCountDownButton>
          }
        </form>
      </HomeContainer>
    </CyclesContext.Provider>
  );
}

export default Home;