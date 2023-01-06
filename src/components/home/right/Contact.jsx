import styles from "./HomeRight.module.css";

export default function Contact({ user }) {
  return (
    <div className={`${styles.contact} hover3`}>
      <div className={styles.contact_img}>
        <img src={user.photo} alt="" />
      </div>
      <span>
        {user.first_name} {user.last_name}
      </span>
    </div>
  );
}
