import React, { useState } from "react";

import styles from "./Header.module.scss";
import logoImage from "../../resources/images/beerforge_logo.svg";
import { Link, withRouter } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import Tooltip from "../Tooltip/Tooltip";

function Header({ currentUser, logOutUser, history }: any) {
  const [showTooltip, setTooltip] = useState(false);

  const logOut = (e: any) => {
    setTooltip(false);
    logOutUser();
  }

  const goToProfile = (e: any) => {
    setTooltip(false);
    history.push('/profile')
  }

  return (
    <header className={styles.header}>
      <Link to={!currentUser ? "/" : "/dashboard"} className={styles.logoLink}>
        <img src={logoImage} alt="BeerForge - Modern homebrewing" />
      </Link>
      {window.location.pathname !== "/login" && !currentUser ? (
        <Link to="/login" className={styles.loginLink}>
          Log In
        </Link>
      ) : null}
      {window.location.pathname !== "/profile" && currentUser ? (
        <div title={currentUser.username} className={styles.header__user}>
          <div className={styles.avatar} onClick={() => setTooltip(true)}>
            <Avatar user={currentUser} />
          </div>
          <Tooltip
            show={showTooltip}
            placement="bottom-right"
            onClose={() => setTooltip(false)}
            className={styles.userMenu}
          >
            <>
              <h2 className={styles.userMenu__header}>{currentUser.username}</h2>
              <div className={styles.userMenu__buttons}>
                <button
                  className="button button--small button--green button--no-shadow"
                  onClick={goToProfile}
                >
                  Profile
                </button>
                <button
                  className="button button--small button--yellow button--no-shadow"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </div>
            </>
          </Tooltip>
        </div>
      ) : null}
      {window.location.pathname === "/profile" && currentUser ? (
        <button className={`button button--link ${styles.loginLink}`} onClick={logOutUser}>
          Log Out
        </button>
      ) : null}
    </header>
  );
}

export default withRouter(Header);
