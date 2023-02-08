export function isSameUser(msg, user) {
  return msg.sender._id !== user._id;
}

export function isLastMsg(msg, msgs, i) {
  return (
    msg.sender._id !== msgs[i - 1]?.sender._id &&
    msg.sender._id === msgs[i + 1]?.sender._id
  );
}

export function isFirstMsg(msg, msgs, i) {
  return (
    msg.sender._id !== msgs[i + 1]?.sender._id &&
    msg.sender._id === msgs[i - 1]?.sender._id
  );
}
export function isSingleMsg(msg, msgs, i) {
  return (
    msg.sender._id !== msgs[i + 1]?.sender._id &&
    msg.sender._id !== msgs[i - 1]?.sender._id
  );
}
