import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ModalStaking(props) {
  const [amount, setAmount] = useState(null);
  const [maxReward, setMaxReward] = useState(0);
  const [priceETH, setPriceETH] = useState();
  const [priceDAK, setPriceDAK] = useState();
  const [currentReward, setCurrentReward] = useState();
  const [currentUnlock, setCurrentUnlock] = useState();
  const [timeUnlock, setTimeUnlock] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const account = useSelector((state) => state.wallet.account);
  const network = useSelector((state) => state.wallet.network);
  const contractStakingETH = useSelector(
    (state) => state.wallet.contractStakingETH
  );
  const contractStakingBSC = useSelector(
    (state) => state.wallet.contractStakingBSC
  );

  const steps = [
    {
      label: `Số lần nhận token thưởng còn lại ${currentUnlock}`,
      description: `Bạn sẽ nhận được ${currentReward} DAK`,
    },

    {
      label: "Nhận coin đợt cuối",
      description: `Bạn sẽ nhận được  ${currentReward} DAK còn lại và lượng coin bạn đã staking`,
    },
  ];

  const handleNext = async () => {
    let contract;
    if (network === "rinkeby") {
      contract = contractStakingETH;
    } else {
      contract = contractStakingBSC;
    }
    let currentUnlock = await contract.methods
      .getTimeSuccessReward(account, props.currentItem.id)
      .call();
    let currentUnlocks = await contract.methods
      .getTotalUnblock(account, props.currentItem.id)
      .call();
    let temp;
    for (let i = currentUnlock.length - 1; i >= 0; i--) {
      if (currentUnlock.length - currentUnlocks === i) {
        temp = currentUnlock[i];
      }
    }

    console.log(
      "temmmmp",
      temp < Date.now() / 1000,
      +temp,
      Date.now() / 1000,
      account,
      currentUnlocks
    );
    if (+temp < Date.now() / 1000) {
      if (+currentUnlocks > 1) {
        console.log("props.currentItem", props.currentItem);
        await contract.methods
          .withdrawRawardPart(props.currentItem.id)
          .send({ from: account, gas: "300000" }, function (err, res) {
            if (res) {
              toast.success("Nhận Reward thành công!!!");
              setCurrentUnlock((currentUnlock) => +currentUnlock - 1);
              if (+currentUnlock === 2) {
                setActiveStep((prevActiveStep) => +prevActiveStep + 1);
              }
            } else {
              toast.warn("Staking thất bại!!!");
            }
          });
      } else {
        console.log("no chay cai nay");
        await contract.methods
          .withdrawReward(props.currentItem.id)
          .send({ from: account, gas: "300000" }, function (err, res) {
            if (res) {
              toast.success("Nhận Reward thành công!!!");
              console.log(res);
              setAmount(0);
              props.setShowModal(false);
              setActiveStep((prevActiveStep) => +prevActiveStep + 1);
            } else {
              toast.warn("Nhận Reward thất bại!!!");
            }
          });
      }
    } else {
      toast.warn("Bạn chưa thể đủ thời gian để nhận mốc này!");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    async function fetchData() {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }

      let indexs = await contract.methods
        .getUserReward(account, props.currentItem.id)
        .call();
      let currentUnlocks = await contract.methods
        .getTotalUnblock(account, props.currentItem.id)
        .call();

      let getTimeSuccessReward = await contract.methods
        .getTimeSuccessReward(account, props.currentItem.id)
        .call();
      console.log(
        "getTimeSuccessReward",
        +currentUnlocks,
        +props.currentItem.time / +props.currentItem.timeUnlock - 2
      );

      if (+currentUnlocks === 1) {
        setActiveStep((prevActiveStep) => +prevActiveStep + 1);
      }
      console.log("getUnblock", currentUnlocks);
      setTimeUnlock(getTimeSuccessReward[currentUnlocks]);
      setCurrentUnlock(currentUnlocks);
      setCurrentReward(indexs);
    }
    // console.log(contractStakingETH, account);
    contractStakingETH && fetchData();
  }, [
    account,
    contractStakingBSC,
    contractStakingETH,
    network,
    props.currentItem.id,
    props.currentItem.time,
    props.currentItem.timeUnlock,
  ]);

  const stakeTokens = async () => {
    console.log("value", amount);
    if (!amount) {
      toast.warn("Không thể staking giá trị 0");
    } else {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }
      let stake = amount * 1000000000000000000;
      let rStake = priceETH;
      let rReward = priceDAK * 1000000000000000000;
      setAmount(null);
      console.log("ti gia", stake, rStake, rReward, props.currentItem.id);
      account
        ? await contract.methods
            .createStake(
              stake.toString(),
              props.currentItem.id,
              rStake.toString(),
              rReward.toString()
            )
            .send(
              { from: account, value: stake, gas: "300000" },
              function (err, res) {
                if (res) {
                  toast.success("Staking thành công!!!");
                  setAmount(0);
                  props.setShowModal(false);
                } else {
                  toast.warn("Staking thất bại!!!");
                  props.setShowModal(false);
                }
              }
            )
        : toast.warn("Vui lòng đăng nhập để thực hiện chức năng này!");
    }
  };

  const renderReward = () => {
    return (
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Reward"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Chúc mừng</Typography>
            Bạn đã nhận hết coin thưởng và coin stake
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <>
      <div className="meta__modal">
        <div className="meta__modal-header flex ">
          <h4>{props.currentStatus === "view" ? "Chi tiết" : "Reward"}</h4>
          <AiFillCloseCircle
            className="header-icon"
            onClick={() => props.setShowModal(false)}
          />
        </div>
        {props.currentStatus === "view" ? (
          <div className="meta__modal-body">
            <div className=" meta__modal-body-item">
              <div className=" meta__modal-body-item">
                <div style={{ marginLeft: "12px", textAlign: "center" }}>
                  <p>
                    <b>Thời gian hoàn thành stake</b>
                  </p>

                  <b>{props.currentItem.status}</b>
                </div>
              </div>
              <div className="flex">
                <img
                  src={
                    props.currentItem.typeCoin === "ETH"
                      ? "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"
                      : "https://i.pinimg.com/564x/9d/da/7b/9dda7b9b586a0ea8ee40ae978005d9fb.jpg"
                  }
                  alt=""
                />
                <div>
                  <p>Số lượng Staked {props.currentItem.typeCoin} của bạn</p>
                  <p>
                    <b>{props.currentItem.balanceStaking} ETH</b>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex meta__modal-body-item">
              <div className="flex">
                <img
                  src="https://test.dakshow.com.vn/themes/white/images/dak.png?ossn_cache=8b4828e8"
                  alt=""
                />
                <div>
                  <p>DAK thưởng</p>
                  <p>
                    <b>{props.currentItem.balanceReward} DAK</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : props.currentItem.status === "Chưa staking" ? (
          <div className="meta__modal-body-stake">
            <div className="body-stake flex-wrap">
              <div>
                <p style={{ fontWeight: "bold" }}>
                  Nhập số lượng coin {props.currentItem.typeCoin} (
                  {props.currentItem.typeCoin})
                </p>
                <input
                  type="text"
                  placeholder="Nhập lượng coin"
                  name="select-profession"
                  id="select-profession"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="body-stake flex-wrap">
              <div>
                <p style={{ fontWeight: "bold" }}>
                  Giá USDT/{props.currentItem.typeCoin} hiện tại (USD):
                </p>
                <input
                  type="number"
                  placeholder={`Nhập tỉ giá USDT/${props.currentItem.typeCoin}`}
                  name="select-profession"
                  id="select-profession"
                  value={priceETH}
                  onChange={(e) => {
                    setPriceETH(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="body-stake flex-wrap">
              <div>
                <p style={{ fontWeight: "bold" }}>
                  Giá USDT/DAK hiện tại (USD):
                </p>
                <input
                  type="number"
                  placeholder={`Nhập tỉ giá USDT/DAK`}
                  name="select-profession"
                  id="select-profession"
                  value={priceDAK}
                  onChange={(e) => {
                    setPriceDAK(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <p
                className="btn-cancel"
                onClick={() => props.setShowModal(false)}
              >
                Cancel
              </p>
              <p className="btn-stake" onClick={() => stakeTokens()}>
                Stake
              </p>
            </div>
            <p className="modal__des">
              *The stake can be stake out after expiration of the time
            </p>
          </div>
        ) : (
          renderReward()
        )}
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        onClick={() => props.setShowModal(false)}
      ></div>
    </>
  );
}
