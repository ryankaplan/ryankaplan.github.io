(function(){var V=Object.create||function(a){return{__proto__:a}};function Ob(a,b){a.prototype=V(b.prototype),a.prototype.constructor=a}var J;function Sb(){v(window,'load',function(){var a=document.getElementById('graph-application');a.style.width=a.style.height='100%',new Rb(a)})}function fa(a,b,c,d,f){var e=null,g=null,h=lb(a,c,d);if(h.length>0){e=h[0],x(b,kb(e));switch(e.a){case 0:(!f||f(e.b))&&(b.g=e.b,g='Snap to node');break;case 1:b.d=new Tb(0,e.c,null,null,null,null),g='Constrain to midpoint';break;case 2:b.d=new Tb(1,null,e.f,null,null,null),g='Constrain to altitude base';break;case 3:b.d=new Tb(2,null,null,e.d,null,null),g='Constrain to intersection';break}}return new oc(e,g)}function pb(a){switch(a){case 1:return'icons/tool-move.svg';case 2:return'icons/tool-edge.svg';case 3:return'icons/tool-circle.svg';case 4:return'icons/tool-node-node-constraint.svg'}return null}function S(a,b,c,d){var f=(a.a-b.a)*(c.b-d.b)-(a.b-b.b)*(c.a-d.a),e=(a.a*b.b-a.b*b.a)*(c.a-d.a)-(a.a-b.a)*(c.a*d.b-c.b*d.a),g=(a.a*b.b-a.b*b.a)*(c.b-d.b)-(a.b-b.b)*(c.a*d.b-c.b*d.a);
return new zc(e/f,g/f)}function yb(a,b,c){var d=T(L(l(b,c),1.5707963267948966));return S(a,u(a,d),b,c)}function zb(a,b,c){var d=E(u(a,b),2),f=E(u(b,c),2);return S(d,u(d,T(L(l(a,b),1.5707963267948966))),f,u(f,T(L(l(b,c),1.5707963267948966))))}function xa(a,b,c){var d=C(l(a,b)),f=C(l(a,c)),e=C(l(b,c)),g=Math.pow(d,2),h=Math.pow(f,2),j=Math.pow(e,2);if(h>g+j)return d;else if(g>h+j)return f;else{var q=(d+f+e)/2;return 2/e*Math.sqrt(q*(q-d)*(q-f)*(q-e))}}function Fb(a){for(var b=0,c=0,d=a.length;c<d;c=c+1|0)b=((b<<5)-b|0)+a.charCodeAt(c)|0;return b}function X(b,a){b.b!=a&&(b.b=a,b.c=!0)}function Oa(b,a){b.e=a,b.a.f=!0}function n(f,a,b){var c=!1;switch(a){case 0:f.d!==b&&(f.d=b,c=!0);break;case 1:f.f!==b&&(f.f=b,c=!0);break}if(c)for(var e=0,g=f.g,h=g.length;e<h;e=e+1|0){var d=g[e];Ja(d,a,b)}}function Ja(d,a,b){switch(a){case 0:Cb(d.g);var c=new _b(function(){return Bb(32)},new ec(d.d));d.g.a.push(c),d.g.a.push(new fc(d.d));switch(d.d.d){case 1:d.g.a.push(new cc(d.d)),d.g.a.push(new dc(d.d));break;case 2:d.g.a.push(new bc(d.d));
break;case 3:d.g.a.push(new ac(d.d));break;case 4:d.g.a.push(new $b(d.d));break}ra(d);break;case 1:ra(d);break}}function ra(d){var a=new Object({triggerAction:function(b,c){n(d.d,b,c)},currentTool:d.d.d,topBarText:d.d.f,canvas:d.b});ReactDOM.render(React.createElement(pc.GraphAppView.getConstructor(),a),d.a)}function sa(b){var a=b.b.getBoundingClientRect();b.b.width=a.width*window.devicePixelRatio|0,b.b.height=a.height*window.devicePixelRatio|0,b.c.f=!0}function ta(a){switch(a.a){case 0:return[a.b.c,a.b.d];case 1:return[a.c.a,a.c.b,a.c.c];case 2:return[a.d.a.c,a.d.a.d,a.d.b.c,a.d.b.d];case 3:return[a.f]}throw new Error('Unhandles constraint type')}function k(b){b.f=!0;var a=null;return a=b.g?k(b.g):b.d,b.f=!1,a}function i(b){b.e=!0;var a=null;return a=b.g?i(b.g):k(b)&&!k(b).a?Y(k(b).b):k(b)&&k(b).a==1?Q(k(b).c):k(b)&&k(b).a==2?ea(k(b).d):k(b)&&k(b).a==3?u(i(k(b).f),k(b).e):b.c,b.e=!1,a}function Pa(d,a){var b=[];for(k(d)&&pa(b,ta(k(d)));b.length;){var c=b.pop();if(c==a)return!0;k(c)&&pa(b,ta(k(c)))}return!1}function x(b,a){
return b.c=a,b.b.f=!0,b}function Y(a){return E(u(i(a.c),i(a.d)),2)}function Z(){return Fa=Fa+1|0,Fa}function ua(b,a){b.c=a,b.f=!0}function H(b){var a=new Ub(b);return b.a.push(a),b.f=!0,a}function y(g,a,b){W(g.a,a);for(var c=[],h=0,j=g.b,q=j.length;h<q;h=h+1|0){var d=j[h];(d.c==a||d.d==a)&&c.push(d)}for(var p=0,s=c.length;p<s;p=p+1|0){var f=c[p];W(g.b,f)}if(a.a in g.e)for(var m=0,w=g.e[a.a],o=w.length;m<o;m=m+1|0){var e=w[m];Ka(e,a,b)}g.f=!0}function Qa(d,a,b){if(!$(d,a,b)){var c=new Vb(d,a,b);d.b.push(c),d.f=!0}}function Ra(c,a){W(c.b,a);for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){var b=f[d];if(k(b)&&k(b).b==a)throw new Error('Deleting edge that a node is constrained to')}c.f=!0}function _(h,a,b){if(a!=b){var c=$(h,a,b);if(c){var d=Ya(h,c);d&&y(h,d,null);for(var f=Za(h,c),j=0,q=f.length;j<q;j=j+1|0){var e=f[j];y(h,e,null)}Ra(h,c)}for(var p=0,s=h.b,m=s.length;p<m;p=p+1|0){var g=s[p];g.c==a&&(g.c=b),g.d==a&&(g.d=b)}y(h,a,b),Xa(h)}}function Sa(c,a){for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){var b=f[d];if(b.a==a)return b}
return null}function $(f,a,b){for(var c=null,e=0,g=f.b,h=g.length;e<h;e=e+1|0){var d=g[e];(d.c==a&&d.d==b||d.c==b&&d.d==a)&&(c=d)}return c}function Ta(d,a){for(var b=[],f=0,e=d.b,g=e.length;f<g;f=f+1|0){var c=e[f];c.c==a?b.push(c.d):c.d==a&&b.push(c.c)}return b}function aa(f,a,b){for(var c=[],e=0,g=f.a,h=g.length;e<h;e=e+1|0){var d=g[e];C(l(i(d),a))<4+b&&c.push(d)}return c}function Ua(f,a,b){for(var c=[],e=0,g=f.b,h=g.length;e<h;e=e+1|0){var d=g[e];C(l(Y(d),a))<b&&c.push(d)}return c}function Va(g,a,b){for(var c=[],p=0,s=g.b,m=s.length;p<m;p=p+1|0){var d=s[p];if(xa(a,i(d.c),i(d.d))<b)for(var h=0,j=Ta(g,d.c),q=j.length;h<q;h=h+1|0){var f=j[h];if($(g,f,d.d)){var e=new lc(f,d.c,d.d);C(l(Q(e),a))<b&&c.push(e)}}}return c}function Wa(p,a,b){for(var c=[],s=0,m=p.b,w=m.length;s<w;s=s+1|0){var d=m[s];xa(a,i(d.c),i(d.d))<b&&c.push(d)}for(var f=[],e=0,O=c.length-1|0;e<O;e=e+1|0)for(var g=e+1|0,o=c.length;g<o;g=g+1|0){var h=c[e],j=c[g],q=S(i(h.c),i(h.d),i(j.c),i(j.d));C(l(q,a))<b&&f.push(new mc(h,j))}return f}function Xa(b){
for(var c=0,d=b.a,f=d.length;c<f;c=c+1|0)var a=d[c]}function Ya(c,a){for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){var b=f[d];if(k(b)&&!k(b).a&&k(b).b==a)return b}return null}function Za(d,a){for(var b=[],f=0,e=d.a,g=e.length;f<g;f=f+1|0){var c=e[f];k(c)&&k(c).c&&jb(k(c).c,a)&&b.push(c)}return b}function ba(c,a,b){a.a in c.e||(c.e[a.a]=[]),qa(c.e[a.a],b)}function Ka(d,a,b){var c=b==null||b==d.d||b==d.f||b==d.e;c?La(d.b.b,d):a==d.d?d.d=b:a==d.f?d.f=b:a==d.e&&(d.e=b)}function ca(a){return zb(i(a.d),i(a.f),i(a.e))}function _a(a){return C(l(ca(a),i(a.d)))}function $a(d,a,b,c){return d.b.push(new Xb(d.a,d,a,b,c)),Ma(d.b)}function I(a){switch(a.p){case 0:return a.g;case 1:return a.h;case 2:return a.j}throw new Error('Invalid _state')}function va(a){switch(a.p){case 0:a.p=1;break;case 1:a.p=2;break;case 2:a.p=0,a.g=H(a.a.a),a.h=H(a.a.a),a.j=H(a.a.a),a.q=$a(a.a.b,a.g,a.h,a.j);break}}function ab(a){a.N&&(a.N.style.cursor=null),a.P=a.M=a.N=null}function bb(f,a){for(var b=[],e=0,g=Na(f.a),h=g.length;e<h;e=e+1|0){var c=g[e],d=Sa(a,
c);d&&b.push(d)}return b}function cb(j,a){var b=Jb,c=wb,d=ka,f=xb,e=a.a in j.c.d.a,g=k(a)!=null,h=null;return e&&g?h=f:e&&!g?h=c:!e&&g?h=d:!e&&!g&&(h=b),h=ga(h),a==j.c.c&&ub(h,.1),r(h)}function db(c,a){var b=i(a);c.b.beginPath(),c.b.arc(b.a,b.b,a==c.c.c?4.5:4,0,6.283185307179586),c.b.fillStyle=cb(c,a),c.b.strokeStyle=r(Kb),c.b.fill()}function eb(b,a){b.b.beginPath(),b.b.moveTo(i(a.c).a,i(a.c).b),b.b.lineTo(i(a.d).a,i(a.d).b),b.b.lineWidth=1,b.b.strokeStyle=r(vb),b.b.stroke()}function fb(b,a){b.b.beginPath(),b.b.arc(ca(a).a,ca(a).b,_a(a),0,6.283185307179586),b.b.lineWidth=1,b.b.strokeStyle=r(vb),b.b.stroke()}function gb(e,a){e.b.save(),e.b.scale(window.devicePixelRatio,window.devicePixelRatio),e.b.translate(a.e.a,a.e.b),e.c=a.a;var b=e.a.getBoundingClientRect();e.b.clearRect(-a.e.a,-a.e.b,b.width,b.height);for(var g=0,h=a.a.b,j=h.length;g<j;g=g+1|0){var c=h[g];eb(e,c)}for(var q=0,p=a.b.b,s=p.length;q<s;q=q+1|0){var d=p[q];fb(e,d)}for(var m=0,w=a.a.a,o=w.length;m<o;m=m+1|0){var f=w[m];db(e,f)}e.b.restore(),a.a.f=!1}
function wa(e,a,b){var c=L(b,1.5707963267948966);e.b.beginPath();var d=u(l(a,K(b,1)),E(K(c,10),2)),f=l(d,K(c,10));e.b.moveTo(d.a,d.b),e.b.lineTo(f.a,f.b),Da(d,K(b,2)),Da(f,K(b,2)),e.b.moveTo(d.a,d.b),e.b.lineTo(f.a,f.b),e.b.strokeStyle=r(ka),e.b.lineWidth=1,e.b.stroke()}function hb(o,a){o.b.save(),o.b.scale(window.devicePixelRatio,window.devicePixelRatio),o.b.translate(a.e.a,a.e.b);var b=a.c.b;if(b)switch(b.a){case 0:var c=b.b,d=i(c);o.b.beginPath(),o.b.arc(d.a,d.b,5,0,6.283185307179586),o.b.strokeStyle=r(ka),o.b.lineWidth=2,o.b.stroke();break;case 1:var f=i(b.c.c),e=i(b.c.d),g=E(u(f,e),2),h=T(l(e,f));wa(o,E(u(f,g),2),h),wa(o,E(u(e,g),2),h);break;case 2:var j=i(b.f.a),q=Q(b.f);o.b.beginPath(),o.b.moveTo(q.a,q.b),o.b.lineTo(j.a,j.b),o.b.strokeStyle=r(ka),o.b.lineWidth=1,o.b.stroke();break;case 3:var p=ea(b.d);o.b.beginPath(),o.b.arc(p.a,p.b,5,0,6.283185307179586),o.b.strokeStyle=r(ka),o.b.lineWidth=2,o.b.stroke();break}var s=a.c.a;if(s){var m=ga(xb);m.d=.3;var w=ga(wb);w.d=.6,o.b.beginPath(),o.b.rect(s.a.a,s.a.b,
s.a.a,s.a.b),o.b.lineWidth=1,o.b.fillStyle=r(m),o.b.strokeStyle=r(w),o.b.fill(),o.b.stroke()}o.b.restore(),a.c.c=!1}function ib(b,a){if(a^27){if(a^32){if(a>32)return String.fromCharCode(a)}else return'Space'}else return'Esc';return'unknown'}function kb(a){switch(a.a){case 0:return i(a.b);case 1:return Y(a.c);case 2:return Q(a.f);case 3:return ea(a.d)}return Hb()}function Q(a){return yb(i(a.a),i(a.b),i(a.c))}function jb(b,a){return a.c==b.a&&a.d==b.b||a.c==b.b&&a.d==b.a||a.c==b.b&&a.d==b.c||a.c==b.c&&a.d==b.b||a.c==b.c&&a.d==b.a||a.c==b.a&&a.d==b.c}function ea(a){return S(i(a.a.c),i(a.a.d),i(a.b.c),i(a.b.d))}function lb(s,a,b){for(var c=[],d=aa(s.a,a,10),m=0,w=d.length;m<w;m=m+1|0){var f=d[m];R(s,[f],b)&&c.push(new kc(0,f,null,null,null))}for(var e=Ua(s.a,a,10),o=0,O=e.length;o<O;o=o+1|0){var g=e[o];mb(s,g,b)&&c.push(new kc(1,null,g,null,null))}for(var h=Va(s.a,a,10),B=0,P=h.length;B<P;B=B+1|0){var j=h[B];nb(s,j,b)&&c.push(new kc(2,null,null,null,j))}for(var q=Wa(s.a,a,10),M=0,N=q.length;M<N;M=M+1|0){var p=q[M];
ob(s,p,b)&&c.push(new kc(3,null,null,p,null))}return c}function mb(c,a,b){return R(c,[a.c,a.d],b)}function nb(c,a,b){return R(c,[a.a,a.b,a.c],b)}function ob(c,a,b){return R(c,[a.a.c,a.a.d,a.b.c,a.b.d],b)}function R(f,a,b){for(var h=0,j=bb(b,f.a),q=j.length;h<q;h=h+1|0)for(var c=j[h],e=0,g=a.length;e<g;e=e+1|0){var d=a[e];if(c==d||Pa(d,c))return!1}return!0}function sb(a){var b=a.getBoundingClientRect();return b.bottom>-1&&b.right>-1&&b.top<=window.innerHeight&&b.left<=window.innerWidth}function tb(a,b){var c=null,d=function(){if(sb(a)){var f=new Date,e=c?+f-+c:1/30;b(e),c=f}requestAnimationFrame(d)};requestAnimationFrame(d)}function ga(a){return new qc(a.a,a.b,a.c,a.d)}function r(a){return 'rgba('+(a.a*255|0)+', '+(a.b*255|0)+', '+(a.c*255|0)+', '+a.d+')'}function ub(b,a){b.a=Math.min(b.a+a,1),b.b=Math.min(b.b+a,1),b.c=Math.min(b.c+a,1)}function z(a){return new qc((a>>16&255)/255,(a>>8&255)/255,(a&255)/255,1)}function Ab(){la||(la=new wc,v(document,'keydown',function(a){la.a[a.keyCode]=!0}),v(document,'keyup',function(b){
delete la.a[b.keyCode]}))}function Bb(a){return Ab(),a in la.a}function ya(a){return a.c?a.c.target:a.d.target}function A(c){var a=ya(c).getBoundingClientRect(),b=null;return b=c.c?new zc(c.c.clientX,c.c.clientY):new zc(ja(c.d.touches)[0].clientX,ja(c.d.touches)[0].clientY),l(b,new zc(a.left,a.top))}function Cb(b){for(var c=0,d=b.a,f=d.length;c<f;c=c+1|0){var a=d[c];a.oa()}b.a=[]}function Db(j,a){v(a,'mousedown',function(b){za(j,new rc(j,b,null)),G(b)}),v(a,'mousemove',function(c){Aa(j,new rc(j,c,null)),G(c)}),v(a,'mouseup',function(d){ha(j,new rc(j,d,null)),G(d)}),v(a,'mouseleave',function(f){ha(j,new rc(j,f,null)),G(f)}),v(a,'touchstart',function(e){za(j,new rc(j,null,e)),G(e)}),v(a,'touchmove',function(g){Aa(j,new rc(j,null,g)),G(g)}),v(a,'touchend',function(h){ha(j,new rc(j,null,h)),G(h)})}function za(c,a){for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){var b=f[d];if(b.ma(a),a.b)break}}function ha(c,a){for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){var b=f[d];if(b.na(a),a.b)break}}function Aa(c,a){for(var d=0,f=c.a,e=f.length;d<e;d=d+1|0){
var b=f[d];if(b.F(a),a.b)break}}function ia(e){for(var a=new Nb,m=0,w=Object.keys(e.a),o=w.length;m<o;m=m+1|0){var b=w[m],c=e.a[b];if(a.a+=b+': '+c+';\n',b in Ba)for(var g=0,h=Ba[b],j=h.length;g<j;g=g+1|0){var d=h[g];a.a+=d+': '+c+';\n'}if(c in Ba)for(var q=0,p=Ba[c],s=p.length;q<s;q=q+1|0){var f=p[q];a.a+=b+': '+f+';\n'}}return a.a}function Eb(){for(var a=new Nb,b=0;b<10;b=b+1|0){var c=Math.floor(Math.random()*52|0)|0;a.a+='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.slice(c,c+1|0)}return a.a}function D(a){var b=new yc;a(b);var c=Fb(Ca(b,''));return c in Ha||(Ha[c]=b,Ia[c]=Eb(),Gb(c)),Ia[c]}function Gb(a){var b=Ia[a];if(!document.getElementById(b)){var c=document.createElement('style');c.type='text/css',c.id=b;var d=Ha[a];c.innerHTML=Ca(d,b),document.getElementsByTagName('head')[0].appendChild(c)}}function Ca(c,a){var b=new Nb;return Object.keys(c.a.a).length&&(b.a+='.'+a+' {\n',b.a+=ia(c.a),b.a+='}\n'),Object.keys(c.b.a).length&&(b.a+='.'+a+':hover {\n',b.a+=ia(c.b),b.a+='}\n'),Object.keys(c.c.a).length&&(b.a+='.'+a+':active {',
b.a+=ia(c.c),b.a+='}\n'),b.a}function u(b,a){return new zc(b.a+a.a,b.b+a.b)}function l(b,a){return new zc(b.a-a.a,b.b-a.b)}function K(b,a){return new zc(b.a*a,b.b*a)}function E(b,a){return new zc(b.a/a,b.b/a)}function Da(b,a){b.a+=a.a,b.b+=a.b}function L(b,a){return new zc(b.a*Math.cos(a)-b.b*Math.sin(a),b.b*Math.cos(a)+b.a*Math.sin(a))}function T(a){return E(a,C(a))}function C(a){return Math.sqrt(a.a*a.a+a.b*a.b)}function Hb(){return new zc(0,0)}function ja(a){for(var b=[],c=0,d=a.length;c<d;c=c+1|0)b.push(a[c]);return b}function v(a,b,c){a.addEventListener(b,c)}function G(a){a.preventDefault()}function La(d,a){for(var b=0,c=0,f=d.length;c<f;c=c+1|0)d[c]!=a&&(b<c&&(d[b]=d[c]),b=b+1|0);for(;b<d.length;)d.pop()}function Ma(a){return a[a.length-1|0]}function pa(c,a){for(var d=0,f=a.length;d<f;d=d+1|0){var b=a[d];c.push(b)}}function qa(b,a){~b.indexOf(a)||b.push(a)}function W(c,a){var b=c.indexOf(a);b>-1&&c.splice(b,1)}function t(c,a,b){return c[a]=b,c}function Na(c){var a=[];for(var b in c)a.push(b|0);return a}function Ea(a){
try{return a.getContext('2d')}catch(b){}return null}function Nb(){this.a=''}function Pb(){this.a=this.b=null,this.c=!1}function Qb(a,b,c){this.a=a,this.b=b,this.c=c,this.d=-1,this.f='error: missing top bar text',this.e=new zc(0,0),this.g=[]}function Rb(a){var c=this;c.b=c.c=c.d=c.f=c.e=c.g=c.h=null,c.a=a,c.b=document.createElement('canvas'),c.b.style.width=c.b.style.height='100%',c.c=new Wb,c.f=new hc(c.b),c.d=new Qb(c.c,new Yb(c.c),new Pb),qa(c.d.g,c),c.e=new ic(c.b),c.g=new vc,Db(c.g,c.b),c.h=new jc(c.d),tb(c.b,function(b){(c.c.f||c.d.c.c)&&(gb(c.f,c.d),hb(c.e,c.d))}),n(c.d,0,0),n(c.d,1,'Welcome to AlphaGraph - choose a tool to get started...'),v(window,'resize',function(){sa(c)}),sa(c)}function Tb(a,b,c,d,f,e){this.a=a,this.b=b,this.c=c,this.d=d,this.f=f,this.e=e}function Ub(a){this.a=-1,this.b=null,this.c=new zc(0,0),this.d=null,this.f=this.e=!1,this.g=null,this.b=a,this.a=Z()}function Vb(a,b,c){this.b=-1,this.c=this.d=null,this.a=a,this.b=Z(),this.c=b,this.d=c}function Wb(){this.a=[],this.b=[],this.c=null,
this.d=new gc,this.f=!1,this.e={}}function Xb(a,b,c,d,f){this.c=-1,this.d=this.f=this.e=null,this.a=a,this.b=b,this.c=Z(),this.d=c,this.f=d,this.e=f,ba(this.a,this.d,this),ba(this.a,this.f,this),ba(this.a,this.e,this)}function Yb(a){this.a=a,this.b=[]}function gc(){this.a={}}gc.da=function(a){this.a={};for(var c=0,d=a.length;c<d;c=c+1|0){var b=a[c];this.a[b.a]=!0}};gc.da.prototype=gc.prototype;function hc(a){this.b=this.c=null,this.a=a,this.b=Ea(a)}function ic(a){this.b=null,this.a=a,this.b=Ea(this.a)}function jc(a){var f=this;f.a=t(t(t(t(t(t(V(null),'Esc',function(e){n(e,0,1)}),'C',function(g){n(g,0,3)}),'M',function(h){n(h,0,1)}),'N',function(j){n(j,0,4)}),'V',function(q){n(q,0,1)}),'E',function(p){n(p,0,2)}),v(document,'keydown',function(b){var c=0;b.key!==undefined?c=b.key:b.keyCode!==undefined?c=b.keyCode:b.which!==undefined&&(c=b.which);var d=ib(f,c);d in f.a&&f.a[d](a)})}function kc(a,b,c,d,f){this.a=a,this.b=b,this.c=c,this.d=d,this.f=f}function lc(a,b,c){this.a=a,this.b=b,this.c=c}function mc(a,b){this.a=a,
this.b=b}function nc(){this.a=null}function oc(a,b){this.a=a,this.b=b}var pc={};function qc(a,b,c,d){this.a=a,this.b=b,this.c=c,this.d=d}function rc(a,b,c){this.a=a,this.b=!1,this.c=b,this.d=c}function sc(){}J=sc.prototype;J.ma=function(a){};J.F=function(a){};J.na=function(a){};J.oa=function(){};function Zb(a){sc.call(this),this.a=a}Ob(Zb,sc);function dc(a){Zb.call(this,a),this.O=new nc,this.B=null}Ob(dc,Zb);J=dc.prototype;J.ma=function(a){this.O=new nc,this.O.a=this.a.a;var b=aa(this.a.a,l(A(a),this.a.e),10);this.B=b.length?b[0]:null,this.B&&(a.b=!0)};J.F=function(a){var b=l(A(a),this.a.e),c=null;if(this.B){a.b=!0,this.B.d=this.B.g=null,x(this.B,b);var d=fa(this.O,this.B,b,new gc.da([this.B]),null);c=d.a}X(this.a.c,c)};J.na=function(a){this.F(a),this.B&&(a.b=!0,this.B.g&&_(this.a.a,this.B,this.B.g),this.B=null)};function ec(a){Zb.call(this,a),this.P=this.M=this.N=null}Ob(ec,Zb);J=ec.prototype;J.ma=function(a){this.P=A(a),this.M=this.a.e,this.N=ya(a),this.N.style.cursor='move',a.b=!0};J.F=function(a){this.P&&(Oa(this.a,
u(this.M,l(A(a),this.P))),this.N.style.cursor='move',a.b=!0)};J.na=function(a){this.P&&(this.F(a),ab(this),a.b=!0)};function fc(a){Zb.call(this,a)}Ob(fc,Zb);fc.prototype.F=function(a){var b=aa(this.a.a,l(A(a),this.a.e),10);b.length?ua(this.a.a,b[0]):ua(this.a.a,null)};function cc(a){Zb.call(this,a),this.o=null,n(a,1,'Click somewhere to create a node')}Ob(cc,Zb);cc.prototype.ma=function(a){if(!this.a.a.c){var b=H(this.a.a);x(b,l(A(a),this.a.e))}n(this.a,1,'Good job! Now use the edge tool to add some edges...')};function _b(a,b){sc.call(this),this.b=a,this.c=b}Ob(_b,sc);J=_b.prototype;J.oa=function(){this.c.oa()};J.ma=function(a){this.b()&&this.c.ma(a)};J.F=function(a){this.b()&&this.c.F(a)};J.na=function(a){this.b()&&this.c.na(a)};function $b(a){Zb.call(this,a),this.d=this.f=null}Ob($b,Zb);J=$b.prototype;J.ma=function(a){var b=this.a.a.c;b&&(this.d?!this.f&&this.a.a.c!=this.d&&(this.f=b):this.d=b),this.f&&this.d&&this.d==this.a.a.c&&n(this.a,0,1)};J.F=function(a){this.d?this.f?n(this.a,1,"Whenever you're ready, hit 'V' to go back to the move tool"):n(this.a,
1,'Drag a node you want to constrain relative to the anchor'):n(this.a,1,'Pick a node that you want to use as an anchor'),new tc(Lb.a.a).a&&this.f&&(this.f.d=new Tb(3,null,null,null,this.d,l(l(A(a),this.a.e),i(this.d))))};J.na=function(a){this.F(a)};function ac(a){Zb.call(this,a),this.e=this.g=this.h=this.j=this.q=null,this.p=0,this.e=new nc,this.p=2,va(this)}Ob(ac,Zb);J=ac.prototype;J.oa=function(){switch(this.p){case 0:y(this.a.a,this.g,null),y(this.a.a,this.h,null),y(this.a.a,this.j,null);break;case 1:y(this.a.a,this.h,null),y(this.a.a,this.j,null);break;case 2:y(this.a.a,this.j,null);break}};J.ma=function(a){this.F(a),I(this).g&&_(this.a.a,I(this),I(this).g),va(this)};J.F=function(a){var b=l(A(a),this.a.e);this.e.a=this.a.a;switch(this.p){case 0:x(this.g,b),x(this.h,b),x(this.j,b);break;case 1:x(this.h,b);var c=l(i(this.h),i(this.g));x(this.j,u(i(this.h),L(c,-1.5707963267948966)));break;case 2:x(this.j,b);break}I(this).d=null,I(this).g=null;var d=new gc.da([this.g,this.h,this.j]),f=fa(this.e,I(this),b,d,null);
n(this.a,1,f.b==null?"It's a masterpiece!":f.b),X(this.a.c,f.a)};function bc(a){Zb.call(this,a),this.s=this.m=this.w=null,this.s=new nc,this.m=H(a.a),n(this.a,1,'Click somewhere to start creating edges')}Ob(bc,Zb);J=bc.prototype;J.oa=function(){this.m&&y(this.a.a,this.m,null)};J.F=function(a){var h=this;h.s.a=h.a.a;var b=l(A(a),h.a.e),c=null,d=h.w&&"It's a masterpiece!";if(h.m){h.m.d=h.m.g=null,x(h.m,b);var f=new gc.da([h.m]),e=fa(h.s,h.m,b,f,function(g){return g!=h.w});e.a&&(c=e.a),e.b!=null&&(d=e.b)}d!=null&&n(h.a,1,d),X(h.a.c,c)};J.ma=function(a){this.F(a);var b=l(A(a),this.a.e);this.m.g?(_(this.a.a,this.m,this.m.g),this.w=this.m.g):this.w=this.m,this.m=H(this.a.a),x(this.m,b),Qa(this.a.a,this.w,this.m)};function tc(a){this.a=a}function uc(){var d=this;d.a=new tc(!1),v(window,'load',function(){var a=function(){d.a.a=!0},b=function(){d.a.a=!1};document.addEventListener('mousedown',a,!0),document.addEventListener('mouseup',b),document.addEventListener('touchstart',a),document.addEventListener('touchend',b),document.addEventListener('mouseout',
function(c){!c.toElement&&!c.relatedTarget&&b()})})}function vc(){this.a=[]}function wc(){this.a={}}function xc(){this.a=V(null)}function yc(){this.a=new xc,this.b=new xc,this.c=new xc}function zc(a,b){this.a=a,this.b=b}pc.ToolbarView=function(){React.Component.call(this)};Ob(pc.ToolbarView,React.Component);J=pc.ToolbarView.prototype;pc.ToolbarView.getConstructor=function(){var a=new pc.ToolbarView;return a.constructor};J.displayName=function(){return'ToolbarView'};J.render=function(){for(var a=D(function(b){b.a.a.width=b.a.a.height='100%'}),c=[],f=0,e=[1,2,3,4],g=e.length;f<g;f=f+1|0){var d=e[f];c.push(this._renderTool(d))}return U.div(new Object({className:a}),c)};J._renderTool=function(a){var d=this,b=D(function(c){a===d.props.currentTool?c.a.a['background-color']=r(qb):(c.a.a['background-color']=r(Ga),c.c.a['background-color']=r(qb),c.b.a['background-color']=r(Ib)),c.a.a['background-image']="url('"+pb(a)+"')",c.a.a['background-position']='center',c.a.a['background-repeat']='no-repeat',c.a.a.width=c.a.a.height='54px'});
return U.div(new Object({key:'tool-button-'+Mb[a],className:b,onClick:function(){d.props.triggerAction(0,a)}}))};pc.ToolbarView.Props=function(a,b){this.app=a,this.currentTool=b};pc.GraphAppView=function(){React.Component.call(this)};Ob(pc.GraphAppView,React.Component);J=pc.GraphAppView.prototype;pc.GraphAppView.getConstructor=function(){var a=new pc.GraphAppView;return a.constructor};J.displayName=function(){return'GraphAppView'};J.render=function(){var a=D(function(b){b.a.a.width=b.a.a.height='100%',b.a.a.overflow='hidden',b.a.a['font-family']="'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",b.a.a.color='#444',b.a.a.display='flex',b.a.a['flex-direction']='column'}),c=D(function(d){d.a.a.width='100%',d.a.a.height='36px',d.a.a['background-color']=r(Ga),d.a.a['border-bottom']='1px solid '+r(rb),d.a.a['text-align']='center',d.a.a['line-height']='36px',d.a.a['font-size']='12px',d.a.a['letter-spacing']='1.1px'}),f=D(function(e){e.a.a.width=e.a.a.height='100%',e.a.a.display='flex'}),g=D(function(h){h.a.a.width='54px',
h.a.a.height='100%',h.a.a['background-color']=r(Ga),h.a.a['border-right']='1px solid '+r(rb)}),j=D(function(q){q.a.a.width=q.a.a.height='100%',q.a.a['background-color']='white'}),p=U.div(new Object({className:c}),this.props.topBarText);return U.div(new Object({className:a}),p,U.div(new Object({className:f}),U.div(new Object({className:g}),React.createElement(pc.ToolbarView.getConstructor(),this.props)),U.div(new Object({className:j}),this._renderCanvas())))};J._renderCanvas=function(){var f=this,a=function(b){b&&b.appendChild(f.props.canvas)},c=D(function(d){d.a.a.width=d.a.a.height='100%'});return U.div(new Object({ref:a,className:c}))};pc.GraphAppView.Props=function(a,b){this.app=a,this.currentTool=b};var Lb=new uc,U=React.DOM,Fa=-1,Ga=z(15921906),Ib=z(16316664),qb=z(14737632),rb=z(12434877),vb=z(6710886),Jb=z(9391359),wb=z(2525183),xb=z(10540785),ka=z(7327639),Kb=z(0),la=null,Ba=t(t(V(null),'flex',['-webkit-flex']),'flex-direction',['-webkit-flex-direction']),Ha={},Ia={},Mb=['NONE','MOVE','EDGE','CIRCLE','NODE_NODE_CONSTRAINT'];
Sb()})();
