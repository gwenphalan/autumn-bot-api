import Canvas from 'canvas';

export const labelCanvas = async (canvas: Canvas.Canvas, label: string, fontSize: number, font: string, margin?: number) => {
	const ctx = canvas.getContext('2d');

	const a = margin ? margin * 2 : 20;

	ctx.strokeStyle = '#FFF';
	ctx.fillStyle = '#FFF';

	const b = applyText(canvas, label, font, fontSize, canvas.width);
	ctx.font = b.font;

	ctx.font = b.font;

	ctx.shadowColor = '#545454';
	ctx.shadowBlur = 7;

	ctx.strokeStyle = '#FFF';
	ctx.fillStyle = '#FFF';
	roundRect(
		ctx,
		(canvas.width - ctx.measureText(label).width + a) / 2,
		-canvas.height + b.size + a,
		ctx.measureText(label).width + a,
		canvas.height,
		25,
		true,
		true
	);

	ctx.shadowBlur = 0;

	ctx.strokeStyle = '#000';

	ctx.textAlign = 'center';
	ctx.fillStyle = '#000';
	ctx.fillText(label, canvas.width / 2 + a, b.size + a / 2, ctx.measureText(label).width);

	return canvas.toBuffer();
};

export const applyText = (canvas: Canvas.Canvas, text: string, font: string, fontSize: number, width: number) => {
	const ctx = canvas.getContext('2d');

	let x = fontSize;

	do {
		ctx.font = `${(x -= 1)}pt "${font}"`;
	} while (ctx.measureText(text).width > width);

	return {
		font: ctx.font,
		size: x
	};
};

export const roundRect = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius?: number,
	fill?: boolean,
	stroke?: boolean
) => {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	if (fill) {
		ctx.fill();
	}
	ctx.clip();
};
