var r=function(){function h(){}return h.AddUnsigned=function(i,t){var s,x,n,a,d;return n=i&2147483648,a=t&2147483648,s=i&1073741824,x=t&1073741824,d=(i&1073741823)+(t&1073741823),s&x?d^2147483648^n^a:s|x?d&1073741824?d^3221225472^n^a:d^1073741824^n^a:d^n^a},h.FF=function(i,t,s,x,n,a,d){return i=this.AddUnsigned(i,this.AddUnsigned(this.AddUnsigned(this.F(t,s,x),n),d)),this.AddUnsigned(this.RotateLeft(i,a),t)},h.GG=function(i,t,s,x,n,a,d){return i=this.AddUnsigned(i,this.AddUnsigned(this.AddUnsigned(this.G(t,s,x),n),d)),this.AddUnsigned(this.RotateLeft(i,a),t)},h.HH=function(i,t,s,x,n,a,d){return i=this.AddUnsigned(i,this.AddUnsigned(this.AddUnsigned(this.H(t,s,x),n),d)),this.AddUnsigned(this.RotateLeft(i,a),t)},h.II=function(i,t,s,x,n,a,d){return i=this.AddUnsigned(i,this.AddUnsigned(this.AddUnsigned(this.I(t,s,x),n),d)),this.AddUnsigned(this.RotateLeft(i,a),t)},h.ConvertToWordArray=function(i){for(var t,s=i.length,x=s+8,n=(x-x%64)/64,a=(n+1)*16,d=Array(a-1),e=0,c=0;c<s;)t=(c-c%4)/4,e=c%4*8,d[t]=d[t]|i.charCodeAt(c)<<e,c++;return t=(c-c%4)/4,e=c%4*8,d[t]=d[t]|128<<e,d[a-2]=s<<3,d[a-1]=s>>>29,d},h.WordToHex=function(i){var t="",s="",x,n;for(n=0;n<=3;n++)x=i>>>n*8&255,s="0"+x.toString(16),t=t+s.substr(s.length-2,2);return t},h.Utf8Encode=function(i){var t="",s;i=i.replace(/\r\n/g,`
`);for(var x=0;x<i.length;x++)s=i.charCodeAt(x),s<128?t+=String.fromCharCode(s):s>127&&s<2048?(t+=String.fromCharCode(s>>6|192),t+=String.fromCharCode(s&63|128)):(t+=String.fromCharCode(s>>12|224),t+=String.fromCharCode(s>>6&63|128),t+=String.fromCharCode(s&63|128));return t},h.init=function(i){var t;for(typeof i!="string"&&(i=JSON.stringify(i)),this._string=this.Utf8Encode(i),this.x=this.ConvertToWordArray(this._string),this.a=1732584193,this.b=4023233417,this.c=2562383102,this.d=271733878,this.k=0;this.k<this.x.length;this.k+=16)this.AA=this.a,this.BB=this.b,this.CC=this.c,this.DD=this.d,this.a=this.FF(this.a,this.b,this.c,this.d,this.x[this.k],this.S11,3614090360),this.d=this.FF(this.d,this.a,this.b,this.c,this.x[this.k+1],this.S12,3905402710),this.c=this.FF(this.c,this.d,this.a,this.b,this.x[this.k+2],this.S13,606105819),this.b=this.FF(this.b,this.c,this.d,this.a,this.x[this.k+3],this.S14,3250441966),this.a=this.FF(this.a,this.b,this.c,this.d,this.x[this.k+4],this.S11,4118548399),this.d=this.FF(this.d,this.a,this.b,this.c,this.x[this.k+5],this.S12,1200080426),this.c=this.FF(this.c,this.d,this.a,this.b,this.x[this.k+6],this.S13,2821735955),this.b=this.FF(this.b,this.c,this.d,this.a,this.x[this.k+7],this.S14,4249261313),this.a=this.FF(this.a,this.b,this.c,this.d,this.x[this.k+8],this.S11,1770035416),this.d=this.FF(this.d,this.a,this.b,this.c,this.x[this.k+9],this.S12,2336552879),this.c=this.FF(this.c,this.d,this.a,this.b,this.x[this.k+10],this.S13,4294925233),this.b=this.FF(this.b,this.c,this.d,this.a,this.x[this.k+11],this.S14,2304563134),this.a=this.FF(this.a,this.b,this.c,this.d,this.x[this.k+12],this.S11,1804603682),this.d=this.FF(this.d,this.a,this.b,this.c,this.x[this.k+13],this.S12,4254626195),this.c=this.FF(this.c,this.d,this.a,this.b,this.x[this.k+14],this.S13,2792965006),this.b=this.FF(this.b,this.c,this.d,this.a,this.x[this.k+15],this.S14,1236535329),this.a=this.GG(this.a,this.b,this.c,this.d,this.x[this.k+1],this.S21,4129170786),this.d=this.GG(this.d,this.a,this.b,this.c,this.x[this.k+6],this.S22,3225465664),this.c=this.GG(this.c,this.d,this.a,this.b,this.x[this.k+11],this.S23,643717713),this.b=this.GG(this.b,this.c,this.d,this.a,this.x[this.k],this.S24,3921069994),this.a=this.GG(this.a,this.b,this.c,this.d,this.x[this.k+5],this.S21,3593408605),this.d=this.GG(this.d,this.a,this.b,this.c,this.x[this.k+10],this.S22,38016083),this.c=this.GG(this.c,this.d,this.a,this.b,this.x[this.k+15],this.S23,3634488961),this.b=this.GG(this.b,this.c,this.d,this.a,this.x[this.k+4],this.S24,3889429448),this.a=this.GG(this.a,this.b,this.c,this.d,this.x[this.k+9],this.S21,568446438),this.d=this.GG(this.d,this.a,this.b,this.c,this.x[this.k+14],this.S22,3275163606),this.c=this.GG(this.c,this.d,this.a,this.b,this.x[this.k+3],this.S23,4107603335),this.b=this.GG(this.b,this.c,this.d,this.a,this.x[this.k+8],this.S24,1163531501),this.a=this.GG(this.a,this.b,this.c,this.d,this.x[this.k+13],this.S21,2850285829),this.d=this.GG(this.d,this.a,this.b,this.c,this.x[this.k+2],this.S22,4243563512),this.c=this.GG(this.c,this.d,this.a,this.b,this.x[this.k+7],this.S23,1735328473),this.b=this.GG(this.b,this.c,this.d,this.a,this.x[this.k+12],this.S24,2368359562),this.a=this.HH(this.a,this.b,this.c,this.d,this.x[this.k+5],this.S31,4294588738),this.d=this.HH(this.d,this.a,this.b,this.c,this.x[this.k+8],this.S32,2272392833),this.c=this.HH(this.c,this.d,this.a,this.b,this.x[this.k+11],this.S33,1839030562),this.b=this.HH(this.b,this.c,this.d,this.a,this.x[this.k+14],this.S34,4259657740),this.a=this.HH(this.a,this.b,this.c,this.d,this.x[this.k+1],this.S31,2763975236),this.d=this.HH(this.d,this.a,this.b,this.c,this.x[this.k+4],this.S32,1272893353),this.c=this.HH(this.c,this.d,this.a,this.b,this.x[this.k+7],this.S33,4139469664),this.b=this.HH(this.b,this.c,this.d,this.a,this.x[this.k+10],this.S34,3200236656),this.a=this.HH(this.a,this.b,this.c,this.d,this.x[this.k+13],this.S31,681279174),this.d=this.HH(this.d,this.a,this.b,this.c,this.x[this.k],this.S32,3936430074),this.c=this.HH(this.c,this.d,this.a,this.b,this.x[this.k+3],this.S33,3572445317),this.b=this.HH(this.b,this.c,this.d,this.a,this.x[this.k+6],this.S34,76029189),this.a=this.HH(this.a,this.b,this.c,this.d,this.x[this.k+9],this.S31,3654602809),this.d=this.HH(this.d,this.a,this.b,this.c,this.x[this.k+12],this.S32,3873151461),this.c=this.HH(this.c,this.d,this.a,this.b,this.x[this.k+15],this.S33,530742520),this.b=this.HH(this.b,this.c,this.d,this.a,this.x[this.k+2],this.S34,3299628645),this.a=this.II(this.a,this.b,this.c,this.d,this.x[this.k],this.S41,4096336452),this.d=this.II(this.d,this.a,this.b,this.c,this.x[this.k+7],this.S42,1126891415),this.c=this.II(this.c,this.d,this.a,this.b,this.x[this.k+14],this.S43,2878612391),this.b=this.II(this.b,this.c,this.d,this.a,this.x[this.k+5],this.S44,4237533241),this.a=this.II(this.a,this.b,this.c,this.d,this.x[this.k+12],this.S41,1700485571),this.d=this.II(this.d,this.a,this.b,this.c,this.x[this.k+3],this.S42,2399980690),this.c=this.II(this.c,this.d,this.a,this.b,this.x[this.k+10],this.S43,4293915773),this.b=this.II(this.b,this.c,this.d,this.a,this.x[this.k+1],this.S44,2240044497),this.a=this.II(this.a,this.b,this.c,this.d,this.x[this.k+8],this.S41,1873313359),this.d=this.II(this.d,this.a,this.b,this.c,this.x[this.k+15],this.S42,4264355552),this.c=this.II(this.c,this.d,this.a,this.b,this.x[this.k+6],this.S43,2734768916),this.b=this.II(this.b,this.c,this.d,this.a,this.x[this.k+13],this.S44,1309151649),this.a=this.II(this.a,this.b,this.c,this.d,this.x[this.k+4],this.S41,4149444226),this.d=this.II(this.d,this.a,this.b,this.c,this.x[this.k+11],this.S42,3174756917),this.c=this.II(this.c,this.d,this.a,this.b,this.x[this.k+2],this.S43,718787259),this.b=this.II(this.b,this.c,this.d,this.a,this.x[this.k+9],this.S44,3951481745),this.a=this.AddUnsigned(this.a,this.AA),this.b=this.AddUnsigned(this.b,this.BB),this.c=this.AddUnsigned(this.c,this.CC),this.d=this.AddUnsigned(this.d,this.DD);return t=this.WordToHex(this.a)+this.WordToHex(this.b)+this.WordToHex(this.c)+this.WordToHex(this.d),t.toLowerCase()},h.x=Array(),h.S11=7,h.S12=12,h.S13=17,h.S14=22,h.S21=5,h.S22=9,h.S23=14,h.S24=20,h.S31=4,h.S32=11,h.S33=16,h.S34=23,h.S41=6,h.S42=10,h.S43=15,h.S44=21,h.RotateLeft=function(i,t){return i<<t|i>>>32-t},h.F=function(i,t,s){return i&t|~i&s},h.G=function(i,t,s){return i&s|t&~s},h.H=function(i,t,s){return i^t^s},h.I=function(i,t,s){return t^(i|~s)},h}();export{r as M};
