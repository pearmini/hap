export default (foo) => {
  return (options) => {
    return new Promise((resolve, reject) => {
      foo({
        ...options,
        success: resolve,
        fail: reject,
      });
    });
  };
};
