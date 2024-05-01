import React, { useEffect, useState } from 'react';
import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import { 
  CountDownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountMinutes, 
  Separator, 
  StartCountDownButton, 
  TaskInput 
} from './styles';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, 'O ciclo precisa ser no mínimo de 5 minutos')
  .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
}

const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycledId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    let interval: number;

    if(activeCycle){
     interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate));
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

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

  const task = watch('task');
  const isSubmitDisabled = !task;

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // minutos em segundos
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0; // total de segundos - segundos que se passou

  const minutesAmount = Math.floor(currentSeconds / 60); //Obtendos minutos do total de segundos
  const secondsAmount = currentSeconds % 60 // oque sobra de segundos dividos por 60

  const minutes = String(minutesAmount).padStart(2, '0'); // se minha string não tiver 2 caracteres preencha o segundo com zero
  const seconds = String(secondsAmount).padStart(2, '0'); // se minha string não tiver 2 caracteres preencha o segundo com zero

  useEffect(() => {
    if(activeCycle){
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountMinutes 
            type="number" 
            id="minutesAmount" 
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        <StartCountDownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24}/>
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  );
}

export default Home;