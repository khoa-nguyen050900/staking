import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import actionTypes from "../constants/actionTypes";

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  rpc: {
    5777: "HTTP://127.0.0.1:7545",
  },
});

export const connectWeb3 =
  (web3, contractEth, contractBsc, contractStakingETH, contractStakingBSC) =>
  (dispatch) => {
    try {
      dispatch({
        type: actionTypes.CONNECT_WALLET,
        web3,
        contractEth,
        contractBsc,
        contractStakingETH,
        contractStakingBSC,
      });
    } catch {
      console.log("error");
    }
  };

export const connectMetaMask = (account, value) => async (dispatch) => {
  try {
    let balances = parseFloat(value / Math.pow(10, 18)).toFixed(4);
    dispatch({ type: actionTypes.CONNECT_METAMASK, account, balances });
  } catch {
    console.log("error");
  }
};
export const changeNetwork = (name) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CHANGE_NETWORK, name });
  } catch {
    console.log("error");
  }
};

export const reRenderMetamask = (account) => (dispatch) => {
  try {
    console.log("account", account);
    dispatch({ type: actionTypes.RE_RENDER_METAMASK, account });
  } catch {
    console.log("error");
  }
};

export const connectWallet = () => async (dispatch) => {
  try {
    await provider.enable();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    dispatch({
      type: actionTypes.CONNECT_TO_CONNECT_WALLET,
      account: accounts[0],
    });
  } catch {
    console.log("error");
  }
};

export const logoutMetaMask = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DISCONNECT_METAMASK });
  } catch {
    console.log("error");
  }
};
export const logoutConnectWallet = () => async (dispatch) => {
  try {
    await provider.disconnect();
    dispatch({ type: actionTypes.DISCONNECT_WALLET });
  } catch {
    console.log("error");
  }
};

export const getSocialfi = (list) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_SOCIALFI, list });
  } catch {
    console.log("error");
  }
};

export const getListMarket = (market) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_LIST_MARKET, market });
  } catch {
    console.log("error");
  }
};
