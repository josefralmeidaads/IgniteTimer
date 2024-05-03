import React, { useContext, useEffect, useState } from 'react';
import { CountDownContainer, Separator } from './styles';
import { differenceInSeconds } from 'date-fns';
import { CyclesContext } from '../..';

const CountDown = () => {
  const { 
    activeCycle, 
    activeCycleId, 
    markCurrentCycleAsFinished, 
    amountSecondsPassed,
    setSecondsPassed, 
  } = useContext(CyclesContext);
  
  
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

  useEffect(() => {
    let interval: number;

    if(activeCycle){
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

        if(secondsDifference >= totalSeconds){
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);

          clearInterval(interval)
        } else {
          setSecondsPassed(
            secondsDifference
          );
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  );
}

export default CountDown;