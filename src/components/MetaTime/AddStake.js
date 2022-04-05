import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";

const AddStakeStyled = styled.div`
  .staking {
    min-height: calc(100vh);
    background-color: ${(props) => props.theme.bgHeader};

    .staking-top {
      padding: 40px 0;
      background-color: ${(props) => props.theme.bgHeaderItem};
      min-height: calc(100vh);
      .staking__top {
        width: calc(100vw - 312px);
        max-width: 1160px;
        margin: 0 auto;
        color: ${(props) => props.theme.textBody};

        .staking__top-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        #select-profession {
          color: black;
          padding: 18px;
          border-radius: 12px;
          font-size: 18px;
          line-height: 28px;
          width: 80%;
        }

        .select__typecoin {
          padding: 48px;
          border: 1px solid #ccc;
          border-radius: 12px;
          .mynft__btn-right-body {
            margin: 18px 0;
            .stake__now:hover {
              opacity: 0.8;
              cursor: pointer;
            }
            p {
              line-height: 56px;
              font-size: 18px;
            }
            .stake__now {
              width: 885px;
              height: 74px;
              left: 171px;
              top: 896px;
              background: #f9d205;
              border-radius: 20px;
              text-align: center;
              line-height: 74px;
              color: black;
              font-weight: bold;
              margin: 18px auto 0 auto;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1023px) {
    .staking {
      width: 100%;
      .staking-top {
        .staking__top {
          padding: 12px;
          min-width: calc(100vw - 180px);
        }
      }
      .staking-bot {
        .staking__bot {
          padding: 12px;
          min-width: calc(100vw - 200px);
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    .staking {
      width: 100%;
      .staking-top {
        .staking__top {
          padding: 12px;
          width: 100%;
        }
      }
    }
  }
`;
export default function AddStake() {
  const { t } = useTranslation();
  const [currentTypeCoin, setCurrentTypeCoin] = useState("Ethereum Testnet");
  const [numberCoin, setNumberCoin] = useState("");
  const [timeUnlock, setTimeUnlock] = useState(1);
  const [timeReward, setTimeReward] = useState(0);

  const sortTime = [1, 3, 6, 9, 12, 18, 24, 36];
  const [timeStaking, setTimeStaking] = useState([]);

  const account = useSelector((state) => state.wallet.account);

  const network = useSelector((state) => state.wallet.network);
  const itemStake = useSelector((state) => state.home.itemStake);
  console.log("itemStake", itemStake);
  const contractStakingETH = useSelector(
    (state) => state.wallet.contractStakingETH
  );
  const contractStakingBSC = useSelector(
    (state) => state.wallet.contractStakingBSC
  );

  useEffect(() => {
    async function fetchData() {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }
      let currentUnlocks = await contract.methods
        .getTotalUnblock(account, itemStake.id)
        .call();
      setTimeReward(currentUnlocks);

      sortTime.forEach((item) => {
        if (item >= currentUnlocks && item <= +itemStake.time / 60) {
          setTimeStaking((timeStaking) => [...timeStaking, item]);
        }
      });
    }
    // console.log(contractStakingETH, account);
    contractStakingETH && fetchData();
  }, [contractStakingETH]);

  const createStaking = async () => {
    console.log("currentTypeCoin", currentTypeCoin, numberCoin);
    console.log("network", network);
    if (itemStake.typeCoin === "ETH" && network !== "rinkeby") {
      toast.warn("Vui lòng chọn lại mạng ETH!");
    } else if (itemStake.typeCoin === "BSC" && network !== "bsc") {
      toast.warn("Vui lòng chọn lại mạng BSC");
    } else {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }
      let coinType = network === "rinkeby" ? "ETH" : "BSC";
      let value = +numberCoin * 10000000000000000;
      let time = +timeUnlock * 60;
      console.log(
        "uint256 _stake,uint256 _id, uint256 _rStake,uint256 _rDak,uint256 _time)",
        value.toString(),
        itemStake.id,
        itemStake.interestRate,
        "3350",
        "28000000000000000",
        time.toString()
      );

      numberCoin
        ? await contract.methods
            .addStake(
              value.toString(),
              itemStake.id,
              "3500",
              "50000000000000000",
              time.toString()
            )
            .send(
              { from: account, value: value.toString(), gas: "300000" },
              function (err, res) {
                if (res) {
                  toast.success("Stake thêm thành công!!!");
                } else {
                  toast.warn("Stake thêm thất bại!!!");
                }
              }
            )
        : toast.warn("Vui lòng nhập lãi suất!");
    }
  };

  return (
    <AddStakeStyled>
      <div className="staking">
        <div className="staking-top ">
          <div className="staking__top">
            <h1 className="staking__top-title">Stake Thêm</h1>
            <div className="select__typecoin">
              <p className="name__select">
                Số tháng còn lại: {`${timeReward} Tháng`}
              </p>
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Loại tiền ảo</p>
                <select
                  name="select-profession"
                  id="select-profession"
                  value={currentTypeCoin}
                  onChange={(e) => setCurrentTypeCoin(e.target.value)}
                >
                  <option
                    className="option"
                    value={itemStake.typeCoin}
                    key={itemStake.typeCoin}
                  >
                    {itemStake.typeCoin === "BSC"
                      ? "Binance Smart Chain Testnet"
                      : "Ethereum Testnet"}
                  </option>
                </select>
              </div>
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Số tiền cần Stake</p>
                <input
                  type="number"
                  placeholder="Nhập số lượng coin stake"
                  name="select-profession"
                  id="select-profession"
                  value={numberCoin}
                  onChange={(e) => {
                    let value = e.target.value;
                    value.charCodeAt(numberCoin.length) !== 46 &&
                      setNumberCoin(e.target.value);
                  }}
                />
              </div>
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Kỳ hạn</p>
                <select
                  name="select-profession"
                  id="select-profession"
                  value={timeUnlock}
                  onChange={(e) => setTimeUnlock(e.target.value)}
                >
                  {timeStaking.map((item) => {
                    return (
                      <option className="option" value={item} key={item}>
                        {`${item} Tháng`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className=" mynft__btn-right-body">
                <p>Phần trăm lãi suất (% / {+itemStake.time / 60} tháng)</p>
                <div className="flex ">
                  <p
                    style={{
                      width: "50%",
                      color: "#F9D205",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {itemStake.interestRate} %
                  </p>

                  <p
                    style={{
                      width: "50%",
                      color: " #349B24",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                    className="flex"
                  >
                    <FaArrowUp style={{ margin: "auto 12px" }} /> 10 %
                  </p>
                </div>
              </div>
              <div className=" mynft__btn-right-body">
                <p>Lãi suất (DAK Token)</p>
              </div>
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="stake__now" onClick={createStaking}>
                  Xác nhận
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddStakeStyled>
  );
}
