import React, { useEffect, useState } from 'react';
import Uik from '@reef-defi/ui-kit';
import './index.css';
import { idos } from '../../assets/ido';
import { IdoCard } from './idoCard';

export const Dashboard: React.FC = () => {
  const [firstTab, setFirstTab] = useState('Active Presales');

  const getAllIdos = async () => {
    console.log('here');
    const username = 'adminUser';
    const password = 'password';
    const token = btoa(`${username}:${password}`);
    console.log('token: ', token);
    const resp = await fetch('http://54.227.136.157/crowdsale', {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    console.log('resp: ', resp);

    const ido = await resp.json();
    console.log('idos: ', ido);
    return 0;
  };

  useEffect(() => {
    getAllIdos().catch((e) => console.log('Error in getALlIdos: ', e));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="tabs-container">
        <Uik.Tabs
          value={firstTab}
          onChange={(value) => setFirstTab(value)}
          options={[
            'Active Presales',
            'Upcoming Presales',
            'Completed Presales',
            'My Crowdsale',
          ]}
        />
      </div>
      <div className="idos-container">
        {idos.map((ido) => (
          <IdoCard key={ido.name} ido={ido} />
        ))}
      </div>
    </div>
  );
};
