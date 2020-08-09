export default function (node, cb) {
  const query = wx.createSelectorQuery();
  query
    .select(node)
    .fields({node: true, size: true})
    .exec((res) => {
      const canvas = res[0].node;
      cb(canvas);
    });
}
