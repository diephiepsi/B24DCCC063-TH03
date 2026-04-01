import { useState, useEffect } from 'react';
import { MemberRecord } from '../../pages/TH05/utils';

export default () => {
  const [clubs, setClubs] = useState<any[]>(() => {
    const saved = localStorage.getItem('th5_clubs');
    return saved ? JSON.parse(saved) : [];
  });

  const [apps, setApps] = useState<any[]>(() => {
    const saved = localStorage.getItem('th5_apps');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('th5_clubs', JSON.stringify(clubs));
  }, [clubs]); 

  useEffect(() => {
    localStorage.setItem('th5_apps', JSON.stringify(apps));
  }, [apps]); 

  return {
    clubs,
    setClubs,
    apps,
    setApps,
  };
};
