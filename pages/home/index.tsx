import React from "react";
import "./styles.scss";
import "../../../node_modules/slick-carousel/slick/slick.css"
import "../../../node_modules/slick-carousel/slick/slick-theme.css"
import Header from "./Header";
import Banner from "./Front-page/Banner";
import PreviousPresales from "./Front-page/PreviousPresales";

function HydraStarterSlide() {
  
    return (

        <>
            <Header />
            <Banner />
            <PreviousPresales />
        </>
       

    );
}

export default HydraStarterSlide;
