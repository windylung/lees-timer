import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./mypage-style.css";
import {
  createBlurHandler,
  createFocusHandler,
  createHandler,
} from "./handeler";
import { Navigate, useNavigate } from "react-router-dom";

export const MyPage = () => {
  const [weekDates, setWeekDates] = useState([]);
  const [formattedDate, setFormattedDate] = useState();
  const [targetWeekValue, setTargetWeekValue] = useState(Array(7).fill(0));
  const [totalTargetVal, setTotalTargetVal] = useState(0);
  const [totalActualVal, setTotalActualVal] = useState(0);
  const [actualWeekValue, setActualWeekValue] = useState(Array(7).fill(0));
  const [isChange, setIsChange] = useState(false);
  const [moneyVal, setMoneyVal] = useState(0);
  const moneyPerHour = 12000;
  const maxHourPerDay = 12;
  const navigate = useNavigate();
  const navigateToDashBoard = () => {
    navigate("/dashBoard", { state: formattedDate });
  };
  // 저장 가능한지 확인
  const valSaveTargetWeekValue = () => {
    if (totalTargetVal < 39) {
      return Swal.fire("", "주 목표 시간은 39시간 이상입니다", "error");
    } else if (targetWeekValue.some((value) => value > maxHourPerDay)) {
      return Swal.fire(
        "",
        `하루 목표 시간은 ${maxHourPerDay}시간을 초과할 수 없습니다.`,
        "error"
      );
    } else if (!isChange) {
      return null;
    } else return saveTargetWeekValue();
  };

  const handleChange = createHandler(setTargetWeekValue);
  const handleFocus = createFocusHandler(setTargetWeekValue);
  const handleBlur = createBlurHandler(setTargetWeekValue);

  // 이번 주 날짜 가져오기
  const getWeekDates = () => {
    const now = new Date();
    const today = now.getDay();
    const monday = new Date(now);

    // 만약 오늘이 일요일이라면, (today === 0)
    if (today === 0) {
      monday.setDate(monday.getDate() - 6); // 지난 주 월요일로 설정
    } else {
      monday.setDate(monday.getDate() - (today - 1)); // 이번 주 월요일로 설정
    }

    const dates = [];

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(monday);
      newDate.setDate(monday.getDate() + i);
      dates.push(newDate);
    }

    return dates;
  };

  // weekDates에서 첫 번째 keyDate 가져오기 (형식 변환)
  const getKeyDate = () => {
    // dates 배열에서 첫 번째 Date 객체를 가져옵니다.
    const date = weekDates[0];
    // 년, 월, 일을 각각 추출합니다.
    const year = date.getFullYear().toString(); // 년도의 마지막 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월
    const day = date.getDate().toString().padStart(2, "0"); // 일

    // yyymmdd 형태의 문자열로 만듭니다.
    const formattedDate = `${year}${month}${day}`;

    return formattedDate;
  };

  // 기존 TargetWeekValue & Acutual 가져오기
  const getWeekValue = async () => {
    const formattedDate = getKeyDate();
    const userData = {
      userId: sessionStorage.getItem("userId"),
      keyDate: formattedDate,
    };
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    console.log(formattedDate);
    await axios
      .post("/api/get/target", userData)
      .then((response) => {
        // console.log(response.status, response.data);
        setTargetWeekValue(days.map((day) => response.data[day]));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    await axios
      .post("/api/get/actual", userData)
      .then((response) => {
        setActualWeekValue(days.map((day) => response.data[day]));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  // 입력한 TargetWeekValue 저장하기
  const saveTargetWeekValue = async () => {
    const targetWeekValueObjct = {
      monday: targetWeekValue[0],
      tuesday: targetWeekValue[1],
      wednesday: targetWeekValue[2],
      thursday: targetWeekValue[3],
      friday: targetWeekValue[4],
      saturday: targetWeekValue[5],
      sunday: targetWeekValue[6],
    };

    const userData = {
      userId: sessionStorage.getItem("userId"),
      keyDate: formattedDate,
      weekList: targetWeekValueObjct,
    };

    try {
      axios
        .post("/api/save", userData)
        .then((response) => {
          Swal.fire("", "저장되었습니다", "success");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    } catch (error) {
      console.error("There was an error calling the API", error);
    }
  };

  function calMoneyVal() {
    // 결과를 저장할 변수 초기화
    let sumOfDifferences = 0;

    // 두 배열의 길이가 다르면 오류 반환
    if (targetWeekValue.length !== actualWeekValue.length) {
      return "Error: Arrays have different lengths";
    }

    // 배열을 순회하면서 차이를 계산하고 합산
    for (let i = 0; i < targetWeekValue.length; i++) {
      const difference = targetWeekValue[i] - actualWeekValue[i];
      if (difference > 0) sumOfDifferences += difference;
    }

    return sumOfDifferences * moneyPerHour;
  }

  // 1. 이번 주 날짜 가져오기
  // 2. keyDate 가져오기
  // 3. 기존 targetWeekValue 가져오기  (keyDate 필요)
  // 3-1. 입력된 actualWeekValue 있다면 > 가져오기
  // 4. targetWeekValue 총 합 계산하기
  // 4-1. acutalValue 총 합 계산하기

  useEffect(() => {
    const dates = getWeekDates();
    setWeekDates(dates);
  }, []);

  useEffect(() => {
    if (weekDates[0] !== undefined) {
      setFormattedDate(getKeyDate());
    }
  }, [weekDates]);

  useEffect(() => {
    if (formattedDate) {
      getWeekValue();
    }
  }, [formattedDate]);

  // targetWeekValue > targetWeekValue 총합 가져오기
  useEffect(() => {
    setTotalTargetVal(
      targetWeekValue.reduce((acc, current) => acc + Number(current), 0)
    );
  }, [targetWeekValue]);

  useEffect(() => {
    setTotalActualVal(
      actualWeekValue.reduce((acc, current) => acc + Number(current), 0)
    );
  }, [actualWeekValue]);

  useEffect(() => {
    setMoneyVal(calMoneyVal());
  }, [totalActualVal, totalTargetVal]);

  // Target은 39보다 크거나 같음
  // AcutalVar는 39보다 작으면 -> 그 차이만큼 벌금
  // 벌금은 시간 * 12000원으로 산출
  return (
    <div>
      <div className="date-frame">
        {weekDates.map((date, index) => (
          <span className="date-text" key={index}>
            {date.getDate()}
          </span>
        ))}
      </div>
      <div className="week-frame">
        <div className="input-frame">
          {targetWeekValue.map((value, index) => (
            
            <input
              readOnly={true}
              key={index}
              value={value}
              onChange={(e) => {
                handleChange(e, index);
                setIsChange(true);
              }}
              onFocus={(e) => handleFocus(e, index)}
              onBlur={(e) => handleBlur(e, index)}
              className="input"
            />
          ))}
        </div>
        <div className="total-frame">{totalTargetVal}</div>
      </div>

      <div className="week-frame">
        <div className="input-frame-2">
          {actualWeekValue.map((value) => (
            <div className="input-2">{value}</div>
          ))}
        </div>
        <div className="total-frame-2">{totalActualVal}</div>
      </div>

      <div className="money-frame">
        <button
          className={isChange ? "save-button-active" : "save-button-nonactive"}
          onClick={() => {
            valSaveTargetWeekValue();
          }}
        >
          SAVE
        </button>
        <div>
          <button className="momey-button" onClick={navigateToDashBoard}>
            ₩{moneyVal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
