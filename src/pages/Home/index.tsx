import React from 'react';
import { Play } from 'phosphor-react';
import { 
  CountDownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountMinutes, 
  Separator, 
  StartCountDownButton, 
  TaskInput 
} from './styles';

const Home = () => {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
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
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDownButton disabled type="submit">
          <Play size={24}/>
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  );
}

export default Home;