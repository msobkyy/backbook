import { Plus } from "../../../svg";
import styles from "./Stories.module.css";
import { stories } from "../../../data/home";
import Story from "./Story";
import Card from "../../UI/Card/Card";
import { ScrollContainer } from "react-indiana-drag-scroll";

function Stories() {
  return (
    <Card className={styles.wrap}>
      <ScrollContainer>
        <div className={styles.stories}>
          <div className={styles.create_story_card}>
            <img
              src="../../../images/default_pic.png"
              alt=""
              className={styles.create_story_img}
            />
            <div className={styles.plus_story}>
              <Plus color="#fff" />
            </div>
            <div className={styles.story_create_text}>Create Story</div>
          </div>
          {stories.map((story, i) => (
            <Story story={story} key={i} />
          ))}
        </div>
      </ScrollContainer>
    </Card>
  );
}

export default Stories;
