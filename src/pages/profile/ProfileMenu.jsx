import { Link } from "react-router-dom";
import { Dots } from "../../svg";
import classes from "./style.module.css";

export default function ProfileMenu() {
  return (
    <div className={classes.profile_menu_wrap}>
      <div className={classes.profile_menu}>
        <Link to="#" className={classes.active}>
          Posts
        </Link>
        <Link to="#" className="hover1">
          About
        </Link>
        <Link to="#" className="hover1">
          Friends
        </Link>
        <Link to="#" className="hover1">
          Photos
        </Link>
      </div>
      <div className={classes.more}>
        <Dots />
      </div>
    </div>
  );
}
