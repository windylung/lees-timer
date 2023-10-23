import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const Main = () => {
  const onClickLogin = async () => {
    const userData = {
      name: name,
      password: password,
    };
    try {
      axios
        .post("/api/login", userData)
        .then((response) => {
          Swal.fire("", "로그인에 성공하였습니다", "success");

          setIsLogin(true);
          setValues1(response.data.weekList);
          setValues2(response.data.friendWeekList);
        })
        .catch((error) => {
          Swal.fire("", "비밀번호를 다시 확인해주세요", "error");

          console.error("There was an error!", error);
        });
    } catch (error) {
      console.error("There was an error calling the API", error);
    }
  };
  const onClickSave = async () => {
    // dates 배열에서 첫 번째 Date 객체를 가져옵니다.
    const date = weekDates[0];

    // 년, 월, 일을 각각 추출합니다.
    const year = date.getFullYear().toString(); // 년도의 마지막 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월
    const day = date.getDate().toString().padStart(2, "0"); // 일

    // yyymmdd 형태의 문자열로 만듭니다.
    const formattedDate = `${year}${month}${day}`;

    const userData = {
      name: name,
      password: password,
      keyDate: formattedDate,
      weekList: values1,
    };
    try {
      axios
        .post("/api/save", userData)
        .then((response) => {
          console.log(response.status, response.data);
          Swal.fire("", "저장되었습니다", "success");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    } catch (error) {
      console.error("There was an error calling the API", error);
    }
  };

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [weekDates, setWeekDates] = useState([]);
  const [values1, setValues1] = useState(Array(7).fill(0));
  const [values2, setValues2] = useState(Array(7).fill(0));
  const createHandler = (setValues) => (e, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = e.target.value;
      return newValues;
    });
  };

  const createFocusHandler = (setValues) => (e, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      if (newValues[index] === 0) {
        newValues[index] = "";
      }
      return newValues;
    });
  };

  const createBlurHandler = (setValues) => (e, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      if (newValues[index] === "") {
        newValues[index] = 0;
      }
      return newValues;
    });
  };
  const handleChange1 = createHandler(setValues1);
  const handleFocus1 = createFocusHandler(setValues1);
  const handleBlur1 = createBlurHandler(setValues1);

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

  useEffect(() => {
    const dates = getWeekDates();
    setWeekDates(dates);
  }, []);

  // return (
  //   <div
  //     style={{
  //       backgroundColor: "black",

  //       display: "flex",
  //       flexDirection: "column",
  //       alignItems: "center",
  //       height: "100vh", // 이 부분을 추가
  //     }}
  //   >
  //     <div
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "#ffffff4c",
  //         borderRadius: 100,
  //         height: 105,
  //         width: 989,
  //         paddingTop: 10,
  //         paddingRight: 50,
  //         paddingLeft: 50,
  //         paddingBottom: 10,
  //         display: "flex",
  //         justifyContent: "space-around",
  //         marginTop: 120,
  //       }}
  //     >
  //       {weekDates.map((date, index) => (
  //         <span
  //           style={{ fontSize: 45, fontWeight: "bold", color: "white" }}
  //           key={index}
  //         >
  //           {date.getDate()}
  //         </span>
  //       ))}
  //     </div>

  //     <div
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "white",
  //         borderRadius: 100,
  //         height: 105,
  //         width: 989,
  //         padding: "10px 50px",
  //         display: "flex",
  //         justifyContent: "space-around",
  //         overflow: "hidden",
  //         marginTop: 27,
  //       }}
  //     >
  //       {values1.map((value, index) => (
  //         <input
  //           key={index}
  //           value={value}
  //           onChange={(e) => handleChange1(e, index)}
  //           onFocus={(e) => handleFocus1(e, index)}
  //           onBlur={(e) => handleBlur1(e, index)}
  //           style={{
  //             width: 50,
  //             fontSize: 45,
  //             borderWidth: 0,
  //             fontWeight: "bold",
  //             color: value === 0 ? "gray" : "black",
  //             fontFamily:
  //               "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  //           }}
  //         />
  //       ))}
  //     </div>
  //     <div
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "white",
  //         borderRadius: 100,
  //         height: 105,
  //         width: 989,
  //         padding: "10px 50px",
  //         display: "flex",
  //         justifyContent: "space-around",
  //         overflow: "hidden",
  //         marginTop: 27,
  //       }}
  //     >
  //       {values2.map((value) => (
  //         <div
  //           style={{
  //             fontSize: 45,
  //             fontWeight: "bold",
  //             color: "black",
  //           }}
  //         >
  //           {value}
  //         </div>
  //       ))}
  //     </div>

  //     <div
  //       style={{
  //         display: "flex",
  //         flexDirection: "row",
  //         marginTop: 107,
  //         alignSelf: "flex-end",
  //         paddingRight: 280,
  //       }}
  //     >
  //       <div>
  //         <input
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           placeholder="NAME"
  //           style={{
  //             fontSize: 20,
  //             width: 289,
  //             height: 70,
  //             borderRadius: 50,
  //             borderWidth: 0,

  //             paddingLeft: 40, // 오른쪽 패딩을 20px로 설정
  //           }}
  //         ></input>
  //         <input
  //           onChange={(e) => setPassword(e.target.value)}
  //           value={password}
  //           placeholder="KEY"
  //           style={{
  //             fontSize: 20,
  //             width: 289,
  //             height: 70,
  //             borderRadius: 50,
  //             borderWidth: 0,
  //             paddingLeft: 40, // 오른쪽 패딩을 20px로 설정
  //             marginLeft: 21,
  //           }}
  //         ></input>
  //       </div>
  //       <button
  //         style={{
  //           width: 198,
  //           height: 70,
  //           borderRadius: 50,
  //           backgroundColor: "#7EB77F",
  //           fontSize: 20,
  //           color: "white",
  //           fontWeight: "bolder",
  //           marginLeft: 21,
  //           borderWidth: 0,
  //         }}
  //         onClick={() => {
  //           isLogin ? onClickSave() : onClickLogin();
  //         }}
  //       >
  //         {isLogin ? "SAVE" : "LOGIN"}
  //       </button>
  //     </div>
  //   </div>
  // );
  return(
    <div>Main</div>
  )
};
