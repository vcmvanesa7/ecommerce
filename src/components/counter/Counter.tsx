"use client";
import { useState } from "react";
import styles from "./Counter.module.css";

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className={styles.counter}> 
      <h2 className={styles.counterTitle}>Counter: {count}</h2>
      <button onClick={decrement} className={styles.counterButton}>-</button>
      <button onClick={increment} className={styles.counterButton}>+</button>
    </div>
  );
}
