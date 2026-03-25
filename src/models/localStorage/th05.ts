import { useState } from 'react';

export default () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  return { clubs, setClubs, apps, setApps };
};