import { useState, useEffect } from 'react';

export default () => {
  const [destinations, setDestinations] = useState<any[]>(() => {
    const saved = localStorage.getItem('th6_destinations');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Vịnh Hạ Long', type: 'beach', price: 1500000, rating: 5, time: 8, foodCost: 500000, stayCost: 800000, moveCost: 200000, image: 'https://picsum.photos/id/1015/400/300', location: 'Quảng Ninh' },
      { id: '2', name: 'Sapa', type: 'mountain', price: 2000000, rating: 4.5, time: 10, foodCost: 600000, stayCost: 1000000, moveCost: 400000, image: 'https://picsum.photos/id/1018/400/300', location: 'Lào Cai' }
    ];
  });

  const [itinerary, setItinerary] = useState<any[]>(() => {
    const saved = localStorage.getItem('th6_itinerary');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem('th6_budget_limit');
    return saved ? Number(saved) : 5000000;
  });

  useEffect(() => {
    localStorage.setItem('th6_destinations', JSON.stringify(destinations));
    localStorage.setItem('th6_itinerary', JSON.stringify(itinerary));
    localStorage.setItem('th6_budget_limit', budgetLimit.toString());
  }, [destinations, itinerary, budgetLimit]);

  return { destinations, setDestinations, itinerary, setItinerary, budgetLimit, setBudgetLimit };
};