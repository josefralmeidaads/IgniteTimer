import React, { useContext } from 'react';
import { FormContainer, MinutesAmountMinutes, TaskInput } from './styles';
import { useForm, useFormContext } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CyclesContext } from '../../../../contexts/CyclesContext';


const NewCycleForm = () => {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();
  
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput 
        id="task" 
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions"
        {...register('task')}
        disabled={!!activeCycle}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1"></option>
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountMinutes 
        type="number" 
        id="minutesAmount" 
        placeholder="00"
        step={1}
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}

export default NewCycleForm;