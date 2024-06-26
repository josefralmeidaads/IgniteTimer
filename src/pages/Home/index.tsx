import React, {  useContext } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import {  
  HomeContainer,  
  StartCountDownButton, 
  StopCountDownButton, 
} from './styles';
import NewCycleForm from './components/NewCycleForm';
import CountDown from './components/CountDown';
import { CyclesContext } from '../../contexts/CyclesContext';


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1, 'O ciclo precisa ser no mínimo de 5 minutos')
  .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
})

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

const Home = () => {
  const {
    activeCycle,
    createNewCycle,
    interruptCurrentCycle
  } = useContext(CyclesContext);

  const methods = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  const { handleSubmit, watch, reset } = methods;

  const task = watch('task');
  const isSubmitDisabled = !task;

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...methods}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />

        {activeCycle ? (
          <StopCountDownButton onClick={interruptCurrentCycle} type="button">
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
  );
}

export default Home;