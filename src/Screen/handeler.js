export const createHandler = (setValues) => (e, index) => {
    console.log(e)
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = e.target.value;
      return newValues;
    });
  };

  export const createFocusHandler = (setValues) => (e, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      if (newValues[index] === 0) {
        newValues[index] = "";
      }
      return newValues;
    });
  };

  export const createBlurHandler = (setValues) => (e, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      if (newValues[index] === "") {
        newValues[index] = 0;
      }
      return newValues;
    });
  };