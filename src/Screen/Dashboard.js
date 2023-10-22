import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { state } = useLocation();
  const [myMoneyVal, setMyMoneyVal] = useState(0);
  const [myName, setMyName] = useState("");
  const [friendMoneyVal, setFriendMoneyVal] = useState(0);
  const [friendName, setFriendName] = useState("");

  // 비율 계산
  const totalMoney = myMoneyVal + friendMoneyVal;
  const myRatio = totalMoney !== 0 ? myMoneyVal / totalMoney : 0.5;
  const friendRatio = totalMoney !== 0 ? friendMoneyVal / totalMoney : 0.5;

  // 동적 크기 설정
  const mySize = `${Math.max(myRatio * 60, 20)}vw`; // 최소 크기를 20vw로 설정
  const friendSize = `${Math.max(friendRatio * 60, 20)}vw`;

  console.log(myRatio * 80);
  // 동적 폰트 크기 설정
  const myFontSize = `${Math.max(myRatio * 100, 40)}px`; // 최소 폰트 크기를 40px로 설정
  const friendFontSize = `${Math.max(friendRatio * 80, 40)}px`;

  const MyCircle = styled(motion.div)`
    width: ${mySize};
    height: ${mySize};
    font-size: ${myFontSize};
    background-color: #7eb77f;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    overflow: hidden;
    margin-right: 20px;
  `;

  const FriendCircle = styled(motion.div)`
    width: ${friendSize};
    height: ${friendSize};
    font-size: ${friendFontSize};
    background-color: #212121;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #7eb77f;
    font-weight: 700;
    overflow: hidden;
    margin-left: 20px;
  `;
  const getMyMoneyVal = async () => {
    const userData = {
      userId: sessionStorage.getItem("userId"),
      keyDate: state,
    };
    try {
      const myMoneyResponse = await axios.post("/money/my", userData);
      setMyMoneyVal(myMoneyResponse.data["moneyVal"]);
      setMyName(myMoneyResponse.data["name"]);

      const friendMoneyResponse = await axios.post("/money/friend", userData);
      setFriendMoneyVal(friendMoneyResponse.data["moneyVal"]);
      setFriendName(friendMoneyResponse.data["name"]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (state) getMyMoneyVal();
  }, [state]);

  return (
    <div style={{ width: "90%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MyCircle
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 2,
            type: "spring",
            stiffness: 100,
          }}
        >
          <div style={{ marginBottom: 10 }}>{myName}</div>
          <div>₩{myMoneyVal}</div>
        </MyCircle>
        <FriendCircle
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 2,
            type: "spring",
            stiffness: 100,
          }}
        >
          <div style={{ marginBottom: 10 }}>{friendName}</div>
          <div>₩{friendMoneyVal}</div>
        </FriendCircle>
      </div>
    </div>
  );
};

export default Dashboard;
