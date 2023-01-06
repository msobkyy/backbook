import styles from "./Stories.module.css";

export default function Story({ story }) {
  return (
    <div className={styles.story}>
      <img src={story.image} alt="" className={styles.story_img} />
      <div className={styles.story_profile_pic}>
        <img src={story.profile_picture} alt="" />
      </div>
      <div className={styles.story_profile_name}>{story.profile_name}</div>
    </div>
  );
}
