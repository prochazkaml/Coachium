/*
 * Coachium - node/compress.node.js
 * - node program which will take all of the required files & bundle them into a single data file
 * 
 * THIS IS A NODE PROGRAM, ONLY MEANT TO RUN ONCE UPON VERSION!
 * DO NOT RUN THIS IN A BROWSER!
 * 
 * Copyright (C) 2021-2022 Michal Procházka
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

import { readFileSync, writeFileSync } from 'fs';

if(!process.argv[2]) {
	console.log("Usage: node node/compress.node.js <dest_dir>");
	process.exit(1);
}

// LZString library (sorry)

var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

// Load index.html

const index = readFileSync("index.html").toString().split("\n");

// Search for special tags (CSS/JS includes)

function extract(string, start, end) {
	const _start = string.indexOf(start) + start.length;
	const _end = string.substring(_start).indexOf(end) + _start;
	return {
		text: string.substring(_start, _end),
		start: _start,
		end: _end
	};
}

// Separate the body & head

var split = {
	body: [],
	head: []
}, mode = "";

for(var i = 0; i < index.length; i++) {
	const line = index[i];

	if(line.includes("</body>") || line.includes("</head>")) {
		mode = "";
	}

	if(mode) split[mode].push(line + "\n");

	if(line.includes("<body>")) {
		mode = "body";
	} else if(line.includes("<head>")) {
		mode = "head";
	}
}

function run(lines) {
	var output = "", scripts = [];

	for(var i = 0; i < lines.length; i++) {
		const line = lines[i];

		if(line.includes("<link rel=\"stylesheet\" ")) {
			// CSS link found - replace it with a <style> pair tag

			const filename = extract(line, "href=\"", "\" />").text;
			const css = readFileSync(filename).toString();

			output += "<style>\n";

			// Parse the CSS and search for url() tags

			const csslines = css.split("\n");

			for(var j = 0; j < csslines.length; j++) {
				const cssline = csslines[j];
				
				if(cssline.includes("url(\"")) {
					const filename = "css/" + extract(cssline, "url(\"", "\")").text;
					var ext = filename.split(".");
					ext = ext[ext.length - 1];

					const file = readFileSync(filename, { encoding: "base64" });

					switch(ext) {
						case "woff2":
							output += "url(data:font/woff2;base64," + file + ") format(\"woff2\");\n";
							break;

						case "webp":
							output += "url(data:image/webp;base64," + file + ");\n";
							break;

						default:
							console.log("ERROR: Unhandled data format: " + ext);
							process.exit(1);
					}

					console.log("Embedded CSS asset: " + filename);
				} else {
					output += cssline.trim(); + "\n";
				}
			}

			output += "</style>\n";

			console.log("Embedded stylesheet: " + filename);
		} else if(line.includes("<link rel=\"icon\" ")) {
			// Favicon found - embed in into base64
		
			const filename = extract(line, "href=\"", "\" />").text;
			const icon = readFileSync(filename, { encoding: "base64" });

			output += "<link rel=\"icon\" href=\"data:image/x-icon;base64," + icon + "\" />\n";

			console.log("Embedded favicon: " + filename);
		} else if(line.includes("<script src=\"")) {
			// JS include found - replace it with a <script> pair tag containing the script

			const filename = extract(line, "src=\"", "\">").text;
			const js = readFileSync(filename).toString();

			const jslines = js.split("\n");

			var script = "";

			for(var j = 0; j < jslines.length; j++) {
				script += jslines[j].trim() + "\n"; // Newlines are needed here, due to single-line comments (which would comment out the whole script)
			}

			scripts.push(script);

			console.log("Embedded script: " + filename);
		} else if(line.includes("<img src=\"")) {
			// Image found - embed it into base64

			const extr = extract(line, "<img src=\"", "\"");
			var ext = extr.text.split(".");
			ext = ext[ext.length - 1];

			const file = readFileSync(extr.text).toString();

			switch(ext) {
				case "svg":
					output += line.substring(0, extr.start) + "data:image/svg+xml," + encodeURIComponent(file) + line.substring(extr.end) + "\n";
					break;

				default:
					console.log("ERROR: Unhandled data format: " + ext);
					process.exit(1);
			}

			console.log("Embedded image: " + extr.text);
		} else {
			// Plain text, copy the line as-is

			output += line.trim() + "\n";
		}
	}

	if(scripts.length > 0) {
		return {
			js: JSON.stringify(scripts),
			html: output
		};
	} else {
		return {
			html: output
		};
	}
}

for(const entry in split) {
	const output = run(split[entry]);

	if(entry == "head") {
		console.log("Not compressing the head, as it makes no sense (it contains already-compressed binary files, extra compression would be useless + slower to depack).");
		writeFileSync(process.argv[2] + "/" + entry + ".dat", output.html);
		console.log("Head output is " + output.html.length + " bytes long.");
	} else {
		console.log("Compressing " + entry + " output (" + output.html.length + " bytes)...");
		const compressed = LZString.compressToUint8Array(output.html);
		writeFileSync(process.argv[2] + "/" + entry + ".dat", compressed);
		console.log("Done. Compressed " + entry + " output is " + compressed.length + " bytes long.");

		console.log("Compressing scripts output (" + output.js.length + " bytes)...");
		const compressedjs = LZString.compressToUint8Array(output.js);
		writeFileSync(process.argv[2] + "/scripts.dat", compressedjs);
		console.log("Done. Compressed scripts output is " + compressedjs.length + " bytes long.");
	}
}

console.log("All done.");
