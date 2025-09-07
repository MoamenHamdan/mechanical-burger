import { useState, useCallback } from 'react';
import { Burger } from '../types';
import { burgers as initialBurgers } from '../data/burgers';

export const useBurgers = () => {
  const [burgers, setBurgers] = useState<Burger[]>(initialBurgers);

  const addBurger = useCallback((burger: Burger) => {
    setBurgers(prev => [...prev, burger]);
  }, []);

  const editBurger = useCallback((updatedBurger: Burger) => {
    setBurgers(prev => 
      prev.map(burger => 
        burger.id === updatedBurger.id ? updatedBurger : burger
      )
    );
  }, []);

  const deleteBurger = useCallback((burgerId: string) => {
    setBurgers(prev => prev.filter(burger => burger.id !== burgerId));
  }, []);

  return {
    burgers,
    addBurger,
    editBurger,
    deleteBurger
  };
};