import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { toast } from "react-toastify";

const CreateFragmentStyled = styled.div`
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
          padding: 36px;
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
export default function CreateFragment() {
  const { t } = useTranslation();
  const [currentTypeCoin, setCurrentTypeCoin] = useState("Ethereum Testnet");
  const [numberCoin, setNumberCoin] = useState("");
  const [currentTime, setCurrentTime] = useState(3);
  const [interestRate, setInterestRate] = useState("");
  const [timeUnlock, setTimeUnlock] = useState("");

  const [addressToken, setAddressToken] = useState("");
  const sortCoin = ["Ethereum Testnet", "Binance Smart Chain Testnet"];
  const timeStaking = [3, 6, 9, 12, 18, 24, 36];

  const account = useSelector((state) => state.wallet.account);

  const network = useSelector((state) => state.wallet.network);
  const contractStakingETH = useSelector(
    (state) => state.wallet.contractStakingETH
  );
  const contractStakingBSC = useSelector(
    (state) => state.wallet.contractStakingBSC
  );

  useEffect(() => {
    async function fetchData() {
      console.log("contractStakingETH", contractStakingETH);
    }
    // console.log(contractStakingETH, account);
    contractStakingETH && fetchData();
  }, [contractStakingETH]);

  const createStaking = async () => {
    console.log("currentTypeCoin", currentTypeCoin, numberCoin);
    console.log("network", network);
    if (currentTypeCoin === "Ethereum Testnet" && network !== "rinkeby") {
      toast.warn("Vui lòng chọn lại mạng ETH!");
    } else if (
      currentTypeCoin === "Binance Smart Chain Testnet" &&
      network !== "bsc"
    ) {
      toast.warn("Vui lòng chọn lại mạng BSC");
    } else {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }
      let coinType = network === "rinkeby" ? "ETH" : "BSC";
      let time = +currentTime * 60;
      let unlock = +timeUnlock * 60;
      console.log(
        "time, timeUnlock, coinType",
        time,
        interestRate,
        timeUnlock,
        unlock
      );

      unlock && interestRate
        ? await contract.methods
            .createStaking(time, interestRate, coinType, unlock)
            .send({ from: account, gas: "300000" }, function (err, res) {
              if (res) {
                toast.success("Khởi tạo staking thành công!!!");
              } else {
                toast.warn("Khởi tạo staking thất bại!!!");
              }
            })
        : toast.warn("Vui lòng nhập lãi suất!");
    }
  };

  return (
    <CreateFragmentStyled>
      <div className="staking">
        <div className="staking-top ">
          <div className="staking__top">
            <h1 className="staking__top-title">Tạo Staking</h1>
            <div className="select__typecoin">
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Mạng</p>
                <select
                  name="select-profession"
                  id="select-profession"
                  value={currentTypeCoin}
                  onChange={(e) => setCurrentTypeCoin(e.target.value)}
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

              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Kỳ hạn</p>
                <select
                  name="select-profession"
                  id="select-profession"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
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
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Lãi suất (%)</p>
                <input
                  type="number"
                  placeholder="Nhập lãi suất"
                  name="select-profession"
                  id="select-profession"
                  value={interestRate}
                  onChange={(e) => {
                    let value = e.target.value;
                    value.charCodeAt(numberCoin.length) !== 46 &&
                      setInterestRate(e.target.value);
                  }}
                />
              </div>

              <div className=" mynft__btn-right-body flex justify-between">
                <p className="name__select">Thời gian nhận (tháng)</p>
                <input
                  type="number"
                  placeholder="Nhập thời gian nhận lãi suất"
                  name="select-profession"
                  id="select-profession"
                  value={timeUnlock}
                  onChange={(e) => {
                    let value = e.target.value;
                    value.charCodeAt(timeUnlock.length) !== 46 &&
                      setTimeUnlock(e.target.value);
                  }}
                />
              </div>
              {/* <div className=" mynft__btn-right-body flex justify-around">
                
                  <div>
                  <p>Phần trăm lãi suất</p>
                  <p style={{color : "#F9D205", fontWeight: "bold"}}>6 %</p>
                  </div>
                  <div>
                  <p>Lãi suất DAK</p>
                  <p style={{color : "#F9D205", fontWeight: "bold"}}>6 %</p>
                  </div>
              </div> */}
              <div className=" mynft__btn-right-body flex justify-between">
                <p className="stake__now" onClick={createStaking}>
                  Tạo Staking ngay!!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreateFragmentStyled>
  );
}
