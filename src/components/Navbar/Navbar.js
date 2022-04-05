import { memo, useEffect, useState } from "react";
import {
  AiOutlineMenu, AiOutlineMenuUnfold,
  AiOutlineQuestionCircle
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { changeStatusMenu } from "../../store/actions/homeAction";
import NavbarRight from "./NavbarRight";

const StyledNavbarStyle = styled.div`
.navbar {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: rgb(51 51 51 / 40%) 0px 0px 10px 0px;
  .support {
    position: fixed;
    display: flex;
    bottom: 20px;
    right: 20px;
    margin: auto;
    background-color: ${(props) => props.theme.borderBtn};
    font-size: 18px;
    font-weight: 600;
    padding: 12px 18px;
    border-radius: 25px;
    color: black;
  }
  .navbar__pc .navbar__header {
  }
  .navbar__pc {
    z-index: 10;
    width: 100%;

    .navbar__header {
      height: 76px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* color: white; */
      /* width: 100%; */
      padding: 0 24px 0 12px;
      background-color: ${(props) => props.theme.bgHeader};
      z-index: 10000;
      .navbar__header-left {
        width: 142px;
        justify-content: space-between;
      }
      .logo {
        margin-left: 12px;
      }
    }

    .navbar__right {
      bottom: 0;
      background: white;
      z-index: 99999;
      height: 76px;
      width: 100%;
      display: flex;
      font-size: 14px;
      background-color: transparent;
      justify-content: center;
      bottom: 0;

      .profile-link {
        margin: auto 8px;
      }

      img {
        width: 36px;
        height: 36px;
        margin: auto 0;
      }

      .navbar__right-connect {
        height: 36px;
        background: ${(props) => props.theme.bgHeader};
        line-height: 36px;
        padding: 0 0 12px 32px;
        margin: auto 12px;
        font-weight: 600;
        color: ${(props) => props.theme.textHeader};
        border-radius: 25px;
        position: relative;
        .dots {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          padding: 3px;
          background: ${(props) => props.theme.textHeader};
          margin: auto;
          position: absolute;
          left: 10px;
          bottom: 12px;
        }
        .dots::after {
          content: "";
          display: block;
          width: 6px;
          height: 6px;
          background: rgb(255, 255, 255);
          border-radius: 50%;
        }

        .right-connect__body {
          color: ${(props) => props.theme.textBtn};
          border: 2px solid ${(props) => props.theme.borderBtn};
          background: ${(props) => props.theme.bgBtn};
          padding: 6px 12px;
          /* width: 49px; */
          cursor: pointer;
          border-radius: 25px;
          margin-left: 8px;
        }
        .right-connect__body:hover {
          opacity: 0.9;
        }
      }
    }
  }
  .menu-bars {
    transform: scaleX(-1);
    margin: auto 12px;
    color: ${(props) => props.theme.textHeader};
  }
  .menu-bars:focus{
    outline: none;
  }

  .nav-menu {
    background-color: ${(props) => props.theme.bgHeader};
    width: 238px;
    height: calc(100vh - 68px);
    overflow: scroll;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 68px;
    /* animation: showNavbar linear 0.3s; */
    z-index: 1;
    position: absolute;
  }

  .nav-menu.active {
    left: 0;
    overflow-x: hidden;

    /* animation: hiddenNavbar linear 0.3s; */
  }

  .navbar-toggle {
    background-color: ${(props) => props.theme.bgHeader};
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: start;
    align-items: center;
    z-index: 0;
  }

  @keyframes showNavbar {
    from {
      height: 0;
    }

    to {
      height: calc(100vh - 68px);
    }
  }
}
@media screen and (max-width: 767px) {
  .navbar {
    z-index: 10000000;
    .navbar__right {
      .mybag {
        margin: auto 0;
      }
    }
    .navbar__pc {
      .navbar__right-connect {
        margin: 20px 0 !important;
        padding: 0 !important;
        display: none;
      }
      .navbar__left {
        color: red;
        .navbar__header {
          padding: 0 6px 0 12px;
          .navbar__header-left {
            width: 105px;
          }
          .navbar__header-right {
            .navbar__left {
              width: 0;
            }
            .navbar__right {
              width: 100%;
              img {
                display: none;
              }
              .avt-profile .text-eth,
              .dots {
                display: none;
              }
              .right-connect__body {
                padding: 0 12px;
                display: flex;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
`;
function Navbar(props) {
  const dispatch = useDispatch();
  
  console.log('props',props)
  const [size, setSize] = useState({
    x: window.innerWidth,
  });
  const updateSize = () =>
    setSize({
      x: window.innerWidth,
    });
  useEffect(() => (window.onresize = updateSize), []);

  const showSidebar = () => {
    handleStatusMenu();
  };
  const handleStatusMenu = () => {
    dispatch(changeStatusMenu());
  };

  return (
    <StyledNavbarStyle>
      <div className="navbar">
        <button className="support">
          <AiOutlineQuestionCircle
            style={{ color: "black", height: "28px", marginRight: "6px" }}
          />
          Support
        </button>
        <div className="navbar__pc">
          <div className="navbar__left">
            <div className="navbar__header flex">
              <div className="navbar__header-left flex">
                <Link to="#" className="menu-bars">
                  {!props.statusMenu ? (
                    <AiOutlineMenu
                      onClick={() => showSidebar()}
                      style={{ color: `${(props) => props.theme.textHeader}` }}
                    />
                  ) : (
                    <AiOutlineMenuUnfold onClick={() => showSidebar()} />
                  )}
                </Link>

                <Link to="#" className="logo">
                  {size.x <= 1023 ? (
                    <img
                      src="https://test.dakshow.com.vn/themes/white/images/dak.png?ossn_cache=8b4828e8"
                      alt=""
                      style={{ width: "46px" }}
                    />
                  ) : (
                    <img
                      src="https://test.dakshow.com.vn/themes/white/images/dak.png?ossn_cache=8b4828e8"
                      alt=""
                      style={{ width: "60px" }}
                    />
                  )}
                </Link>
              </div>
              <div className="navbar__header-right">
                <NavbarRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledNavbarStyle>
  );
}

export default memo(Navbar);
