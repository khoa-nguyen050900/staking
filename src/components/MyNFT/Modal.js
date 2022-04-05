import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useMoralis, useMoralisFile } from "react-moralis";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactPlayer from "react-player/lazy";
import axios from "axios";

export default function Modal(props) {
  const { Moralis } = useMoralis();
  const { saveFile } = useMoralisFile();

  const [currentTypeCoin, setCurrentTypeCoin] = useState("USDT");
  const [price, setPrice] = useState(null);
  const [ownerNFT, setOwnerNFT] = useState([]);
  const [numberNFT, setNumberNFT] = useState(1);
  const [fragment, setFrament] = useState(2);
  const account = useSelector((state) => state.wallet.account);

  useEffect(() => {
    async function fetchData() {
      setOwnerNFT([]);
      let number = 0;
      props.arrObjCollection.map((item) => {
        if (item.owner.toLowerCase() === account) {
          number++;
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
      setNumberNFT(number);
    }
    return fetchData();
  }, [account, props.arrObjCollection]);

  const addDinoMarket = async (index) => {
    let value = price * Math.pow(10, 16);
    await props.contractEth.methods
      .listing(index, value.toString(), currentTypeCoin)
      .send({
        from: props.account,
        gas: 3000000,
      })
      .then(toast.success("Thêm khủng long vào market thành công!!!"));
  };

  function compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement("canvas");
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext("2d");
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = (error) => rej(error);
    });
  }

  const actionFragment = async () => {
    if (props.nft.fragmented) {
      toast.warn("NFT đã được phân mảnh, vui lòng chọn NFT khác!");
    }
    if (!props.nft.owner) {
      toast.warn("Vui lòng chọn đúng mạng để phân mảnh NFT này!");
    } else {
      if (props.nft.video) {
        toast.success("Bắt đầu phân mảnh video!");
        let arrUri = [];
        var vid = document.createElement("video");
        vid.src = props.nft.video;
        let time = 0;
        vid.ondurationchange = async function () {
          time = this.duration;
          console.log("time/fragment", time);
          let numberFragment = Math.floor(time / Math.pow(fragment, 2));
          console.log(numberFragment, time);
          const res = await axios.post("http://localhost:5000/uploadVideo", {
            video: props.nft.video,
            time: numberFragment,
            fragment: Math.pow(fragment, 2),
          });
          let result = [];
          res.data.base64.forEach((item) => {
            result.push("data:video/mp4;base64," + item);
          });
          for (let i = 0; i < result.length; i++) {
            console.log("result", result[i]);
            let name = `Fragment ${props.nft.name}`;
            const metadata = {
              name,
              image:
                "https://ipfs.moralis.io:2053/ipfs/QmQVMDnSGV256Gg8aiUiFEHpcYKdusrqUH79SawAiMSnHR",
              description:
                "It was unbelievable, even with us couldn't believe it. Substance to each VND!",
              animation_url: result[i],
            };
            console.log(metadata);
            const nftFileMetadataFile = new Moralis.File("metadata.json", {
              base64: btoa(JSON.stringify(metadata)),
            });
            await nftFileMetadataFile.saveIPFS();
            const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
            console.log("metadata", nftFileMetadataFilePath);
            arrUri.push(nftFileMetadataFilePath);
          }

          console.log("arrUri", arrUri);
          let value = Math.pow(fragment, 2) * 10000000000000000;
          await props.contractEth.methods
            .fragmentNFT(Math.pow(fragment, 2), +props.nft.index, arrUri)
            .send(
              { from: account, gas: 10000000, value: value },
              function (err, res) {
                if (res) {
                  console.log(`Đã trả phí`);
                  props.setShowModal(false);
                }
                if (err) {
                  console.log("Error", err);
                  props.setShowModal(false);
                }
              }
            );
        };
      } else {
        toast.success("Bắt đầu phân mảnh ảnh!");
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.src = props.nft.image;
        let imagePieces = [];
        var numColsToCut = fragment;
        var numRowsToCut = fragment;
        var widthOfOnePiece = image.width / numColsToCut;
        var heightOfOnePiece = image.width / numRowsToCut;
        console.log(props.contractEth);
        for (let x = 0; x < numColsToCut; ++x) {
          for (let y = 0; y < numRowsToCut; ++y) {
            let canvas = document.createElement("canvas");
            canvas.width = widthOfOnePiece / numColsToCut;
            canvas.height = heightOfOnePiece / numRowsToCut;
            let context = canvas.getContext("2d");
            context.drawImage(
              image,
              y * heightOfOnePiece,
              x * widthOfOnePiece,
              widthOfOnePiece,
              heightOfOnePiece,
              0,
              0,
              canvas.width,
              canvas.height
            );
            console.log("canvas.toDataURL()", canvas.toDataURL());
            await compressImage(canvas.toDataURL(), 1300, 1300).then(
              (compressed) => {
                imagePieces.push(compressed);
              }
            );
          }
        }
        let arrUri = [];
        console.log("imagePieces", imagePieces);
        for (let i = 0; i < imagePieces.length; i++) {
          const cutImages = await new saveFile(
            "fragment.png",
            { base64: imagePieces[i] },
            { saveIPFS: true }
          );
          // console.log("cutImages", cutImages._ipfs);
          console.log("Hình phân ảnh", cutImages);
          // composite = await axios.post("http://localhost:5000/composite", {
          //   result: result,
          //   id: index,
          // });
          // Create Metadata
          let name = props.nft.name + "-" + i;
          console.log(name);

          const metadata = {
            name,
            description:
              "It was unbelievable, even with us couldn't believe it. Substance to each VND!",
            image: cutImages._ipfs,
          };
          console.log(metadata);
          const nftFileMetadataFile = new Moralis.File("metadata.json", {
            base64: btoa(JSON.stringify(metadata)),
          });
          await nftFileMetadataFile.saveIPFS();
          const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
          console.log("metadata", nftFileMetadataFilePath);
          arrUri.push(nftFileMetadataFilePath);
        }
        let value = Math.pow(fragment, 2) * 10000000000000000;
        await props.contractEth.methods
          .fragmentNFT(Math.pow(fragment, 2), +props.nft.index, arrUri)
          .send(
            { from: account, gas: 10000000, value: value },
            function (err, res) {
              if (res) {
                console.log(`Đã trả phí`);
                props.setShowModal(false);
              }
              if (err) {
                console.log("Lỗi cmnr", err);
                props.setShowModal(false);
              }
            }
          );
      }
    }
  };

  const removeDinoMarket = async (index) => {
    await props.contractEth.methods
      .unListing(index)
      .send({
        from: props.account,
        gas: 3000000,
      })
      .then(toast.success("Xóa khủng long vào market thành công!!!"));
  };

  const actionMarket = async () => {
    if (!props.nft.owner) {
      toast.warn("Vui lòng chọn đúng mạng để bán NFT này!");
    } else {
      if (props.nft.listing) {
        await removeDinoMarket(props.nft.index);
      } else {
        await addDinoMarket(props.nft.index);
      }
      props.setShowModal(false);
    }
  };
  const renderFragments = () => {
    // eslint-disable-next-line array-callback-return
    return ownerNFT.map((item) => {
      if (item.owner && +item.index === +props.nft.index) {
        return (
          <img
            key={item.index}
            src={item.image}
            alt={item.image}
            className="fragment-item current-item"
            style={{
              zIndex: "3",
            }}
          />
        );
      }
      if (item.owner && item.index !== props.nft.index) {
        return (
          <img
            key={item.index}
            src={item.image}
            alt={item.image}
            className="fragment-item"
            style={{
              zIndex: "3",
            }}
          />
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
  const openSea = () => {
    window.open(
      `https://testnets.opensea.io/assets/0x212f453b8e6684b9b9e6eeaaf9b9085c88f6ea2b/${props.nft.index}`,
      "_blank"
    );
  };

  const classifyFragment = () => {
    if (props.arrObjCollection.length === 4) {
      return <div className="listDino fragment-2">{renderFragments()}</div>;
    }
    if (props.arrObjCollection.length === 9) {
      return <div className="listDino fragment-3">{renderFragments()}</div>;
    }
    if (props.arrObjCollection.length === 16) {
      return <div className="listDino fragment-4">{renderFragments()}</div>;
    }
  };

  const renderModal = () => {
    if (props.isFragment) {
      return (
        <>
          <div className="meta__modal">
            <div className="meta__modal-header flex ">
              <h4>{props.nft.name}</h4>
              <AiFillCloseCircle
                className="header-icon"
                onClick={() => props.setShowModal(false)}
              />
            </div>
            <div
              className={
                "nftmake__body-mid-item  md:col-span-6   md:col-span-6  xl:col-span-4 col-span-12 col-span-12"
              }
              key={props.nft.id}
            >
              <div
                className={
                  props.nft.image ? "listDino" : "listDino listDino-video"
                }
              >
                <div>
                  {props.nft.image ? (
                    <img
                      src={props.nft.image}
                      alt={props.nft.image}
                      crossOrigin="anonymous"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: "3",
                      }}
                    />
                  ) : (
                    <ReactPlayer
                      id="video"
                      url={props.nft.video}
                      controls={true}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="meta__modal-body-stake">
              <p>Chọn số mảnh:</p>
              <div className="number__fragment flex">
                <p
                  className={
                    fragment === 2
                      ? "btn-fragment btn-fragment-active"
                      : "btn-fragment "
                  }
                  onClick={() => setFrament(2)}
                >
                  4 Mảnh
                </p>
                <p
                  className={
                    fragment === 3
                      ? "btn-fragment btn-fragment-active"
                      : "btn-fragment "
                  }
                  onClick={() => setFrament(3)}
                >
                  9 Mảnh
                </p>
                <p
                  className={
                    fragment === 4
                      ? "btn-fragment btn-fragment-active"
                      : "btn-fragment "
                  }
                  onClick={() => setFrament(4)}
                >
                  16 Mảnh
                </p>
              </div>
              <p className="btn-claim" onClick={() => actionFragment()}>
                Phân mảnh ngay
              </p>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={() => props.setShowModal(false)}
          ></div>
        </>
      );
    } else {
      if (props.viewFragment) {
        return (
          <>
            <div className="meta__modal">
              <div className="meta__modal-header flex ">
                <h4>Phân mảnh {props.nft.name} </h4>
                <AiFillCloseCircle
                  className="header-icon"
                  onClick={() => props.setShowModal(false)}
                />
              </div>
              <div
                className={
                  "nftmake__body-mid-item  md:col-span-6   md:col-span-6  xl:col-span-4 col-span-12 col-span-12"
                }
                key={props.nft.id}
              >
                {classifyFragment()}
              </div>
              <div className="meta__modal-body-stake">
                <div className="body-stake-header">Thông tin NFT:</div>
                <div className="flex justify-between">
                  <p>
                    Số mảnh đã thu thập:{" "}
                    {props.arrObjCollection &&
                      `${numberNFT} / ${props.arrObjCollection.length} `}
                  </p>
                </div>
                <p className="btn-claim" onClick={() => openSea()}>
                  Xem Opensea
                </p>
              </div>
            </div>
            <div
              className="opacity-25 fixed inset-0 z-40 bg-black"
              onClick={() => props.setShowModal(false)}
            ></div>
          </>
        );
      } else {
        return (
          <>
            <div className="meta__modal">
              <div className="meta__modal-header flex ">
                <h4>{props.nft.name}</h4>
                <AiFillCloseCircle
                  className="header-icon"
                  onClick={() => props.setShowModal(false)}
                />
              </div>
              <div
                className={
                  "nftmake__body-mid-item  md:col-span-6   md:col-span-6  xl:col-span-4 col-span-12 col-span-12"
                }
                key={props.nft.id}
              >
                <div
                  className={
                    props.nft.image ? "listDino" : "listDino listDino-video"
                  }
                >
                  <div>
                    {props.nft.image ? (
                      <img
                        src={props.nft.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          zIndex: "3",
                        }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <ReactPlayer
                        id="video"
                        url={props.nft.video}
                        controls={true}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="meta__modal-body-stake">
                <div className="body-stake-header">
                  {props.nft.listing && props.nft.price
                    ? `Giá đang bán: ${Math.floor(
                        +props.nft.price / Math.pow(10, 16)
                      )} ${props.nft.typeCoin}`
                    : "Nhập giá:"}
                </div>
                {!props.nft.listing && (
                  <div className="flex justify-between">
                    <input
                      type="text"
                      name="price"
                      className="input_price"
                      value={price}
                      placeholder="Nhập giá"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <div className=" mynft__btn-right-body">
                      <span>Loại coin:</span>
                      <select
                        name="select-profession"
                        id="select-profession"
                        value={currentTypeCoin}
                        onChange={(e) => setCurrentTypeCoin(e.target.value)}
                      >
                        {props.sortCoin.map((item) => {
                          return (
                            <option className="option" value={item} key={item}>
                              {item}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}

                <p className="btn-claim" onClick={() => actionMarket()}>
                  {props.nft.listing ? "Ngưng bán" : "Bán ngay"}
                </p>
              </div>
            </div>
            <div
              className="opacity-25 fixed inset-0 z-40 bg-black"
              onClick={() => props.setShowModal(false)}
            ></div>
          </>
        );
      }
    }
  };

  return <>{renderModal()}</>;
}
