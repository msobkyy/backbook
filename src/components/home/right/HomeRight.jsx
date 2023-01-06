import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import styles from "./HomeRight.module.css";

function HomeRight({ user }) {
  const color = "#65676b";

  return (
    <div className={styles.right_home}>
      <div className={styles.heading}>Sponsored</div>
      <div className={styles.splitter}></div>
      <div className="contacts_wrap">
        <div className={styles.contacts_header}>
          <div className={styles.contacts_header_left}>Contacts</div>
          <div className={styles.contacts_header_right}>
            <div className={`${styles.contact_circle} hover1`}>
              <NewRoom color={color} />
            </div>
            <div className={`${styles.contact_circle} hover1`}>
              <Search color={color} />
            </div>
            <div className={`${styles.contact_circle} hover1`}>
              <Dots color={color} />
            </div>
          </div>
        </div>
        <div className={styles.contacts_list}>
          <Contact user={user} />
        </div>
      </div>
    </div>
  );
}

export default HomeRight;
