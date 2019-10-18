const map = (value, start, end, min, max) => {
	if(end != value){
		const left = (value - start) / (end - value);
		return (min + left * max) / (1 + left);
	}else{
		return max;
	}
}

const curve = (ctx, data, progress) => {
  ctx.beginPath();
  const type = Math.random() * 5 | 0;
  ctx.save();
  ctx.translate(data.x, data.y);
  if(type > 3){
  	// 画点
  	const r = map(progress, 0, 1, 15, 5);
  	ctx.fillStyle = `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`;
  	ctx.strokeStyle = `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`;
  	ctx.arc(0, 0, r, 0, Math.PI * 2);
  	ctx.fill();
  }else{
  	// 画线
  	const len = map(progress, 0, 1, 40, 5);
  	ctx.lineWidth = map(progress, 0, 1, 15, 5);
  	ctx.lineCap = "round";
  	ctx.strokeStyle = `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`;
  	ctx.rotate(Math.PI * 2 * Math.random());
  	ctx.moveTo(-len, 0);
  	ctx.lineTo(len, 0);
  	ctx.stroke();
  }
  ctx.restore();
}

export { curve }