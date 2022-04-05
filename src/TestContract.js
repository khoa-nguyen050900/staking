import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MySVG from "./SVG.jsx";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { Staking } from "./abi.js";
import moment from "moment";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

export default function TestContract() {
  const { Moralis, user } = useMoralis();
  const account = useSelector((state) => state.wallet.account);

  const network = useSelector((state) => state.wallet.network);
  const contractStakingETH = useSelector(
    (state) => state.wallet.contractStakingETH
  );
  const contractStakingBSC = useSelector(
    (state) => state.wallet.contractStakingBSC
  );

  const [time, setTime] = useState(30);
  const [balance, setBalance] = useState(0);
  const [timeStaking, setTimeStaking] = useState(0);
  const [reward, setReaward] = useState(0);
  const [balanceOf, setBalanceOf] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  const [stakingCoin, setStakingCoin] = useState(0);
  const [token, setToken] = useState(network);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       let contract;
//       console.log("reload");
//       setToken(network);
//       if (network === "rinkeby") {
//         contract = contractStakingETH;
//         await axios
//           .get(
//             `https://deep-index.moralis.io/api/v2/${account}/balance?chain=rinkeby`,
//             {
//               headers: {
//                 "X-API-KEY":
//                   "UM6LE6sOG8KUrQ9maYP3pRgbTQ6TRcGoguzYuSCKbYdNLrssUzGWY4NaX0GvKdaQ",
//                 accept: "application/json",
//               },
//             }
//           )
//           .then((value) => {
//             const gweiValue = ethers.utils.formatUnits(value.data.balance, 18);
//             console.log("eth", gweiValue);
//             setBalance(gweiValue);
//           });
//       } else {
//         contract = contractStakingBSC;
//         await axios
//           .get(
//             `https://deep-index.moralis.io/api/v2/${account}/balance?chain=bsc%20testnet`,
//             {
//               headers: {
//                 "X-API-KEY":
//                   "UM6LE6sOG8KUrQ9maYP3pRgbTQ6TRcGoguzYuSCKbYdNLrssUzGWY4NaX0GvKdaQ",
//                 accept: "application/json",
//               },
//             }
//           )
//           .then((value) => {
//             const gweiValue = ethers.utils.formatUnits(value.data.balance, 18);
//             console.log("bsc", gweiValue);
//             setBalance(gweiValue);
//           });
//       }

    //   let balanceOfs = await contract.methods.balanceOf(account).call();
    //   let rewards = await contract.methods.getReward(account).call();
    //   let stakingToken = await contract.methods.getBalance(account).call();
    //   let timeStakings = await contract.methods.getTimeStaking(account).call();
    //   console.log();
    //   setTimeStamp(timeStakings);
    //   let dateTimeString = moment
    //     .unix(timeStakings && timeStakings)
    //     .format("DD-MM-YYYY HH:mm:ss");
    //   const gweiValue = ethers.utils.formatUnits(stakingToken, 18);
    //   const gweiValueReward = ethers.utils.formatUnits(rewards, 18) * 100;
    //   const gweiValueDak = ethers.utils.formatUnits(balanceOfs, 18) * 100;
    //   setBalanceOf(gweiValueDak);
    //   if (+timeStakings === 0) {
    //     setTimeStaking("Chưa staking");
    //   } else {
    //     setTimeStaking(dateTimeString);
    //   }
//       setBalanceOf(gweiValueDak);
//       setReaward(gweiValueReward);
//       setStakingCoin(gweiValue);
//     }
//     // console.log(contractStakingETH, account);
//     (contractStakingBSC || contractStakingETH) && account && fetchData();
//   }, [contractStakingETH, contractStakingBSC, account, network, status]);

  const stakeTokens = async () => {
    console.log("value", value);
    if (!value) {
      toast.warn("Không thể staking giá trị 0");
    } else {
      let contract;
      if (network === "rinkeby") {
        contract = contractStakingETH;
      } else {
        contract = contractStakingBSC;
      }
      toast.success("Bắt đầu staking!!!");
      let amount = value * 10000000000000000;
      await contract.methods
        .createStake(value, time)
        .send(
          { from: account, value: amount, gas: "300000" },
          function (err, res) {
            if (res) {
              toast.success("Staking thành công!!!");
              console.log(res);
            } else {
              toast.warn("Staking thất bại!!!");
            }
            setValue("");
            setStatus(!status);
          }
        );
    }
  };

  //   const unstakeTokens = (amount) => {
  //     setLoading(true);
  //     contractStakingETH.methods
  //       .removeStake()
  //       .send({ from: account })
  //       .on("transactionHash", (hash) => {
  //         setLoading(false);
  //       });
  //   };

  const withdraw = async () => {
    let contract;
    if (network === "rinkeby") {
      contract = contractStakingETH;
    } else {
      contract = contractStakingBSC;
    }
    if (Date.now() > +timeStamp) {
      await contract.methods.withdrawReward().send(
        {
          from: account,
          gas: "300000",
        },
        function (err, res) {
          setStatus(!status);
        }
      );
    } else {
      toast.warn("Chưa đủ thời gian staking!!!");
    }
  };

  console.log(Date.now());
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center ">
          <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-sm rounded overflow-hidden  shadow-lg m-auto mt-6 text-center">
          <p className="font-bold text-xl mb-2">Token Staking:</p>
          <div className="flex justify-around mb-2">
            <button
              className={
                "bg-yellow-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              }
              onClick={() => setToken("rinkeby")}
            >
              {token === "rinkeby" ? "ETH" : "BSC"}
            </button>
          </div>
          <div className="flex justify-around mb-2">
            <button
              className={
                time === 30
                  ? "bg-yellow-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              }
              onClick={() => setTime(30)}
            >
              30 giây
            </button>
            <button
              className={
                time === 60
                  ? "bg-yellow-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              }
              onClick={() => setTime(60)}
            >
              60 giây
            </button>
            <button
              className={
                time === 90
                  ? "bg-yellow-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              }
              onClick={() => setTime(90)}
            >
              90 giây
            </button>
          </div>
          <div className="font-bold text-xl mb-2">
            Staking Balance: {account && stakingCoin ? stakingCoin : 0}
            {network === "rinkeby" ? "ETH" : "BNB"}
          </div>
          <div className="font-bold text-xl mb-2">
            Reward Balance: {reward && reward} DAK
          </div>

          <p className="font-bold text-l mb-2">
            Thời gian hoàn thành staking: {timeStaking}
          </p>
          <p className="text-l mb-2">
            *1 đơn vị khi nhập bằng 0.01 {network === "rinkeby" ? "ETH" : "BNB"}
          </p>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              Balance {network === "rinkeby" ? "ETH" : "BNB"} :{" "}
              {balance && balance}
              {network === "rinkeby" ? "ETH" : "BNB"}
            </div>{" "}
            <div className="font-bold text-xl mb-2">
              Balance Reward: {balanceOf && balanceOf} DAK
            </div>
            <div className="font-bold text-l mb-2 flex">
              <span>Nhập số coin</span>
              <input
                className="appearance-none bg-transparent border-black py-2 px-4 rounded w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Amount"
                aria-label="Number Coin"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-around">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  stakeTokens();
                }}
              >
                STAKE!
              </button>
              <button
                className="bg-yellow-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  if (timeStaking === "Chưa staking") {
                    toast.warn("Bạn chưa staking!!!");
                  } else {
                    withdraw();
                  }
                }}
              >
                Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// npx truffle console
// stechToken = await StechToken.deployed() // deployed stechToken
// accounts = await web3.eth.getAccounts() // call account to ganache
// balance = await stechToken.balanceOf(accounts[1]) // Tài khoản nhận toàn bộ số coin là tài khoản thứ 2 trong Ganache
// balance.toString()
// formattedBalance = web3.utils.fromWei(balance)

// npx truffle exec scripts/issue-token.js // Tạo token thưởng
