import React from 'react';
import Uik from '@reef-defi/ui-kit';
import './idoCard.css';
import { idoType } from '../../assets/ido';

export const IdoCard = ({ ido } : {ido: idoType}): JSX.Element => {
  const value = Math.floor(Math.random() * (100 - 1 + 1) + 1);

  return (
    <Uik.Card key={ido.name} className="ido-card">
      <div className="ido-card-avatar-box">
        <Uik.Avatar image={ido.image} size="large" />
      </div>
      <div className="ido-card-name-box">
        <Uik.Text type="title">{ido.name}</Uik.Text>
        <Uik.Text type="light" className="ido-card-name_symbol">
          {ido.symbol}
        </Uik.Text>
      </div>
      <div className="ido-card-slider-box">
        <Uik.Slider
          value={value}
          tooltip={`${value}%`}
          helpers={[
            { position: 0, text: '0%' },
            { position: 25 },
            { position: 50, text: '50' },
            { position: 75 },
            { position: 100, text: '100%' },
          ]}
        />
      </div>
      <div className="ido-card-name-box">
        <Uik.Text type="light">Hardcap: </Uik.Text>
        <Uik.Text type="lead" className="ido-card-name_symbol">
          {ido.hardcap}
          {ido.symbol}
        </Uik.Text>
      </div>
    </Uik.Card>
  );
};
