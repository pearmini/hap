export default function (node) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery();
    query
      .select(node)
      .fields({node: true, size: true})
      .exec((res) => {
        const canvas = res[0].node;
        resolve(canvas);
      });
  });
}
