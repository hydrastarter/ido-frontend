import React from 'react';
import './hero.css';
import Uik from '@reef-chain/ui-kit';

const { Bubbles } = Uik;

function Hero(props:any) {
  return (
    <div className='hero'>
      <div className='headline-wrapper'>
        <h1 className='hero-headline'>
          {props.title}
        </h1>
        <p className='hero-subtitle'>
          {props.subtitle}
        </p>
      </div>
      
      <Bubbles />
      <img className='hero-image' 
           src={'/img/' + props.imgsrc} 
      />
    </div>
  );
}

export default Hero;
