import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player/lazy";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Modal from "./Modal";
import { useMoralisWeb3Api } from "react-moralis";

const StyledMyNFT = styled.div`
  .meta__modal {
    max-width: 480px;
    max-height: 600px;
    border-radius: 12px;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    display: flex;
    flex-direction: column;
    padding: 18px;
    background-color: ${(props) => props.theme.bgItem};
    color: ${(props) => props.theme.textBody};
    z-index: 99999999999;
    position: fixed;
    right: calc(50% - 233px);
    top: calc(20% - 60px);
    min-width: 480px;
    .meta__modal-header {
      justify-content: space-between;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
      .header-icon {
        color: ${(props) => props.theme.borderBtn};
        font-size: 32px;
        cursor: pointer;
      }
      .header-icon:hover {
        opacity: 0.8;
      }
    }
    .listDino {
      position: relative;
      height: 300px;
      width: 300px;
      position: relative;
      margin: 0 auto;
    }
    .listDino-video {
      height: 100%;
      width: 100%;
    }
    #video {
      width: 100% !important;
    }
    .fragment-2 {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      .fragment-item {
        width: 50%;
        height: 50%;
        position: relative;
        border: 1px solid black;
      }
      .current-item {
        border: 2px solid ${(props) => props.theme.borderBtn};
      }
      .notOwner {
        opacity: 0.2;
      }
    }
    .fragment-3 {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      .fragment-item {
        width: 33%;
        height: 33%;
        position: relative;
        border: 1px solid black;
      }
      .current-item {
        border: 2px solid ${(props) => props.theme.borderBtn};
      }
      .notOwner {
        opacity: 0.2;
      }
    }
    .fragment-4 {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      .fragment-item {
        width: 25%;
        height: 25%;
        position: relative;
        border: 1px solid black;
      }
      .current-item {
        border: 2px solid ${(props) => props.theme.borderBtn};
      }
      .notOwner {
        opacity: 0.2;
      }
    }
    .meta__modal-body-stake {
      padding-top: 12px;
      color: ${(props) => props.theme.textBody};
      font-size: 18px;
      span {
        margin-right: 6px;
        font-weight: bold;
      }
      .body-stake-header {
        font-weight: bold;
        margin-bottom: 12px;
      }
      .input_price {
        width: 236px;
        height: 46px;
        border-radius: 12px;
        font-size: 18px;
        color: black;
      }
      #select-profession {
        color: black;
        padding: 6px 36px 6px 12px;
        border-radius: 12px;
        font-size: 18px;
        line-height: 28px;
      }
      .btn-claim,
      .btn-fragment {
        color: black;
        border: 2px solid ${(props) => props.theme.borderBtn};
        background: ${(props) => props.theme.borderBtn};
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 25px;
        margin: 12px auto 6px auto;
        max-width: 176px;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
      }
      .modal__des {
        font-size: 18px;
        margin-bottom: 36px;
      }

      .btn-fragment {
        background: ${(props) => props.theme.bgBodyTop};
        color: ${(props) => props.theme.textSecond};
      }
      .btn-fragment-active {
        color: black;
        background: ${(props) => props.theme.borderBtn};
      }
    }
  }
  .mynft {
    width: 100%;
    background-color: ${(props) => props.theme.bgHeader};
    min-height: 100vh;
    overflow: hidden;
    color: ${(props) => props.theme.textBtn};
    .mynft__header {
      background-color: ${(props) => props.theme.bgBodyTop};
      padding: 16px 64px;
      border: 1px solid ${(props) => props.theme.bgBodyTop};
      .mynft__header-title {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 16px;
        color: ${(props) => props.theme.textBody};
      }

      .mynft__btn {
        color: ${(props) => props.theme.te};
        font-size: 18px;
        font-family: 600;
        height: 41px;
        justify-content: space-between;
        margin-bottom: 24px;
        .mynft__btn-filter {
          background-color: ${(props) => props.theme.bgHeaderHover};
          padding: 0 0;
          display: flex;
          border-radius: 24px;

          justify-content: space-between;
          .btn {
            padding: 6px 24px;
            background-color: transparent;
            border-radius: 24px;
            cursor: pointer;
          }
          .active {
            background: ${(props) => props.theme.borderBtn};
            color: ${(props) => props.theme.textBody};
          }
        }
        .mynft__btn-right {
          z-index: 0;
          .select__filter {
          }
          .input__search {
            color: black;
          }
          /* ===== Horizontal Rule ===== */

          #select-profession {
            color: black;
            padding: 6px 36px 6px 12px;
            border-radius: 12px;
            font-size: 18px;
            line-height: 28px;
            .option {
              padding: 6px;
            }
            .option:hover {
              box-shadow: 0 0 10px 100px #000 inset;
            }
          }

          .mynft::before {
            position: absolute;
            content: "\f063";
            font-size: 2em;
            color: #fff;
            right: 20px;
            top: calc(50% - 0.5em);
          }

          .myprops.nft.active::before {
            transform: rotateX(-180deg);
          }

          .mynft__placeholder {
            display: block;
            font-size: 2.3em;
            color: #838e95;
            padding: 0.2em 0.5em;
            text-align: left;
            pointer-events: none;
            user-select: none;
            visibility: visible;
          }

          .mynft.active .mynft__placeholder {
            visibility: hidden;
          }

          .mynft__placeholder::before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.2em 0.5em;
            content: attr(data-placeholder);
            visibility: hidden;
          }

          .mynft.active .mynft__placeholder::before {
            visibility: visible;
          }

          .mynft__box {
            position: absolute;
            top: calc(100% + 4px);
            left: -4px;
            display: none;
            list-style-type: none;
            text-align: left;
            font-size: 1em;
            background-color: #fff;
            box-sizing: border-box;
          }

          .mynft.active .mynft__box {
            display: block;
            animation: fadeInUp 500ms;
          }

          .mynft__box__options {
            display: list-item;
            font-size: 1.5em;
            color: #838e95;
            padding: 0.5em 1em;
            user-select: none;
          }

          .mynft__box__options::after {
            content: "\f00c";
            font-size: 0.5em;
            margin-left: 5px;
            display: none;
          }

          .mynft__box__options.selected::after {
            display: inline;
          }

          .mynft__box__options:hover {
            background-color: #ebedef;
          }

          /* ----- Select Box Black Panther ----- */
          .mynft {
            border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          }

          .mynft__btn-right-body {
            z-index: 3;
            margin-right: 12px;
            word-wrap: break-word;
          }

          .mynft__btn-right-search {
            width: 136px;
            border-radius: 12px;
            color: black;
          }

          /* ----- Select Box Superman ----- */

          /* ===== Keyframes ===== */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 20px, 0);
            }

            to {
              opacity: 1;
              transform: none;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }

            to {
              opacity: 0;
            }
          }
          .mynft__btn-right-search {
            border-radius: 12px;
            width: 160px;
            font-size: 14px;
          }
        }
      }
    }
    .nftmake__body-mid {
      margin: 24px 76px;
      .nftmake__body-mid-items {
        .nftmake__body-mid-item {
          background-color: ${(props) => props.theme.bgBodyTop};
          border-radius: 8px;
          box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
          cursor: pointer;
          position: relative;
          padding: 16px;
          color: ${(props) => props.theme.textBody};
          max-width: 420px;
          .listDino {
            color: ${(props) => props.theme.textBody};

            img {
              max-width: 100%;
              max-height: 100%;
            }
            div:nth-child(1) {
              width: 100% !important;
              height: 100% !important;
            }
            .nftmake__body-mid-name {
              color: white;
              font-size: 18px;
              img {
                width: 24px;
                height: 24px;
                margin: auto 0;
                margin-right: 12px;
              }
              p {
                padding-top: 12px;
              }
              span {
                color: ${(props) => props.theme.borderBtn};
              }
            }
            .icon-checked {
              position: absolute;
              top: 8px;
              right: 8px;
              color: ${(props) => props.theme.lightGreen};
              display: none;
            }
          }
          .listDino__body {
            .link-opensea {
              text-align: center;
              width: 100%;
              font-size: 14px;
            }
            .btn-buy {
              color: white;
              border: 2px solid ${(props) => props.theme.borderBtn};
              background: ${(props) => props.theme.borderBtn};
              padding: 3px 24px;
              cursor: pointer;
              border-radius: 25px;
              height: 36px;
              line-height: 28px;
              margin: 12px 12px 0 12px;
              font-weight: 600;
              font-size: 14px;
              position: relative;
            }
            .btn-fragment {
              color: white;
              border: 2px solid ${(props) => props.theme.borderBtn};
              background: ${(props) => props.theme.borderBtn};
              padding: 3px 24px;
              cursor: pointer;
              border-radius: 25px;
              height: 36px;
              line-height: 28px;
              margin: 12px 12px 0 12px;
              font-weight: 600;
              font-size: 18px;
              position: relative;
              background: skyblue;
            }
            b {
              margin-bottom: 6px;
            }
            .icon-img {
              width: 28px;
              height: 28px;
              margin-left: 12px;
            }
          }
        }
        .no_data {
          width: 100%;
          grid-column: span 12 / span 12;
          margin: 0 auto;
          color: ${(props) => props.theme.textBody};
          text-align: center;
          img {
            width: 128px;
            margin: auto;
          }
        }
        .active {
          .icon-checked {
            display: block;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .meta__modal {
      top: 20%;
    }
    .mynft {
      .mynft__header {
        .mynft__btn {
          height: 120px;
          flex-wrap: wrap;
          .mynft__btn-filter {
            margin-bottom: 12px;
          }
          .mynft__btn-right {
            flex-wrap: wrap;
            .mynft__btn-right-body {
              margin-bottom: 6px;
            }
            .mynft__btn-right-search {
              height: 41px;
            }
          }
        }
      }
      .nftmake__body-mid {
        margin: 12px auto;
        .nftmake__body-mid-items {
          padding: 0 64px;
          .nftmake__body-mid-item {
            .listDino__body {
              padding: 16px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    .mynft {
      .mynft__header {
        padding: 12px;

        .mynft__btn {
          height: 168px;
          flex-wrap: wrap;
          .mynft__btn-filter {
            margin-bottom: 12px;
          }
          .mynft__btn-right {
            flex-wrap: wrap;
            #select-profession {
              padding: 6px 28px 6px 12px;
            }
            .mynft__btn-right-search {
              height: 41px;
            }
            .mynft__btn-right-body {
              margin-bottom: 6px;
            }
          }
        }
      }
      .nftmake__body-mid {
        margin: 12px auto;
        .nftmake__body-mid-items {
          padding: 0 24px;
        }
      }
    }
  }
`;

export default function MyNFT() {
  const Web3Api = useMoralisWeb3Api();
  const [sort, setSort] = useState("Socialfi");
  const sortDefi = ["All", "Dino", "Meat", "Mystery Box"];
  const sortCoin = ["USDT", "BNB", "DSG", "BUSD"];
  const sortSocialfi = ["All", "Avatar", "Dravings boads"];
  const [sortCategory, setSortCategory] = useState("All");
  const [sortByCoin, setSortByCoin] = useState("All");
  const [Defi, setDefi] = useState([]);
  const [arrObjCollection, setArrObjCollection] = useState([]);
  const [viewFragment, setViewFragment] = useState(false);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [socialfiAccount, setSocialfiAccount] = useState([]);
  const account = useSelector((state) => state.wallet.account);
  const contractEth = useSelector((state) => state.wallet.contractEth);
  const contractBsc = useSelector((state) => state.wallet.contractBsc);
  const network = useSelector((state) => state.wallet.network);

  const [showModal, setShowModal] = useState(false);
  const [nft, setNFT] = useState(null);
  const [isFragment, setIsFragment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let chain = network === "rinkeby" ? "bsc testnet" : "rinkeby";
      const options = {
        chain,
        address: account,
      };
      const polygonNFTs = await Web3Api.account.getNFTs(options);
      console.log("polygonNFTs", polygonNFTs.result);
      let list = [];
      let listNext = [];

      if (network === "rinkeby") {
        list = await contractEth.methods.getStechNFTByOwner(account).call();
      } else {
        list = await contractBsc.methods.getStechNFTByOwner(account).call();
      }
      console.log("list", list);
      setSocialfiAccount([]);
      await list.map(async (item) => {
        await axios
          .get(item.uri)
          .then(function (response) {
            if (response.data.animation_url) {
              setSocialfiAccount((socialfiAccount) => [
                ...socialfiAccount,
                {
                  name: item.name,
                  index: item.index,
                  owner: item.owner,
                  ownerCreate: item.ownerCreate,
                  price: item.price,
                  typeCoin: item.typeCoin,
                  listing: item.listing,
                  idOwner: item.idOwner,
                  fragments: item.fragments,
                  indexFragment: item.indexFragment,
                  isFragment: true,
                  video: response.data.animation_url,
                  fragmented: item.fragmented,
                },
              ]);
            } else {
              // handle success
              if (item.index !== item.idOwner) {
                setSocialfiAccount((socialfiAccount) => [
                  ...socialfiAccount,
                  {
                    name: item.name,
                    index: item.index,
                    owner: item.owner,
                    ownerCreate: item.ownerCreate,
                    price: item.price,
                    typeCoin: item.typeCoin,
                    listing: item.listing,
                    idOwner: item.idOwner,
                    fragments: item.fragments,
                    indexFragment: item.indexFragment,
                    isFragment: true,
                    image: response.data.image,
                    fragmented: item.fragmented,
                  },
                ]);
              } else {
                setSocialfiAccount((socialfiAccount) => [
                  ...socialfiAccount,
                  {
                    name: item.name,
                    index: item.index,
                    owner: item.owner,
                    ownerCreate: item.ownerCreate,
                    price: item.price,
                    typeCoin: item.typeCoin,
                    listing: item.listing,
                    idOwner: item.idOwner,
                    fragments: item.fragments,
                    indexFragment: item.indexFragment,
                    isFragment: false,
                    image: response.data.image,
                    fragmented: item.fragmented,
                  },
                ]);
              }
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      });
      polygonNFTs.result.map(async (item) => {
        item.token_uri.length > 30 &&
          (await axios
            .get(item.token_uri)
            .then(function (response) {
              if (!response.name) {
                console.log("item", response, item);
                setSocialfiAccount((socialfiAccount) => [
                  ...socialfiAccount,
                  {
                    name: network === "rinkeby" ? "NFT BSC" : "NFT RINKEBY",
                    index: item.token_id,
                    owner: false,
                    ownerCreate: item.ownerCreate,
                    price: item.price,
                    typeCoin: item.typeCoin,
                    listing: item.listing,
                    idOwner: item.idOwner,
                    fragments: item.fragments,
                    indexFragment: item.indexFragment,
                    isFragment: false,
                    image: response.data.image,
                    fragmented: item.fragmented,
                  },
                ]);
                console.log(response);
              }
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            }));
      });
    }
    if (account) {
      return fetchData();
    } else {
      setSocialfiAccount([]);
    }
  }, [account, contractBsc.methods, contractEth.methods, network]);

  const handleSort = (e) => {
    setSortCategory(e.target.value);
  };
  const handleByCoin = (e) => {
    setSortByCoin(e.target.value);
  };

  const openSeaCollection = () => {
    window.open(
      `https://testnets.opensea.io/collection/stechnft-ftgx7xhaq6`,
      "_blank"
    );
  };
  const openSea = (id) => {
    window.open(
      `https://testnets.opensea.io/assets/0x212f453b8e6684b9b9e6eeaaf9b9085c88f6ea2b/${id}`,
      "_blank"
    );
  };

  const openModalFragment = async (item) => {
    setNFT(item);
    setArrObjCollection([]);
    let result = await contractEth.methods
      .getNFTtoCollection(+item.index)
      .call();
    await result.map(async (item) => {
      await axios
        .get(item.uri)
        .then(function (response) {
          // handle success
          setArrObjCollection((arrObjCollection) => [
            ...arrObjCollection,
            {
              index: item.index,
              owner: item.owner,
              image: response.data.image,
            },
          ]);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    });
    setViewFragment(true);
    setIsFragment(false);
    setShowModal(true);
  };

  const sortListByCoin = () => {
    console.log("socialfiAccount", socialfiAccount);
    // Sort dựa vào danh sách, loại trong danh sách và kiểu coin
    if (sort === "Defi") {
      if (Defi.length > 0) {
        // eslint-disable-next-line array-callback-return
        Defi.map((item) => {
          if (sortCategory === "All" && sortByCoin === "All") {
            return (
              <div className={"nftmake__body-mid-item  "} key={item.index}>
                <div
                  className="listDino"
                  style={{ position: "relative", height: "400px" }}
                >
                  <div>
                    <img
                      src={item.itemBody}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "2",
                      }}
                    />

                    <img
                      src={item.itemBg}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "1",
                      }}
                    />
                    <img
                      src={item.itemClothes}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />
                    <img
                      src={item.itemEye}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />
                    <img
                      src={item.itemHead}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />

                    <img
                      src={item.itemMouth}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />
                    <img
                      src={item.itemStuff}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />
                  </div>
                </div>
                <div className="listDino__body">
                  <div className="font-bold text-xl mb-2">{item.name}</div>
                  <p>
                    <b>Mã định danh :</b>
                  </p>
                  <p className="text-base flex justify-between">
                    <p className="break-words">
                      {`${item.hash.slice(0, 6)}...${item.hash.slice(
                        item.hash.length - 6,
                        item.hash.length
                      )}`}
                    </p>
                    <p className="btn-buy">Bán</p>
                  </p>
                </div>
              </div>
            );
          }
          if (sortCategory !== "All" && sortByCoin === "All") {
            if (item.category === sortCategory) {
              return (
                <div className={"nftmake__body-mid-item "} key={item.index}>
                  <div
                    className="listDino"
                    style={{ position: "relative", height: "400px" }}
                  >
                    <div>
                      <img
                        src={item.itemBody}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "2",
                        }}
                      />

                      <img
                        src={item.itemBg}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "1",
                        }}
                      />
                      <img
                        src={item.itemClothes}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemEye}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemHead}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemMouth}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemStuff}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                    </div>
                  </div>
                  <div className="listDino__body">
                    <div className="font-bold text-xl mb-2">{item.name}</div>
                    <p>
                      <b>Mã định danh :</b>
                    </p>
                    <p className="text-base flex justify-between">
                      <p className="break-words">
                        {`${item.hash.slice(0, 6)}...${item.hash.slice(
                          item.hash.length - 6,
                          item.hash.length
                        )}`}
                      </p>
                      <p className="btn-buy">Bán</p>
                    </p>
                  </div>
                </div>
              );
            }
          }
          if (sortCategory === "All" && sortByCoin !== "All") {
            if (sortByCoin === item.coin) {
              return (
                <div className={"nftmake__body-mid-item "} key={item.index}>
                  <div
                    className="listDino"
                    style={{ position: "relative", height: "400px" }}
                  >
                    <div>
                      <img
                        src={item.itemBody}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "2",
                        }}
                      />

                      <img
                        src={item.itemBg}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "1",
                        }}
                      />
                      <img
                        src={item.itemClothes}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemEye}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemHead}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemMouth}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemStuff}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                    </div>
                  </div>
                  <div className="listDino__body">
                    <div className="font-bold text-xl mb-2">{item.name}</div>
                    <p>
                      <b>Mã định danh :</b>
                    </p>
                    <p className="text-base flex justify-between">
                      <p className="break-words">
                        {`${item.hash.slice(0, 6)}...${item.hash.slice(
                          item.hash.length - 6,
                          item.hash.length
                        )}`}
                      </p>
                      <p className="btn-buy">Bán</p>
                    </p>
                  </div>
                </div>
              );
            }
          } else {
            if (item.category === sortCategory) {
              if (sortByCoin === item.coin) {
                return (
                  <div className={"nftmake__body-mid-item "} key={item.index}>
                    <div
                      className="listDino"
                      style={{ position: "relative", height: "400px" }}
                    >
                      <div>
                        <img
                          src={item.itemBody}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "2",
                          }}
                        />

                        <img
                          src={item.itemBg}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "1",
                          }}
                        />
                        <img
                          src={item.itemClothes}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemEye}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemHead}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemMouth}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemStuff}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                      </div>
                    </div>
                    <div className="listDino__body">
                      <div className="font-bold text-xl mb-2">{item.name}</div>
                      <p>
                        <b>Mã định danh :</b>
                      </p>
                      <p className="text-base flex justify-between">
                        <p className="break-words">
                          {`${item.hash.slice(0, 6)}...${item.hash.slice(
                            item.hash.length - 6,
                            item.hash.length
                          )}`}
                        </p>
                        <p className="btn-buy">Bán</p>
                      </p>
                    </div>
                  </div>
                );
              }
            }
          }
        });
      } else {
        return (
          <div className="no_data">
            <img src="https://dsgmetaverse.com/images/no-data.png" alt="" />
            <p>No Data</p>
          </div>
        );
      }
    }
    if (sort === "Socialfi") {
      if (socialfiAccount.length > 0) {
        return socialfiAccount.map(function (item) {
          if (item.video) {
            return (
              <div className={" nftmake__body-mid-item "} key={item.index}>
                <div
                  className="listDino"
                  style={{ position: "relative", height: "400px" }}
                >
                  <ReactPlayer
                    url={item.video}
                    controls={true}
                    onClick={() => {
                      setNFT(item);
                      setShowModal(true);
                      setIsFragment(false);
                      setViewFragment(false);
                    }}
                  />
                </div>
                <div className="listDino__body">
                  <div className="font-bold text-xl mb-2">{item.name}</div>

                  <div>
                    <p className="mr-2 font-medium">
                      Check LINK my COLLECTION:
                    </p>
                    <div className="flex ">
                      <p className="link-opensea" onClick={openSeaCollection}>
                        https://testnets.opensea.io/STECHNFT
                      </p>
                    </div>
                  </div>
                  {item.isFragment ? (
                    <p
                      onClick={() => openModalFragment(item)}
                      className="btn-fragment text-center"
                    >
                      Mảnh
                    </p>
                  ) : (
                    <div>
                      <p className="mr-2 font-medium">Check LINK my NFT:</p>
                      <div className="flex ">
                        <p
                          className="link-opensea"
                          onClick={() => openSea(item.index)}
                        >
                          https://testnets.opensea.io/{item.name}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-around">
                    <p
                      className="btn-buy text-center"
                      onClick={() => {
                        setNFT(item);
                        setShowModal(true);
                        setIsFragment(false);
                        setViewFragment(false);
                      }}
                    >
                      {item.listing ? "Đang bán..." : "Bán"}
                    </p>
                    <p
                      className="btn-buy text-center"
                      onClick={() => {
                        setNFT(item);
                        setViewFragment(false);
                        setShowModal(true);
                        setIsFragment(true);
                      }}
                    >
                      Phân mảnh
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            if (sortCategory === "All" && sortByCoin === "All") {
              return (
                <div className={" nftmake__body-mid-item "} key={item.index}>
                  <div
                    className="listDino"
                    style={{ position: "relative", height: "400px" }}
                  >
                    <div>
                      <img
                        src={item.image}
                        alt={item.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "2",
                        }}
                        onClick={() => {
                          setNFT(item);
                          setShowModal(true);
                          setIsFragment(false);
                          setViewFragment(false);
                        }}
                      />
                    </div>
                  </div>
                  <div className="listDino__body">
                    <div className="font-bold text-xl mb-2">{item.name}</div>

                    <div>
                      <p className="mr-2 font-medium">
                        Check LINK my COLLECTION:
                      </p>
                      <div className="flex ">
                        <p className="link-opensea" onClick={openSeaCollection}>
                          https://testnets.opensea.io/STECHNFT
                        </p>
                      </div>
                    </div>
                    {item.isFragment ? (
                      <p
                        onClick={() => openModalFragment(item)}
                        className="btn-fragment text-center"
                      >
                        Mảnh
                      </p>
                    ) : (
                      <div>
                        <p className="mr-2 font-medium">Check LINK my NFT:</p>
                        <div className="flex ">
                          <p
                            className="link-opensea"
                            onClick={() => openSea(item.index)}
                          >
                            https://testnets.opensea.io/{item.name}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-around">
                      <p
                        className="btn-buy text-center"
                        onClick={() => {
                          setNFT(item);
                          setShowModal(true);
                          setIsFragment(false);
                          setViewFragment(false);
                        }}
                      >
                        {item.listing ? "Đang bán..." : "Bán"}
                      </p>
                      <p
                        className="btn-buy text-center"
                        onClick={() => {
                          setNFT(item);
                          setViewFragment(false);
                          setShowModal(true);
                          setIsFragment(true);
                        }}
                      >
                        Phân mảnh
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            if (sortCategory !== "All" && sortByCoin === "All") {
              if (item.typeCoin === sortCategory) {
                return (
                  <div className={"nftmake__body-mid-item "} key={item.index}>
                    <div
                      className="listDino "
                      style={{ position: "relative", height: "400px" }}
                    >
                      <img
                        src={item.itemBody}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "2",
                        }}
                      />

                      <img
                        src={item.itemBg}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "1",
                        }}
                      />
                      <img
                        src={item.itemClothes}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemEye}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemHead}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemMouth}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                      <img
                        src={item.itemStuff}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                      />
                    </div>
                    <div className="pt-6 pr-6 pl-6 ">
                      <div className="font-bold text-xl mb-2">{item.name}</div>
                      <p className="text-gray-700 text-base">
                        <h3>
                          <b>Tấn công :</b> {item.attack}
                        </h3>
                        <h3>
                          <b>Phòng thủ :</b> {item.defense}
                        </h3>
                        <h3>
                          <b>Độ hiếm :</b> {item.rare}
                        </h3>
                        <h3>
                          <b>Chuỗi gen :</b> {item.dna}
                        </h3>
                        <h3>
                          <p>
                            <b>Mã định danh :</b>
                          </p>
                          <p className="break-words">{item.hash}</p>
                        </h3>
                      </p>
                    </div>
                    <div className="px-6 pt-4 pb-2 text-center">
                      <p>Địa chỉ người nhận:</p>
                      <input
                        type="text"
                        className=" w-full py-2 px-4 rounded mt-2 mb-2"
                        name="address"
                        onChange={(e) => {}}
                      />
                      <button className=" bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Chuyển
                      </button>
                    </div>
                  </div>
                );
              }
            }
            if (sortCategory === "All" && sortByCoin !== "All") {
              if (sortByCoin === item.typeCoin) {
                return (
                  <div className={"nftmake__body-mid-item "} key={item.index}>
                    <div
                      className="listDino"
                      style={{ position: "relative", height: "400px" }}
                    >
                      <div>
                        <img
                          src={item.itemBody}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "2",
                          }}
                        />

                        <img
                          src={item.itemBg}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "1",
                          }}
                        />
                        <img
                          src={item.itemClothes}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemEye}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemHead}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemMouth}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                        <img
                          src={item.itemStuff}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: "3",
                          }}
                        />
                      </div>
                    </div>
                    <div className="listDino__body">
                      <div className="font-bold text-xl mb-2">{item.name}</div>
                      <p>
                        <b>Mã định danh :</b>
                      </p>
                      <p className="text-base flex justify-between">
                        <p className="break-words">
                          {`${item.hash.slice(0, 6)}...${item.hash.slice(
                            item.hash.length - 6,
                            item.hash.length
                          )}`}
                        </p>
                        <p className="btn-buy">Bán</p>
                      </p>
                    </div>
                  </div>
                );
              }
            } else {
              if (item.category === sortCategory) {
                if (sortByCoin === item.coin) {
                  return (
                    <div
                      className={
                        "nftmake__body-mid-item  md:col-span-6   md:col-span-6  xl:col-span-4"
                      }
                      key={item.index}
                    >
                      <div
                        className="listDino"
                        style={{ position: "relative", height: "400px" }}
                      >
                        <div>
                          <img
                            src={item.itemBody}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "2",
                            }}
                          />

                          <img
                            src={item.itemBg}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "1",
                            }}
                          />
                          <img
                            src={item.itemClothes}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "3",
                            }}
                          />
                          <img
                            src={item.itemEye}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "3",
                            }}
                          />
                          <img
                            src={item.itemHead}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "3",
                            }}
                          />
                          <img
                            src={item.itemMouth}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "3",
                            }}
                          />
                          <img
                            src={item.itemStuff}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: "3",
                            }}
                          />
                        </div>
                      </div>
                      <div className="listDino__body">
                        <div className="font-bold text-xl mb-2">
                          {item.name}
                        </div>
                        <p>
                          <b>Mã định danh :</b>
                        </p>
                        <p className="text-base flex justify-between">
                          <p className="break-words">
                            {`${item.hash.slice(0, 6)}...${item.hash.slice(
                              item.hash.length - 6,
                              item.hash.length
                            )}`}
                          </p>
                          <p className="btn-buy">Bán</p>
                        </p>
                      </div>
                    </div>
                  );
                }
              }
            }
          }
        });
      } else {
        return (
          <div className="no_data">
            <img src="https://dsgmetaverse.com/images/no-data.png" alt="" />
            <p>No Data</p>
          </div>
        );
      }
    }
  };

  return (
    <StyledMyNFT>
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          nft={nft}
          sortCoin={sortCoin}
          contractEth={contractEth}
          account={account}
          dispatch={dispatch}
          isFragment={isFragment}
          setIsFragment={setIsFragment}
          arrObjCollection={arrObjCollection}
          viewFragment={viewFragment}
        />
      )}

      <div className="mynft">
        <div className="mynft__header">
          <h1 className="mynft__header-title">My NFT</h1>

          <div className="mynft__btn flex">
            <div className="mynft__btn-filter">
              <span
                className={sort === "Socialfi" ? "btn active" : "btn"}
                onClick={() => setSort("Socialfi")}
              >
                Socialfi
              </span>
              <span
                className={sort === "Defi" ? "btn active" : "btn"}
                onClick={() => setSort("Defi")}
              >
                Defi
              </span>
              <span
                className={sort === "Gamefi" ? "btn active" : "btn"}
                onClick={() => {
                  toast("🦄 Comming soon!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }}
              >
                Gamefi
              </span>
            </div>
            <div className="mynft__btn-right flex">
              <div className=" mynft__btn-right-body">
                <select
                  name="select-profession"
                  id="select-profession"
                  value={sortCategory}
                  onChange={handleSort}
                >
                  {sort === "Defi"
                    ? sortDefi.map((item) => {
                        return (
                          <option className="option" value={item} key={item}>
                            {item}
                          </option>
                        );
                      })
                    : sortSocialfi.map((item) => {
                        return (
                          <option className="option" value={item} key={item}>
                            {item}
                          </option>
                        );
                      })}
                </select>
              </div>
              <div className=" mynft__btn-right-body">
                <select
                  name="select-profession"
                  id="select-profession"
                  value={sortByCoin}
                  onChange={handleByCoin}
                >
                  {sortCoin.map((item) => {
                    return (
                      <option className="option" value={item} key={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className=" mynft__btn-right-body">
                <select name="select-profession" id="select-profession">
                  <option className="option" value="hacker">
                    Time: Low to Hight
                  </option>
                  <option className="option" value="gamer">
                    Price: Hight to Low
                  </option>
                  <option className="option" value="developer">
                    Price: Low to Hight
                  </option>
                  <option className="option" value="gamer">
                    Level: Hight to Low
                  </option>
                  <option className="option" value="developer">
                    Level: Low to Hight
                  </option>
                  <option className="option" value="gamer">
                    Power: Hight to Low
                  </option>
                  <option className="option" value="developer">
                    Power: Low to Hight
                  </option>
                </select>
              </div>
              <input
                type="text"
                className="mynft__btn-right-search"
                placeholder="Search ID, Seller"
              />
            </div>
          </div>
        </div>
        <div className="nftmake__body-mid  ">
          <div className="nftmake__body-mid-items grid xl:grid-cols-3  lg:grid-cols-2 sm:grid-cols-1 gap-3">
            {sortListByCoin()}
          </div>
        </div>
      </div>
    </StyledMyNFT>
  );
}
