import { useState, useEffect } from "react";

export const CountButton = () => {
  const [count, setCount] = useState<number>(0);
  const handleClick = () => {
    setCount((prev: number) => prev + 1);
  };
  // useEffect(() => {
  //     console.log('Counter mounted:', new Date().toLocaleTimeString());
  //   }, []);
  return (
    <>
      <button onClick={handleClick} >ボタンを押してください！</button>
      <p>現在押された回数は{count}回です！</p>
    </>
  );
};
