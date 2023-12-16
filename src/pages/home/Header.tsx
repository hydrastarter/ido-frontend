import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.svg";
import LogoInner from "../../assets/images/logo-inner.svg";
import { Link } from "react-router-dom";
import "./index.css";
import { useRouteMatch, useParams } from "react-router-dom";
function Header(page: any) {
  const [show, setShow] = useState(false);
  const route = useRouteMatch();
  const params: { id: string } = useParams();

  console.log(route.url, "kkkkkkkk", params.id);

  return (
    <>
      {page.page == "yes" ? (
        <div className="main-header inner-header">
          <div className="container">
            <div className="wrap-header">
              <div className="logo-brand">
                <Link to="/">
                  <img src={LogoInner} className="" alt="" />
                </Link>
              </div>
              <div className="right-nav">
                <div className={show ? "show" : ""}>
                  <ul className="reset">
                    {route.url === "/my_crowdsale" ? (
                      <li>
                        <a href="/" className="link1">
                          Dashboard
                        </a>
                      </li>
                    ) : (
                      <li>
                        <a href="/my_crowdsale" className="link1">
                          My Crowdsale
                        </a>
                      </li>
                    )}

                    <li>
                      <a href="/" className="link2">
                        Connect wallet
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                onClick={() => setShow(!show)}
                className={show ? "open" : "menu-icon"}
              >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-header">
          <div className="container">
            <div className="wrap-header">
              <div className="logo-brand">
                <img src={Logo} className="" alt="" />
              </div>
              <div className="right-nav">
                <div className={show ? "show" : ""}>
                  <ul className="reset">
                    {route.url === "/my_crowdsale" ? (
                      <li>
                        <a href="/" className="link1">
                          Dashboard
                        </a>
                      </li>
                    ) : (
                      <li>
                        <a href="/my_crowdsale" className="link1">
                          My Crowdsale
                        </a>
                      </li>
                    )}
                    <li>
                      <a href="/" className="link2">
                        Connect wallet
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                onClick={() => setShow(!show)}
                className={show ? "open" : "menu-icon"}
              >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
