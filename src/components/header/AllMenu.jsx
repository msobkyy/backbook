import { menu, create } from "../../data/allMenu";
import AllMenuItem from "./AllMenuItem";
import styles from "./AllMenu.module.css";

export default function AllMenu() {
  return (
    <div className={styles.all_menu}>
      <div className={styles.all_menu_header}>Menu</div>
      <div className={`${styles.all_menu_wrap} scrollbar`}>
        <div className={styles.all_left}>
          <div className={styles.all_menu_search}>
            <i className="amm_s_ic"></i>
            <input type="text" placeholder="Search Menu" />
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>Social</div>
            {menu.slice(0, 6).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>Entertainment</div>
            {menu.slice(6, 9).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>Shopping</div>
            {menu.slice(9, 11).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>Personal</div>
            {menu.slice(11, 15).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>Professional</div>
            {menu.slice(15, 17).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>
              Community Resources
            </div>
            {menu.slice(17, 21).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className={styles.all_menu_group}>
            <div className={styles.all_menu_group_header}>More from Meta</div>
            {menu.slice(21, 23).map((item, i) => (
              <AllMenuItem
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className={styles.all_right}>
          <div className={styles.all_right_header}>Create</div>
          {create.map((item, i) => (
            <div className={`${styles.all_right_item} hover1`} key={i}>
              <div className={styles.all_right_circle}>
                <i className={item.icon}></i>
              </div>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
