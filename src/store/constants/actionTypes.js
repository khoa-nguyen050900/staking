const actionTypes = Object.freeze({
  // Home
  MODAL: "CHANGE_STATUS_MODAL",
  CHANGE_BACKGROUND: "CHANGE_BACKGROUND",
  CHANGE_STATUS_MENU: "CHANGE_STATUS_MENU",
  GET_DETAIL: "GET_DETAIL",
  HANDEL_CLICK_MODAL: "HANDEL_CLICK_MODAL",
  HANDEL_CLICK_SETTING: "HANDEL_CLICK_SETTING",

  // Wallet
  CONNECT_WALLET: "CONNECT_WALLET",
  CONNECT_METAMASK: "CONNECT_METAMASK",
  RE_RENDER_METAMASK: "RE_RENDER_METAMASK",
  CONNECT_TO_CONNECT_WALLET: "CONNECT_TO_CONNECT_WALLET",
  DISCONNECT_METAMASK: "DISCONNECT_METAMASK",
  DISCONNECT_WALLET: "DISCONNECT_WALLET",
  GET_SOCIALFI: "GET_SOCIALFI",
  GET_LIST_MARKET: " GET_LIST_MARKET",
  CHANGE_NETWORK: "CHANGE_NETWORK",
  ITEM_COIN_STAKE: "NAME_COIN_STAKE",

  //  ADDRESS CONTRACT
  ADDRESS_STECHNFT_ETH: "0x212F453B8E6684B9b9e6eeAAf9b9085C88f6Ea2b",
  ADDRESS_STECHNFT_BSC: "0x8562bc166DFBBe868B2ca0e25CC86765Ec81382c",

  ADDRESS_STAKING_ETH: "0xF768c6196C242a965BB1Af0696de75C5d946079F",
  ADDRESS_STAKING_BSC: "0x9EFE2cc9F604e1572265a73DF5978Aad8c4Be0BC",
});

export default actionTypes;
