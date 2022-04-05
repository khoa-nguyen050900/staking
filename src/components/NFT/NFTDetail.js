import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiTransferAlt } from "react-icons/bi";
import { GiNewBorn } from "react-icons/gi";
import { useMoralisWeb3Api } from "react-moralis";
import ReactPlayer from "react-player/lazy";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import ChartJS from "./ChartJS";

const StyledNFTDetail = styled.div`
  .bg__nftdetail {
    background-color: ${(props) => props.theme.bgHeader};
    color: ${(props) => props.theme.textBody};
    min-height: 100vh;
    .nftdetail-trans {
      background-color: ${(props) => props.theme.bgBodyTop};
      padding: 12px 22px;
      margin-bottom: 36px;
      box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
      font-size: 20px;
      border-radius: 16px;
    }
    .nftdetail {
      max-width: calc(100vw - 312px);
      max-width: 1160px;
      margin: 0 auto;
      .nftdetail-header,
      .nftdetail-item {
        p {
          width: 25%;
        }
      }
      .nftdetail-header {
        font-size: 21px;
        font-weight: bold;
      }
      .nftdetail-item {
        font-size: 16px;
      }
      .nftdetail-left {
        margin: 36px 36px 36px 0;
        border-radius: 16px;
        .nftdetail-left-top {
          background-color: ${(props) => props.theme.bgBodyTop};
          margin-bottom: 36px;
          box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
          border-radius: 16px;
          position: relative;
          height: 400px;
          display: flex;
          justify-content: center;
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
            img {
              width: 100%;
              height: 100%;
            }
            #watermark {
              position: absolute;
              bottom: calc(50% - 30px);
              right: calc(50% - 43px);
              opacity: 0.4;
              z-index: 99;
              font-size: 36px;
              color: white;
            }
          }
          .current-item {
            opacity: 1;
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
            opacity: 1;
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
            opacity: 1;
            border: 2px solid ${(props) => props.theme.borderBtn};
          }
          .notOwner {
            opacity: 0.2;
          }
        }
        .nftdetail-left-bot {
          background-color: ${(props) => props.theme.bgBodyTop};
          border-radius: 16px;
          box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
          padding: 12px 22px;
          font-size: 12px;
          .nftdetail-left-bot-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 6px;
          }
          .nftdetail-left-bot-detail {
            font-size: 14px;
            p {
              margin: 4px 8px;
            }
          }
        }
      }
      .nftdetail-right {
        margin: 36px 0;
        .nftdetail-right__top {
          background-color: ${(props) => props.theme.bgBodyTop};
          padding: 12px 22px;
          margin-bottom: 36px;
          box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
          font-size: 20px;
          border-radius: 16px;
          .nftdetail-right__title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 18px;

            color: rgb(237, 75, 158);
            .nftdetail-right__top-left {
              font-weight: 600;
              font-size: 20px;
              color: ${(props) => props.theme.textBody};
            }
          }
          .nftdetail-right__level {
            display: flex;
            font-weight: 600;
            margin-bottom: 12px;

            .nftdetail-right__level-left {
              margin: auto 32px auto 0;
              color: ${(props) => props.theme.textBody};
              .nftdetail-right__level-left-title {
                font-weight: 400;
                font-size: 14px;
                color: ${(props) => props.theme.textBody};
              }
            }
            .nftdetail-right__level-right {
              display: flex;
              padding: 6px 16px;
              background-color: ${(props) => props.theme.bgBodyTop};
              min-width: 250px;
              border-radius: 16px;
              box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;

              .icon-question {
                margin: auto 12px auto 0;
                font-size: 28px;
              }
              .nftdetail-right__level-right-body {
                font-weight: 500;
                .nftdetail-right__level-right-title {
                  font-weight: 400;
                  font-size: 14px;
                }
              }
            }
          }
          .nftdetail-right__button {
            display: flex;
            margin-bottom: 12px;

            .nftdetail-right__button-left,
            .nftdetail-right__button-right {
              color: ${(props) => props.theme.textBtn};
              border: 2px solid ${(props) => props.theme.textBtn};
              background-color: ${(props) => props.theme.bgBtn};
              padding: 6px 16px;
              cursor: pointer;
              border-radius: 25px;
              margin-left: 8px;
              max-width: 100%;
              font-size: 16px;
              max-width: 150px;
              text-align: center;
              font-weight: 600;
              height: 40px;
            }
            .disable {
              border: 2px solid #ccc;
              background-color: #ccc;
              opacity: 0.5;
              cursor: context-menu;
            }
            .nftdetail-right__button-left {
              margin-right: 48px;
            }

            .active {
              background: ${(props) => props.theme.borderBtn};
              color: black;
            }
          }
          .input__tranfer {
            height: 40px;
            border-radius: 12px;
            max-width: 240px;
            font-size: 16px;
          }
          .btn__tranfer {
            font-size: 16px;
            color: white;
            border: 2px solid #85c559;
            background: #85c559;
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 12px;
            margin-left: 8px;
            height: 40px;
          }
          .nftdetail-right__step {
            display: flex;
            margin-bottom: 12px;
            margin-left: 48px;
            max-width: 160px;
            display: flex;
            padding: 0px;
            align-items: center;
            justify-content: space-between;
            .nftdetail-right__step-left {
              width: calc(100% - 20px);
              display: flex;
              -webkit-box-align: center;
              align-items: center;
              .nftdetail-right__step-left-1 {
                min-width: 20px;
                min-height: 20px;
                background-color: rgb(133, 197, 89);
                border-radius: 50%;
                color: rgb(255, 255, 255);
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 8px;
                font-size: 12px;
              }
              .nftdetail-right__step-left-2 {
                width: 100%;
                height: 2px;
                background: linear-gradient(
                  90deg,
                  rgb(133, 197, 89) 0%,
                  rgb(233, 234, 235) 80%
                );
                opacity: 0.6;
              }
            }

            .nftdetail-right__step-right {
              min-width: 20px;
              min-height: 20px;
              background-color: rgb(233, 234, 235);
              border-radius: 50%;
              color: rgb(255, 255, 255);
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 8px;
              font-size: 12px;
            }
          }
          .nftdetail-right__token {
            width: 100%;
            display: flex;

            .nftdetail-right__token-left,
            .nftdetail-right__token-right {
              width: 50%;
              position: relative;
              .value-input {
                border: none;
                font-size: 16px;
                width: 100%;
                background-color: ${(props) => props.theme.bgBodyTop};
              }
              span {
                background: linear-gradient(
                  to right,
                  ${(props) => props.theme.opacityTo},
                  ${(props) => props.theme.opacityFrom}
                );
                content: "";
                height: 36px;
                pointer-events: none;
                position: absolute;
                right: 18px;
                left: auto;
                top: 32px;
                width: 60px;
              }
              .nftdetail-right__token-left-title,
              .nftdetail-right__token-right-title {
                font-size: 14px;
              }
            }
          }
        }
      }
      .nftdetail-right-bot {
        padding: 12px 22px;
        margin-bottom: 36px;
        box-shadow: rgb(25 95 81 / 20%) 0px 0px 21px 0px;
        font-size: 16px;
        border-radius: 16px;
        .nftdetail-right-bot-title {
          font-size: 18px;
          .nftdetail-right-bot-title-top {
            font-weight: bold;
            color: ${(props) => props.theme.textBody};
          }

          p {
            color: ${(props) => props.theme.borderBtn};
          }
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .bg__nftdetail {
      .nftdetail {
        flex-wrap: wrap;
        padding: 0 64px;
        .nftdetail-left,
        .nftdetail-right {
          margin: 36px 16px;
          .nftdetail-right__body {
            flex-wrap: wrap;
          }

          .nftdetail-right__top {
            .nftdetail-right__token {
              flex-wrap: wrap;
              .nftdetail-right__token-left,
              .nftdetail-right__token-right {
                /* width: 100%; */
              }
              .nftdetail-right__body {
                flex-wrap: wrap;
              }
            }
          }
        }
        .nftdetail-left {
          .nftdetail-left__top {
            height: 1000px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .bg__nftdetail {
      .nftdetail {
        flex-wrap: wrap;
        padding: 0 12px;
        .nftdetail-left,
        .nftdetail-right {
          width: 100%;
          margin: 12px 0;

          .nftdetail-right__top {
            .btn__tranfer {
              padding: 8px;
              font-size: 13px;
            }
            .input__tranfer {
              max-width: 218px;
            }
            .nftdetail-right__token {
              flex-wrap: wrap;
              .nftdetail-right__token-left,
              .nftdetail-right__token-right {
                width: 100%;
                .nftdetail-right__token-left-title,
                .nftdetail-right__token-right-title {
                  margin-top: 12px;
                  font-size: 18px;
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function NFTDetail() {
  let history = useHistory();
  const [arrObjCollection, setArrObjCollection] = useState([]);
  const [ownerNFT, setOwnerNFT] = useState([]);
  const [time, setTime] = useState([0]);
  const [price, setPrice] = useState([0]);
  const [createTime, setCreateTime] = useState(null);
  const [transition, setTransition] = useState([]);

  const sociallyAccount = useSelector((state) => state.wallet.arrMarket);
  const contractEth = useSelector((state) => state.wallet.contractEth);
  const contractBsc = useSelector((state) => state.wallet.contractBsc);
  const network = useSelector((state) => state.wallet.network);
  const account = useSelector((state) => state.wallet.account);
  const { id } = useParams();
  const [detailCurrent, setDetailCurrent] = useState("");
  const Web3Api = useMoralisWeb3Api();

  useEffect(() => {
    async function fetchData() {
      //   const options = { chain: "rinkeby", address: account, limit: "10" };
      //   const transfersNFT = await Moralis.Web3API.account.GetNFTTransfers(
      //     options
      //   );
      //  token address : 0x212f453b8e6684b9b9e6eeaaf9b9085c88f6ea2b
      const options = {
        address: "0x212F453B8E6684B9b9e6eeAAf9b9085C88f6Ea2b",
        token_id: id,
        chain: "rinkeby",
      };
      const transfers = await Web3Api.token.getWalletTokenIdTransfers(options);
      setTime([0]);
      setPrice([0]);
      for (let i = transfers.result.length - 1; i >= 0; i--) {
        setTime((time) => [...time, transfers.result[i].block_timestamp]);
        setPrice((price) => [
          ...price,
          transfers.result[i].value / Math.pow(10, 16),
        ]);
        if (+i === +transfers.result.length - 1) {
          setCreateTime(transfers.result[i]);
        }
        setTransition((transition) => [...transition, transfers.result[i]]);
      }
      sociallyAccount.forEach((item) => {
        if (+item.index === +id) {
          console.log("item", item);
          setDetailCurrent(item);
        }
      });
    }
    if (id) {
      return fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sociallyAccount]);

  useEffect(() => {
    async function fetchData() {
      let result = [];
      if (network === "rinkeby") {
        result = await contractEth.methods.getNFTtoCollection(id).call();
      } else {
        result = await contractBsc.methods.getNFTtoCollection(id).call();
      }

      setArrObjCollection([]);
      result.forEach(async (item) => {
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
    }
    if (id && (contractEth || contractBsc)) {
      return fetchData();
    }
  }, [account, contractEth, contractBsc, id, network]);

  useEffect(() => {
    async function fetchData() {
      setOwnerNFT([]);
      arrObjCollection.forEach((item) => {
        if (account && item.owner.toLowerCase() === account) {
          setOwnerNFT((ownerNFT) => [
            ...ownerNFT,
            {
              index: item.index,
              owner: true,
              image: item.image,
            },
          ]);
        } else {
          setOwnerNFT((ownerNFT) => [
            ...ownerNFT,
            {
              index: item.index,
              owner: false,
              image: item.image,
            },
          ]);
        }
      });
    }
    return fetchData();
  }, [account, arrObjCollection]);

  const TransferDino = async () => {
    if (!account) {
      toast.warn("Bạn vui lòng đăng nhập để mua vật phẩm này!");
    } else {
      if (account.toLowerCase() !== detailCurrent.owner.toLowerCase()) {
        if (network === "rinkeby") {
          await contractEth.methods
            .buy(id)
            .send({
              from: account,
              gas: "300000",
              value: detailCurrent.price,
            })
            .then(async (value) => {
              toast.success("Chúc mừng bạn đã mua thành công!!!");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          await contractBsc.methods
            .buy(id)
            .send({
              from: account,
              gas: "300000",
              value: detailCurrent.price,
            })
            .then(async (value) => {
              toast.success("Chúc mừng bạn đã mua thành công!!!");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        history.push("/nftmarket");
      }
    }
  };

  const renderFragments = () => {
    // eslint-disable-next-line array-callback-return
    return ownerNFT.map((item) => {
      if (+item.index === +id) {
        return (
          <div className="fragment-item" key={item.index}>
            <img
              src={item.image}
              alt={item.image}
              className=" current-item"
              style={{
                zIndex: "3",
              }}
            />
            {item.owner && <span id="watermark">Mine</span>}
          </div>
        );
      }
      if (item.owner) {
        return (
          <div className="fragment-item" key={item.index}>
            <img
              src={item.image}
              alt={item.image}
              style={{
                zIndex: "3",
              }}
            />
            <span id="watermark">Mine</span>
          </div>
        );
      }

      if (!item.owner) {
        return (
          <img
            key={item.index}
            src={item.image}
            alt={item.image}
            className="fragment-item notOwner"
            style={{
              zIndex: "3",
            }}
          />
        );
      }
    });
  };

  const classifyFragment = () => {
    console.log("re-render");
    if (arrObjCollection.length === 4) {
      return (
        <div className="nftdetail-left-top fragment-2">{renderFragments()}</div>
      );
    }
    if (arrObjCollection.length === 9) {
      return (
        <div className="nftdetail-left-top fragment-3">{renderFragments()}</div>
      );
    }
    if (arrObjCollection.length === 16) {
      return (
        <div className="nftdetail-left-top fragment-4">{renderFragments()}</div>
      );
    }
  };

  const viewNFT = () => {
    if (detailCurrent.video) {
      return (
        <ReactPlayer
          className="video"
          url={detailCurrent.video}
          controls={true}
        />
      );
    } else {
      if (+detailCurrent.idOwner === +detailCurrent.index) {
        return (
          <img
            src={detailCurrent.image}
            alt=""
            style={{
              height: "100%",
              position: "absolute",
              zIndex: "3",
            }}
          />
        );
      } else {
        classifyFragment();
      }
    }
  };

  const renderHistory = () => {
    return transition.map((item, index) => {
      console.log("item", item);
      if (index === 0) {
        return (
          <div className="nftdetail-item flex justify-between my-2" key={index}>
            <p className="flex">
              <GiNewBorn style={{ margin: "auto 6px auto 0" }} /> Minted
            </p>
            <p></p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => openEthScan(item.from_address)}
            >
              {item.from_address.slice(0, 4)}...
              {item.from_address.slice(
                item.from_address.length - 4,
                item.from_address.length
              )}
            </p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => openEthScan(item.to_address)}
            >
              {item.to_address.slice(0, 4)}...
              {item.to_address.slice(
                item.to_address.length - 4,
                item.to_address.length
              )}
            </p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                item.transaction_hash &&
                  window.open(
                    `https://rinkeby.etherscan.io/tx/${item.transaction_hash}`,
                    "_blank"
                  );
              }}
            >
              {item.block_timestamp}
            </p>
          </div>
        );
      } else {
        return (
          <div className="nftdetail-item flex justify-between my-2" key={index}>
            <p className="flex">
              <BiTransferAlt style={{ margin: "auto 6px auto 0" }} /> Transfer
            </p>
            <p>{(+item.value / Math.pow(10, 16)).toFixed(4)}</p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => openEthScan(item.from_address)}
            >
              {item.from_address.slice(0, 4)}...
              {item.from_address.slice(
                item.from_address.length - 4,
                item.from_address.length
              )}
            </p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => openEthScan(item.to_address)}
            >
              {item.to_address.slice(0, 4)}...
              {item.to_address.slice(
                item.to_address.length - 4,
                item.to_address.length
              )}
            </p>
            <p
              style={{
                color: "#e1c129",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                item.transaction_hash &&
                  window.open(
                    `https://rinkeby.etherscan.io/tx/${item.transaction_hash}`,
                    "_blank"
                  );
              }}
            >
              {item.block_timestamp}
            </p>
          </div>
        );
      }
    });
  };
  const openEthScan = (address) => {
    address &&
      window.open(`https://rinkeby.etherscan.io/address/${address}`, "_blank");
  };

  const openIpfs = () => {
    console.log("detailCurrent.owner.uri", detailCurrent);
    detailCurrent.uri && window.open(detailCurrent.uri, "_blank");
  };

  return (
    <StyledNFTDetail>
      <div className="bg__nftdetail">
        <div className="nftdetail flex ">
          <div className="nftdetail-left xl:w-1/3 lg:w-full sm:w-full">
            <div className="nftdetail-left-top">
              {viewNFT()}
              {+detailCurrent.idOwner === +detailCurrent.index ? (
                <img
                  src={detailCurrent.image}
                  alt=""
                  style={{
                    height: "100%",
                    position: "absolute",
                    zIndex: "3",
                  }}
                />
              ) : (
                classifyFragment()
              )}
            </div>
            <div className="nftdetail-left-bot">
              <h3 className="nftdetail-left-bot-title">NFT Desc</h3>
              <p className="nftdetail-left-bot-des">
                Eggs of Money-hungry dino, can be hatched out of the level 1-6
                Money-hungry dinos. Money-hungry Dinos are said to be a race of
                Triceratops, but unlike the gentle and herbivorous Triceratops,
                they are fierce and powerful, and they like gold shiny things by
                nature, and they like to have gold shiny things around them when
                they eat and sleep, and over time, their skin color has become
                orange. They like to collect gold shiny things anywhere.
              </p>
            </div>
            <div className="nftdetail-left-bot mt-2">
              <h3 className="nftdetail-left-bot-title">Detail</h3>
              <div className="nftdetail-left-bot-detail flex justify-between">
                <p>Contract Address</p>
                <p
                  onClick={() => openEthScan(detailCurrent.owner)}
                  style={{
                    color: "#e1c129",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {detailCurrent.owner &&
                    `${detailCurrent.owner.slice(0, 4)}...
                  ${detailCurrent.owner.slice(
                    detailCurrent.owner.length - 4,
                    detailCurrent.owner.length
                  )}`}
                </p>
              </div>
              <div className="nftdetail-left-bot-detail flex justify-between">
                <p>Token ID</p>
                <p
                  style={{
                    color: "#e1c129",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => openIpfs(detailCurrent.owner.uri)}
                >
                  {id}
                </p>
              </div>
              <div className="nftdetail-left-bot-detail flex justify-between">
                <p>Token Standard</p>
                <p>ERC-721</p>
              </div>
              <div className="nftdetail-left-bot-detail flex justify-between">
                <p>Blockchain</p>
                <p>Rinkeby</p>
              </div>
            </div>
          </div>
          <div className="nftdetail-right xl:w-2/3 lg:w-full sm:w-full">
            <div className="nftdetail-right__top">
              <div className="nftdetail-right__title">
                <p className="nftdetail-right__top-left">
                  {detailCurrent && detailCurrent.name} #
                  {detailCurrent && detailCurrent.index}
                </p>
                <p>Unopened</p>
              </div>
              <div className="nftdetail-right__level">
                <div className="nftdetail-right__level-left">
                  <p className="nftdetail-right__level-left-title">NFT Level</p>
                  <p>Level 1</p>
                </div>
                <div className="nftdetail-right__level-right">
                  <AiOutlineQuestionCircle className="icon-question" />
                  <div className="nftdetail-right__level-right-body">
                    <p className="nftdetail-right__level-right-title">Price</p>
                    <p>
                      {detailCurrent &&
                        (+detailCurrent.price / Math.pow(10, 16)).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex nftdetail-right__body justify-between">
                <div>
                  <div className="flex justify-between">
                    <div className="nftdetail-right__button">
                      <span
                        className="nftdetail-right__button-left active"
                        onClick={() => toast.warn("Please try again!")}
                      >
                        Enable
                      </span>
                      <span
                        className={
                          account &&
                          detailCurrent.owner &&
                          account.toLowerCase() ===
                            detailCurrent.owner.toLowerCase()
                            ? "nftdetail-right__button-right disable"
                            : "nftdetail-right__button-right "
                        }
                        onClick={() => TransferDino()}
                      >
                        Buy Now
                      </span>
                    </div>
                  </div>
                  <div className="nftdetail-right__step">
                    <div className="nftdetail-right__step-left">
                      <div className="nftdetail-right__step-left-1">1</div>
                      <div className="nftdetail-right__step-left-2"></div>
                    </div>
                    <p className="nftdetail-right__step-right">2</p>
                  </div>
                </div>
              </div>

              <div className="nftdetail-right__token">
                <div className="nftdetail-right__token-right">
                  <p className="nftdetail-right__token-right-title">Author</p>
                  <input
                    type="text"
                    name="author"
                    defaultValue={detailCurrent.owner}
                    className="value-input"
                    disabled
                    id="myTextField"
                  />
                  <span></span>
                </div>
              </div>
            </div>
            <div className="nftdetail-right-bot">
              <div className="nftdetail-right-bot-title">
                <p className="nftdetail-right-bot-title-top">Price history</p>
                <p>50 USD</p>
              </div>
              <ChartJS time={time} price={price} />
            </div>
          </div>
        </div>
        <div className="nftdetail nftdetail-trans">
          <div className="nftdetail-header flex ">
            <p>Event</p>
            <p>Price</p>
            <p>From</p>
            <p>To</p>
            <p>Date</p>
          </div>
          {renderHistory()}
        </div>
      </div>
    </StyledNFTDetail>
  );
}
