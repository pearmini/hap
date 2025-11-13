export const cls = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
