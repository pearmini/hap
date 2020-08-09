const fs = require('fs');
const exec = require('child_process').exec;
const config = require('./dev.config.js');
const filePath = './src';

bundle();
let lastUpdateTime = 0;
console.log(`🔥 正在监听 ${filePath}`);
fs.watch(filePath, {recursive: true}, (event, filename) => {
  // 防止保存一次触发两次
  const diff = Date.now() - lastUpdateTime;
  lastUpdateTime = Date.now();
  if (diff < 100) return;

  console.log(`🌈 [${event}]: ${filename}`);
  bundle();
});

function bundle() {
  execute('npx webpack', {
    start: '🚀 开始打包...',
    end: '✅ 打包成功！',
    cb: () => {
      config.dist.forEach((d, index, array) => {
        execute(`cp ${config.src} ${d.filePath}`, {
          start: `🚀 开始复制${d.name}...`,
          end: `✅ 复制到${d.name}成功！`,
          cb: () => {
            if (index === array.length - 1) {
              console.log('');
              console.log(`🔥 正在监听 ${filePath}`);
            }
          },
        });
      });
    },
  });
}

function execute(cmd, options) {
  console.log(options.start);
  exec(cmd, () => {
    console.log(options.end);
    options.cb && options.cb();
  });
}
