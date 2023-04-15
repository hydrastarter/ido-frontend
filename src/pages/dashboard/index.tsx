import React, { useState } from 'react';
import Uik from '@reef-defi/ui-kit';
import './index.css';
import { idos } from '../../assets/ido';
import { IdoCard } from './idoCard';

export const Dashboard: React.FC = () => {
  const [firstTab, setFirstTab] = useState('Active Presales');

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
