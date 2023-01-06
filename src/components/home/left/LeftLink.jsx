import styles from "./HomeLeft.module.css";

export default function LeftLink({ img, text, notification }) {
  return (
    <div className={`${styles.left_link} hover2`}>
      <img src={`../../../left/${img}.png`} alt="" />
      {notification !== undefined ? (
        <div className={styles.col}>
          <div className={styles.col_1}>{text}</div>
          <div className={styles.col_2}>{notification}</div>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
