export default function(func) {
  return function(arg) {
    return new Promise((resolve, reject) => {
      func({
        ...arg,
        success: resolve,
        fail: reject,
      });
    });
  };
}
