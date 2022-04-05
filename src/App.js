import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled, { ThemeProvider } from "styled-components";
import Web3 from "web3";
import { StechNFTAbiEth, StechNFTAbiBsc, Staking } from "./abi";
import "./App.scss";
import TimeExchange from "./components/MetaTime/TimeExchange";
import TimeStaking from "./components/MetaTime/TimeStaking";
import Mint from "./components/Mint";
import Modal from "./components/ModalConnect";
import MyNFT from "./components/MyNFT/MyNFT";
import Navbar from "./components/Navbar/Navbar";
import { NavbarLeft } from "./components/Navbar/NavbarLeft";
import CreateFragments from "./components/NFT/CreateFragments";
import CreateNFT from "./components/NFT/CreateNFT";
import DinoMoney from "./components/NFT/DinoMoney";
import NFTDetail from "./components/NFT/NFTDetail";
import NFTMarket from "./components/NFT/NFTMarket";
import PickAvatar from "./components/NFT/PickAvatar/PickAvatar";
import TradeNFT from "./components/NFT/TradeNFT";
import Profile from "./components/Profile";
import Quests from "./components/Quests";
import "./css/style.scss";
import {
  changeNetwork,
  connectMetaMask,
  connectWeb3,
  logoutMetaMask,
  reRenderMetamask,
} from "./store/actions/connectWallet";
import { handleClickModal } from "./store/actions/homeAction";
import actionTypes from "./store/constants/actionTypes";
import Test from "./Test";
import TestContract from "./TestContract";
import { useMoralis } from "react-moralis";
import axios from "axios";
import CreateStaking from "./components/MetaTime/CreateStaking";
import CreateStake from "./components/MetaTime/CreateStake";
import AddStake from "./components/MetaTime/AddStake";

//  Create WalletConnect Provider

const LightTheme = {
  // Header
  bgHeader: " white",
  textHeader: "#e1c129",
  bgHeaderItem: " #e1c129",
  bgHeaderHover: "#e1c129",
  bgMenuSecond: "white",
  textSecond: "black",

  // Body
  bgItem: "rgb(245,245,245)",
  bgItemGL: "#e1c129",
  linkColor: "#e1c129",
  textBody: "black",
  bgBodyTop: "white",
  lightGreen: "#e1c129",
  borderBtn: "#e1c129",
  bgBtn: "#e1c129",
  textBtn: "white",
  opacityTo: "rgba(255, 255, 255, 0)",
  opacityFrom: "rgba(255, 255, 255, 0.9)",
};
const DarkTheme = {
  // Header

  bgHeader: "#1b1b1b",
  textHeader: "#85858d",
  bgHeaderItem: "#242428",
  bgHeaderHover: "#434347",
  bgMenuSecond: "#2a2a2d",
  textSecond: "white",

  // Body
  bgItem: "#373739",

  bgItemGL: "#373739",
  linkColor: "#e1c129",
  textBody: "white",
  bgBodyTop: "#242428",
  lightGreen: "#e1c129",
  borderBtn: "#e1c129",
  bgBtn: "transparent",
  textBtn: "#e1c129",
  opacityTo: "rgba(36, 36, 36, 0.5)",
  opacityFrom: "rgba(36, 36, 36, 1)",
};
const themes = {
  light: LightTheme,
  dark: DarkTheme,
};

const StyledAppCss = styled.div`
  .main {
    .main__left {
      width: 238px;
      transition: width linear 0.4s;
    }
    .main__right {
      width: calc(100vw - 238px);
      padding-top: 76px;
      transition: width linear 0.4s;
    }
  }
  .main-active {
    .main__left {
      width: 56px;
      transition: width linear 0.4s;
    }
    .bg__modal {
      display: none;
    }
    .main__right {
      width: calc(100vw - 56px);
      transition: width linear 0.4s;
    }
  }
  @media screen and (max-width: 1023px) {
    .main {
      .main__left {
        width: 0;
      }
      .main__right {
        width: 100%;
        padding-top: 76px;
      }
      .bg__modal-active {
        display: block;
        width: 100%;
        position: fixed;
        height: 100%;
        background: black;
        opacity: 0.2;
        z-index: 1;
      }
    }
    .main-active {
      .main__left {
        width: 0;
      }
    }
  }

  @keyframes navbarLeft-show {
    0% {
      width: 56px;
    }
    100% {
      width: 238px;
    }
  }
  @keyframes navbarLeft-hidden {
    0% {
      width: 238px;
    }
    100% {
      width: 56px;
    }
  }
  @keyframes navbarRight-show {
    0% {
      width: calc(100vw - 238px);
    }
    100% {
      width: calc(100vw - 56px);
    }
  }
  @keyframes navbarRight-hidden {
    0% {
      width: calc(100vw - 56px);
    }
    100% {
      width: calc(100vw - 238px);
    }
  }
`;

function App() {
  const { account, Moralis, user } = useMoralis();
  const statusModal = useSelector((state) => state.home.statusModal);
  const statusMenu = useSelector((state) => state.home.statusMenu);
  const statusBackground = useSelector((state) => state.home.statusBackground);
  const statusClickModal = useSelector((state) => state.home.statusClickModal);
  const network = useSelector((state) => state.wallet.network);

  const [provider, setProvider] = useState("");

  const dispatch = useDispatch();

  const onClickModal = () => {
    dispatch(handleClickModal());
  };

  useEffect(() => {
    async function fetchData() {
      let value = await detectEthereumProvider();
      setProvider(value);
      let web3 = new Web3(value);
      const contractEth = await new web3.eth.Contract(
        StechNFTAbiEth,
        actionTypes.ADDRESS_STECHNFT_ETH
      );
      const contractBsc = await new web3.eth.Contract(
        StechNFTAbiBsc,
        actionTypes.ADDRESS_STECHNFT_BSC
      );

      const contractStakingETH = await new web3.eth.Contract(
        Staking,
        actionTypes.ADDRESS_STAKING_ETH
      );
      console.log("contractStakingETH", contractStakingETH);
      const contractStakingBSC = await new web3.eth.Contract(
        Staking,
        actionTypes.ADDRESS_STAKING_BSC
      );
      web3.eth.getAccounts(function (err, accounts) {
        if (err != null) console.error("An error occurred: " + err);
        else if (accounts.length === 0) {
          console.log("User is not logged in to MetaMask");
          dispatch(logoutMetaMask());
        } else console.log("User is logged in to MetaMask");
      });
      dispatch(
        connectWeb3(
          web3,
          contractEth,
          contractBsc,
          contractStakingETH,
          contractStakingBSC
        )
      );
    }
    fetchData();
  }, [dispatch]);

  const connectMetaMaskApp = async (currentNetwork) => {
    let user = Moralis.User.current();
    user = await Moralis.authenticate();
    console.log("user", user);
    let accounts = user.get("ethAddress");
    console.log(
      currentNetwork === "rinkeby",
      currentNetwork,
      accounts,
      "rinkeby"
    );
    if (currentNetwork === "rinkeby") {
      await axios
        .get(
          `https://deep-index.moralis.io/api/v2/${accounts}/balance?chain=rinkeby`,
          {
            headers: {
              "X-API-KEY":
                "UM6LE6sOG8KUrQ9maYP3pRgbTQ6TRcGoguzYuSCKbYdNLrssUzGWY4NaX0GvKdaQ",
              accept: "application/json",
            },
          }
        )
        .then((value) => {
          console.log("value", value);
          dispatch(connectMetaMask(accounts, value.data.balance));
        });
    } else {
      await axios
        .get(
          `https://deep-index.moralis.io/api/v2/${accounts}/balance?chain=bsc%20testnet`,
          {
            headers: {
              "X-API-KEY":
                "UM6LE6sOG8KUrQ9maYP3pRgbTQ6TRcGoguzYuSCKbYdNLrssUzGWY4NaX0GvKdaQ",
              accept: "application/json",
            },
          }
        )
        .then((value) => {
          console.log("value", value);
          dispatch(connectMetaMask(accounts, value.data.balance));
        });
    }
  };

  provider &&
    provider.on("accountsChanged", (accounts) => {
      console.log("accountsChanged", accounts);
      if (accounts.length > 0) {
        connectMetaMaskApp(network);
        dispatch(reRenderMetamask(accounts[0]));
      } else {
        dispatch(logoutMetaMask());
      }
    });

  // Subscribe to chainId change
  provider &&
    provider.on("chainChanged", (chainId) => {
      console.log("chainChanged");
      console.log(chainId, "0x4", chainId === "0x4");
      if (chainId === "0x4") {
        dispatch(changeNetwork("rinkeby"));
        connectMetaMaskApp("rinkeby");
      } else {
        dispatch(changeNetwork("bsc"));
        connectMetaMaskApp("bsc");
      }
      console.log(chainId);
    });

  // Subscribe to session disconnection
  provider &&
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
    });

  return (
    <StyledAppCss>
      <Router>
        <ThemeProvider theme={themes[statusBackground]}>
          <div className="AppcontractStakingETH">
            <Navbar />
            {statusModal && <Modal />}
            <div className={statusMenu ? "main flex" : "main main-active flex"}>
              <div className="main__left">
                <NavbarLeft />
              </div>
              <div
                className={
                  statusClickModal ? "bg__modal bg__modal-active" : "bg__modal "
                }
                onClick={onClickModal}
              ></div>
              <div className="main__right">
                <Switch>
                  <Route path={"/tradeNFT"} component={TradeNFT} />
                  <Route
                    path={"/createFragments"}
                    component={CreateFragments}
                  />
                  <Route path={"/createNFT"} component={CreateNFT} />
                  <Route path={"/profile"} component={Profile} />
                  <Route path={"/pickavatar"} component={PickAvatar} />
                  <Route path={"/dinomoney"} component={DinoMoney} />
                  <Route path={"/nftmarket"} component={NFTMarket} />
                  <Route path={"/timestaking"} component={TimeStaking} />
                  <Route path={"/timeexchange"} component={TimeExchange} />
                  <Route path={"/quests"} component={Quests} />
                  <Route path={"/mint"} component={Mint} />
                  <Route path={"/mynft"} component={MyNFT} />
                  <Route path={"/createstaking"} component={CreateStaking} />
                  <Route path={"/createstake"} component={CreateStake} />
                  <Route path={"/addstake"} component={AddStake} />

                  <Route path={"/main"} component={Test} />
                  <Route
                    path={"/nftdetail/:status/:id"}
                    component={NFTDetail}
                  />
                  <Route exact path={"/"}>
                    <TestContract statusBackground={statusBackground} />
                  </Route>
                </Switch>

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    </StyledAppCss>
  );
}

export default App;
