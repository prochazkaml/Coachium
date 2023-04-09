/*
 * Coachium - js/renderer/icons.js
 * - provides parametric icons for drawing to the canvas
 * 
 * Copyright (C) 2021-2023 Michal Procházka
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * draw_rounded_rect(ctx, x, y, w, h, r)
 * 
 * Draws a rounded rectangle to a given context.
 */

function draw_rounded_rect(ctx, x, y, w, h, r) {
	ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
	ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
	ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
	ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
	ctx.lineTo(x, y + r);
}

/*
 * draw_key(ctx, x, y, text)
 * 
 * Draws a computer keyboard key with the given text.
 */

function draw_key(ctx, x, y, text) {
	ctx.save();
	ctx.lineWidth = 5;
	ctx.fillStyle = "lightgray";
	ctx.textAlign = "center";

	ctx.beginPath();
	draw_rounded_rect(ctx, x, y, 80, 40, 5);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "black";
	ctx.font = "bold 20px CoachiumDefaultFont";
	ctx.fillText(text, x + 40, y + 20);

	ctx.restore();
}

/*
 * draw_mouse(ctx, x, y, type)
 * 
 * Draws a computer mouse of a given type:
 * 
 * 0 = left mouse button highlighted
 * 1 = scroll wheel highlighted
 */

function draw_mouse(ctx, x, y, type) {
	ctx.save();
	ctx.lineWidth = 5;
	ctx.fillStyle = "lightgray";

	ctx.beginPath();
	draw_rounded_rect(ctx, x, y, 30, 50, 15);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();

	ctx.moveTo(x + 15, y);
	ctx.lineTo(x + 15, y + 25);

	ctx.moveTo(x, y + 25);
	ctx.lineTo(x + 30, y + 25);

	ctx.stroke();

	if(type == 0) {
		ctx.fillStyle = "red";

		ctx.beginPath();

		ctx.moveTo(x + 15, y);
		ctx.lineTo(x + 15, y + 25);
		ctx.lineTo(x, y + 25);
		ctx.lineTo(x, y + 15);
		ctx.arc(x + 15, y + 15, 15, Math.PI, Math.PI * 1.5);

		ctx.fill();
		ctx.stroke();
	}

	ctx.lineWidth = 3;
	ctx.fillStyle = (type == 1) ? "red" : "lightgray";

	ctx.beginPath();
	draw_rounded_rect(ctx, x + 11, y + 6, 8, 15, 4);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

/*
 * draw_arrow(ctx, x, y, l, lh, dir, lw)
 * 
 * Draws an arrow according to the given direction:
 * 
 * 0 = up
 * 1 = right
 * 2 = down
 * 3 = left
 */

function draw_arrow(ctx, x, y, l, lh, dir, lw = 5) {
	ctx.lineWidth = lw;
	ctx.beginPath();
	ctx.moveTo(x, y);
	
	switch(dir) {
		case 0: ctx.lineTo(x, y - l); ctx.moveTo(x - lh, y - l + lh); ctx.lineTo(x, y - l); ctx.lineTo(x + lh, y - l + lh); break;
		case 1: ctx.lineTo(x + l, y); ctx.moveTo(x + l - lh, y - lh); ctx.lineTo(x + l, y); ctx.lineTo(x + l - lh, y + lh); break;
		case 2: ctx.lineTo(x, y + l); ctx.moveTo(x - lh, y + l - lh); ctx.lineTo(x, y + l); ctx.lineTo(x + lh, y + l - lh); break;
		case 3: ctx.lineTo(x - l, y); ctx.moveTo(x - l + lh, y - lh); ctx.lineTo(x - l, y); ctx.lineTo(x - l + lh, y + lh); break;
	}

	ctx.stroke();
}

/*
 * draw_plus(ctx, x, y, l, lw)
 * 
 * Draws a plus sign. (What a surprise.)
 */

function draw_plus(ctx, x, y, l, lw = 5) {
	l /= 2;

	ctx.lineWidth = lw;
	ctx.beginPath();

	ctx.moveTo(x - l, y);
	ctx.lineTo(x + l, y);

	ctx.moveTo(x, y - l);
	ctx.lineTo(x, y + l);

	ctx.stroke();
}
