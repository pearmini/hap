function random(start, end) {
  return start + Math.random() * Math.max(end - start, 0);
}

export {random};
