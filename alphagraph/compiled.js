(function(){var qa=Object.create||function(a){return{__proto__:a}};function Dc(a,b){a.prototype=qa(b.prototype),a.prototype.constructor=a}var I;function Hc(){B(window,'load',function(){var a=document.getElementById('graph-application');a.style.width=a.style.height='100%',new Gc(a)})}function za(a,b,c,d,e){var f=null,g=null,h=Tb(a,c,d);if(h.length>0){f=h[0],z(b,Xa(f));switch(f.a){case 0:(!e||e(f.b))&&(b.g=f.b,g='Snap to node');break;case 1:b.d=new Kc(f,new sd(0,0)),g='Constrain to midpoint';break;case 2:b.d=new Kc(f,new sd(0,0)),g='Constrain to altitude base';break;case 3:b.d=new Kc(f,new sd(0,0)),g='Constrain to intersection';break;case 4:b.d=new Kc(f,new sd(0,0)),g='Constrain to circle center';break}}return new ed(f,g)}function Xb(a){switch(a){case 1:return'icons/tool-move.svg';case 2:return'icons/tool-edge.svg';case 3:return'icons/tool-circle.svg'}return null}function Yb(a,b){for(var c=[],e=0,f=K(b,a),g=f.length;e<g;e=e+1|0){var d=f[e];n(d)&&!n(d).a.a?Z(c,n(d).a.b):Z(c,null)}return c}function Aa(){return u(function(a){
a.a.a.color=s(gc),a.a.a.cursor='pointer'})}function ja(a,b,c,d){var e=(a.a-b.a)*(c.b-d.b)-(a.b-b.b)*(c.a-d.a),f=(a.a*b.b-a.b*b.a)*(c.a-d.a)-(a.a-b.a)*(c.a*d.b-c.b*d.a),g=(a.a*b.b-a.b*b.a)*(c.b-d.b)-(a.b-b.b)*(c.a*d.b-c.b*d.a);return new sd(f/e,g/e)}function ic(a,b,c){var d=M(W(j(b,c),1.5707963267948966));return ja(a,r(a,d),b,c)}function jc(a,b,c){var d=J(r(a,b),2),e=J(r(b,c),2);return ja(d,r(d,M(W(j(a,b),1.5707963267948966))),e,r(e,M(W(j(b,c),1.5707963267948966))))}function _a(a,b,c){var d=x(j(a,b)),e=x(j(a,c)),f=x(j(b,c)),g=Math.pow(d,2),h=Math.pow(e,2),k=Math.pow(f,2);if(h>g+k)return d;else if(g>h+k)return e;else{var m=(d+e+f)/2;return 2/f*Math.sqrt(m*(m-d)*(m-e)*(m-f))}}function kc(a,b,c,d){var e=j(d,b),f=j(c,b),g=j(a,b),h=ea(e,e),k=ea(e,f),m=ea(e,g),p=ea(f,f),q=ea(f,g),t=h*p-k*k,l=(p*m-k*q)/t,w=(h*q-k*m)/t;return l>=0&&w>=0&&l+w<1}function rc(a){for(var b=0,c=0,d=a.length;c<d;c=c+1|0)b=((b<<5)-b|0)+a.charCodeAt(c)|0;return b}function Ia(b,a){a!=b.a&&(b.a=a,b.c=!0)}function ua(b,a){b.b!=a&&(b.b=a,b.c=!0)}function nb(b,a){
b.e=a,b.a.h=!0}function o(e,a,b){var c=!0;switch(a){case 6:e.c===b?c=!1:e.c=b;break;case 7:e.d===b?c=!1:e.d=b;break;case 8:yb(e.a,b);break}if(c&&nc('Trigger action '+Ac[a]+' with data ('+b+')'),c)for(var f=0,g=e.h,h=g.length;f<h;f=f+1|0){var d=g[f];na(d,a,b)}}function ob(c){return c.f?u(function(a){a.a.a['background-color']=s(fc),a.a.a.color=s(hc)}):u(function(b){b.a.a['background-color']=s(Ya)})}function jb(b,a){ia(a)&&ha(b)}function na(l,a,b){var c=l.d.a,d=F(c.g);switch(a){case 3:var e=K(d,l.d.a);zb(l.d.a,e);break;case 0:na(l,5,new md([new Wc(l.d),new Oc(l.d,'Choose a node as the origin',d,function(f){o(l.d,4,null),o(l.d,2,f),o(l.d,7,wc(f))})]));break;case 1:for(var w=0,v=K(F(l.d.a.g),l.d.a),Y=v.length;w<Y;w=w+1|0){var g=v[w],h=i(g);g.d=null,z(g,h)}break;case 2:for(var k=b,E=0,fa=K(F(l.d.a.g),l.d.a),P=fa.length;E<P;E=E+1|0){var m=fa[E],p=new ad(0,k,null,null,null,null);m.d=new Kc(p,j(i(m),i(k)))}break;case 4:l.k=null,na(l,6,l.d.c);break;case 5:l.k=new md(l.g.a.ka.slice()),ab(l.g);var q=b;U(l.g,q);break;case 6:
ab(l.g);var t=new jd(function(){return mc(32)},new Tc(l.d));U(l.g,t),U(l.g,new Wc(l.d));switch(l.d.c){case 1:U(l.g,new Pc(l.d,new Uc(l.d),new md([new Sc(l.d),new Vc(l.d)])));break;case 2:U(l.g,new Rc(l.d));break;case 3:U(l.g,new Qc(l.d));break}ha(l);break;case 7:ha(l);break;case 8:ha(l);break}}function ha(f){var a=eb(window.performance),b=new gd(f.b,f.d.d,f.d.c,function(c,d){o(f.d,c,d)},f.d);ReactDOM.render(React.createElement(new fd.GraphAppView().constructor,new Object(b)),f.a);var e=eb(window.performance)-a;e>16&&console.warn('DOM render took more than 16ms -- duration was '+e+'ms')}function Ja(b){var a=b.b.getBoundingClientRect();b.b.width=a.width*window.devicePixelRatio|0,b.b.height=a.height*window.devicePixelRatio|0,b.c.h=!0}function kb(d,a,b){var c=b==null||b==d.c||b==d.d||b==d.e;c?ga(d.a.a,d):a==d.c?(ga(d.a.b[d.c.a],d),d.c=b,S(d.a,d.c,d)):a==d.d?(ga(d.a.b[d.d.a],d),d.d=b,S(d.a,d.d,d)):a==d.e&&(ga(d.a.b[d.e.a],d),d.e=b,S(d.a,d.e,d))}function _(a){return jc(i(a.c),i(a.d),i(a.e))}function Ka(a){return x(j(_(a),
i(a.c)))}function pb(d,a,b,c){return d.a.push(new Ic(d,a,b,c)),lb(d.a)}function qb(e,a,b){for(var c=[],f=0,g=e.a,h=g.length;f<h;f=f+1|0){var d=g[f];x(j(_(d),a))<b&&c.push(d)}return c}function S(c,a,b){a.a in c.b||(c.b[a.a]=[]),Z(c.b[a.a],b)}function Ma(c,a){for(var d=0,e=c.d,f=e.length;d<f;d=d+1|0){var b=e[d];if(b.a==a)return b}return null}function va(e,a,b){for(var c=null,f=0,g=e.e,h=g.length;f<h;f=f+1|0){var d=g[f];(d.c==a&&d.d==b||d.c==b&&d.d==a)&&(c=d)}return c}function sb(d,a){for(var b=[],e=0,f=d.e,g=f.length;e<g;e=e+1|0){var c=f[e];c.c==a?b.push(c.d):c.d==a&&b.push(c.c)}return b}function Na(e,a,b){for(var c=[],f=0,g=e.d,h=g.length;f<h;f=f+1|0){var d=g[f];x(j(i(d),a))<4+b&&c.push(d)}return c}function tb(e,a,b){for(var c=[],f=0,g=e.e,h=g.length;f<h;f=f+1|0){var d=g[f];x(j(Pa(d),a))<b&&c.push(d)}return c}function ub(g,a,b){for(var c=[],p=0,q=g.e,t=q.length;p<t;p=p+1|0){var d=q[p];if(_a(a,i(d.c),i(d.d))<b)for(var h=0,k=sb(g,d.c),m=k.length;h<m;h=h+1|0){var e=k[h];if(va(g,e,d.d)){var f=new bd(e,d.c,d.d);x(j(ya(f),
a))<b&&c.push(f)}}}return c}function vb(p,a,b){for(var c=[],q=0,t=p.e,l=t.length;q<l;q=q+1|0){var d=t[q];_a(a,i(d.c),i(d.d))<b&&c.push(d)}for(var e=[],f=0,v=c.length-1|0;f<v;f=f+1|0)for(var g=f+1|0,w=c.length;g<w;g=g+1|0){var h=c[f],k=c[g],m=ja(i(h.c),i(h.d),i(k.c),i(k.d));x(j(m,a))<b&&e.push(new cd(h,k))}return e}function wa(){return fb=fb+1|0,fb}function xb(b,a){b.f=a,b.h=!0}function yb(b,a){b.g=a,b.h=!0}function $(b){var a=new Lc(b);return b.d.push(a),b.h=!0,a}function C(g,a,b){ra(g.d,a);for(var c=[],h=0,k=g.e,m=k.length;h<m;h=h+1|0){var d=k[h];(d.c==a||d.d==a)&&c.push(d)}for(var p=0,q=c.length;p<q;p=p+1|0){var e=c[p];ra(g.e,e)}if(a.a in g.b)for(var t=0,l=g.b[a.a],w=l.length;t<w;t=t+1|0){var f=l[t];kb(f,a,b)}g.h=!0}function zb(c,a){for(var d=0,e=a.length;d<e;d=d+1|0){var b=a[d];C(c,b,null)}}function Ab(d,a,b){if(!va(d,a,b)){var c=new Mc(d,a,b);d.e.push(c),d.h=!0}}function Bb(c,a){ra(c.e,a);for(var d=0,e=c.d,f=e.length;d<f;d=d+1|0){var b=e[d];if(n(b)&&n(b).a.c==a)throw new Error('Deleting edge that a node is constrained to')}
c.h=!0}function xa(h,a,b){if(a!=b){var c=va(h,a,b);if(c){var d=Db(h,c);d&&C(h,d,null);for(var e=Eb(h,c),k=0,m=e.length;k<m;k=k+1|0){var f=e[k];C(h,f,null)}Bb(h,c)}for(var p=0,q=h.e,t=q.length;p<t;p=p+1|0){var g=q[p];g.c==a&&(g.c=b),g.d==a&&(g.d=b)}C(h,a,b),Cb(h)}}function Cb(b){for(var c=0,d=b.d,e=d.length;c<e;c=c+1|0)var a=d[c]}function Db(c,a){for(var d=0,e=c.d,f=e.length;d<f;d=d+1|0){var b=e[d];if(n(b)&&n(b).a.a==1&&n(b).a.c==a)return b}return null}function Eb(d,a){for(var b=[],e=0,f=d.d,g=f.length;e<g;e=e+1|0){var c=f[e];n(c)&&n(c).a.e&&Sb(n(c).a.e,a)&&b.push(c)}return b}function rb(a){return r(Xa(a.a),a.b)}function La(a){switch(a.a.a){case 1:return[a.a.c.c,a.a.c.d];case 2:return[a.a.e.a,a.a.e.b,a.a.e.c];case 3:return[a.a.d.a.c,a.a.d.a.d,a.a.d.b.c,a.a.d.b.d];case 0:return[a.a.b];case 4:return[a.a.f.c,a.a.f.d,a.a.f.e]}throw new Error('Unhandles constraint type')}function Oa(a){return a.b.f==a}function ia(b){var a=!1;return a=b.g?ia(b.g):b.a in F(b.b.g).a,a}function n(b){b.e=!0;var a=null;return a=b.g?n(b.g):b.d,
b.e=!1,a}function i(b){b.f=!0;var a=null;return a=b.g?i(b.g):n(b)?rb(n(b)):b.c,b.f=!1,a}function wb(d,a){var b=[];for(n(d)&&Ha(b,La(n(d)));b.length;){var c=b.pop();if(c==a)return!0;n(c)&&Ha(b,La(n(c)))}return!1}function z(c,a){if(c.c!=a){c.c=a;for(var d=0,e=c.b.c,f=e.length;d<f;d=d+1|0){var b=e[d];jb(b,c)}c.b.h=!0}return c}function Pa(a){return J(r(i(a.c),i(a.d)),2)}function T(a){switch(a.l){case 0:return a.m;case 1:return a.p;case 2:return a.q}throw new Error('Invalid _state')}function Qa(a){switch(a.l){case 0:a.l=1;break;case 1:a.l=2;break;case 2:a.l=0,a.m=$(a.a.a),a.p=$(a.a.a),a.q=$(a.a.a),a.t=pb(a.a.a,a.m,a.p,a.q);break}}function Fb(a){a.R&&(a.R.style.cursor=null),a.P=a.oa=a.R=null}function F(b){var a=new Xc;return a.a=mb(b.a),a}function K(e,a){for(var b=[],f=0,g=sa(e.a),h=g.length;f<h;f=f+1|0){var c=g[f],d=Ma(a,c);d&&b.push(d)}return b}function Lb(e,a){e.b.save(),e.b.scale(window.devicePixelRatio,window.devicePixelRatio),e.b.translate(a.e.a,a.e.b),e.c=a.a;for(var f=0,g=a.a.e,h=g.length;f<h;f=f+1|0){var b=g[f];
Ra(e.b,i(b.c),i(b.d),Za,1)}for(var k=0,m=a.a.a,p=m.length;k<p;k=k+1|0){var c=m[k];ba(e.b,_(c),Ka(c),null,Za,1)}for(var q=0,t=a.a.d,l=t.length;q<l;q=q+1|0){var d=t[q];ba(e.b,i(d),Oa(d)?4.5:4,Ib(d),Sa(d),1)}e.b.restore(),a.a.h=!1}function Mb(c,a){var b=a.b.b;if(b)switch(b.a){case 0:ba(c.b,i(b.b),5,null,da,2);break;case 1:Ua(c.b,b.c);break;case 2:Va(c.b,b.e);break;case 3:Jb(c.b,b.d);break;case 4:Kb(c.b,b.f);break}}function Nb(m,a){for(var b=a.a,c=F(b.g),d=a.g^1?K(c,b):b.d,p=0,q=d.length;p<q;p=p+1|0){var e=d[p];if(n(e))switch(n(e).a.a){case 1:Ua(m.b,n(e).a.c);break;case 2:Va(m.b,n(e).a.e);break;case 3:var f=n(e).a.d.a,g=n(e).a.d.b;L(m.b,i(f.c),i(f.d),da,-1,null),L(m.b,i(g.c),i(g.d),da,-1,null);break;case 0:var h=i(n(e).a.b),k=i(e);L(m.b,h,k,Za,1,[6,6]);break}}}function Ob(c,a){c.b.save(),c.b.scale(window.devicePixelRatio,window.devicePixelRatio),c.b.translate(a.e.a,a.e.b);var b=c.a.getBoundingClientRect();c.b.clearRect(-a.e.a,-a.e.b,b.width,b.height),Mb(c,a),Nb(c,a),c.b.restore()}function Pb(e,a){e.b.save(),e.b.scale(window.devicePixelRatio,
window.devicePixelRatio),e.b.translate(a.e.a,a.e.b);var b=a.b.a;if(b){var c=Ba(zc);c.d=.3;var d=Ba(gc);d.d=.6,Hb(e.b,b,c,d,1)}e.b.restore(),a.b.c=!1}function Ra(a,b,c,d,e){L(a,b,c,d,-1,null)}function L(a,b,c,d,e,f){a.beginPath(),a.moveTo(b.a,b.b),a.lineTo(c.a,c.b),d&&(a.strokeStyle=s(d)),e>=0&&(a.lineWidth=e),f&&a.setLineDash(f),d&&a.stroke()}function Gb(a,b,c,d,e,f,g){for(var h=M(W(j(c,b),1.5707963267948966)),k=e*(d-1|0),m=0;m<d;m=m+1|0){var p=V(h,e*m-k/2),q=r(b,p),t=r(c,p);L(a,q,t,f,-1,null)}}function ba(a,b,c,d,e,f){a.beginPath(),a.arc(b.a,b.b,c,0,6.283185307179586),d&&(a.fillStyle=s(d),a.fill()),f>=0&&(a.lineWidth=f),e&&(a.strokeStyle=s(e),a.stroke())}function Hb(a,b,c,d,e){a.beginPath(),a.rect(b.a.a,b.a.b,b.b.a,b.b.b),c&&(a.fillStyle=s(c),a.fill()),e>=0&&(a.lineWidth=e),d&&(a.strokeStyle=s(d),a.stroke())}function Ib(a){return ia(a)?Sa(a):hc}function Sa(a){var b=null;return b=n(a)?da:fc,Oa(a)&&(b=Ba(b),ec(b,.1)),b}function Ta(a,b,c){var d=M(W(c,1.5707963267948966)),e=j(b,J(V(d,10),2)),f=r(b,J(V(d,10),2));Gb(a,
e,f,2,2,da,1)}function Ua(a,b){var c=i(b.c),d=i(b.d),e=J(r(c,d),2),f=M(j(d,c));Ta(a,J(r(c,e),2),f),Ta(a,J(r(d,e),2),f)}function Va(a,b){var c=ya(b),d=i(b.a),e=i(b.b),f=i(b.c),g=x(j(c,e))<x(j(c,f))?e:f,h=x(j(c,e))<x(j(c,f))?f:e,k=M(j(d,c)),m=kc(r(c,V(k,1e-05)),d,e,f);Ra(a,c,d,da,1);var p=m?h:g,q=V(M(j(p,c)),10),t=V(k,10),l=r(c,q),w=r(c,t),v=r(r(c,q),t);L(a,v,l,da,-1,null),L(a,v,w,da,-1,null),m||L(a,c,g,Za,1,[6,6])}function Jb(a,b){var c=Wa(b);ba(a,c,5,null,da,5)}function Kb(a,b){ba(a,_(b),Ka(b),null,da,2)}function Qb(g,a,b){g.e.a=g.a.a;var c=new ed(null,null);if(a.g=null,n(a)&&!n(a).a.a)n(a).b=j(b,i(n(a).a.b));else{a.d=null,z(a,b);var d=new Xc.aa([a]);c=za(g.e,a,b,d,null)}for(var e=j(i(a),g.c[a.a]),h=0,k=K(g.b,g.a.a),m=k.length;h<m;h=h+1|0){var f=k[h];n(f)||z(f,r(g.c[f.a],e))}return c}function Rb(b,a){if(a^8){if(a^27){if(a^32){if(a>32)return String.fromCharCode(a)}else return'Space'}else return'Esc'}else return'Backspace';return'unknown'}function Xa(a){switch(a.a){case 0:return i(a.b);case 1:return Pa(a.c);case 2:
return ya(a.e);case 3:return Wa(a.d);case 4:return _(a.f)}return tc()}function ya(a){return ic(i(a.a),i(a.b),i(a.c))}function Sb(b,a){return a.c==b.a&&a.d==b.b||a.c==b.b&&a.d==b.a||a.c==b.b&&a.d==b.c||a.c==b.c&&a.d==b.b||a.c==b.c&&a.d==b.a||a.c==b.a&&a.d==b.c}function Wa(a){return ja(i(a.a.c),i(a.a.d),i(a.b.c),i(a.b.d))}function Tb(w,a,b){for(var c=[],d=Na(w.a,a,10),v=0,Y=d.length;v<Y;v=v+1|0){var e=d[v];ca(w,[e],b)&&c.push(new ad(0,e,null,null,null,null))}for(var f=tb(w.a,a,10),E=0,fa=f.length;E<fa;E=E+1|0){var g=f[E];Ub(w,g,b)&&c.push(new ad(1,null,g,null,null,null))}for(var h=ub(w.a,a,10),P=0,oa=h.length;P<oa;P=P+1|0){var k=h[P];Vb(w,k,b)&&c.push(new ad(2,null,null,null,k,null))}for(var m=vb(w.a,a,10),R=0,la=m.length;R<la;R=R+1|0){var p=m[R];Wb(w,p,b)&&c.push(new ad(3,null,null,p,null,null))}for(var q=qb(w.a,a,10),X=0,pa=q.length;X<pa;X=X+1|0){var t=q[X],l=[t.c,t.d,t.e];ca(w,l,b)&&c.push(new ad(4,null,null,null,null,t))}return c}function Ub(c,a,b){return ca(c,[a.c,a.d],b)}function Vb(c,a,b){return ca(c,[a.a,
a.b,a.c],b)}function Wb(c,a,b){return ca(c,[a.a.c,a.a.d,a.b.c,a.b.d],b)}function ca(e,a,b){for(var h=0,k=K(b,e.a),m=k.length;h<m;h=h+1|0)for(var c=k[h],f=0,g=a.length;f<g;f=f+1|0){var d=a[f];if(c==d||wb(d,c))return!1}return!0}function Zb(){return u(function(a){a.a.a['float']='right',a.a.a.color=s(yc)})}function _b(){return u(function(a){a.a.a['margin-bottom']='12px'})}function $b(){return u(function(a){a.a.a['font-size']='11px',a.a.a.padding='18px'})}function ac(){return u(function(a){a.a.a['text-align']='center',a.a.a['margin-bottom']='12px',a.a.a['font-weight']='600',a.a.a['text-transform']='uppercase'})}function cc(a){var b=a.getBoundingClientRect();return b.bottom>-1&&b.right>-1&&b.top<=window.innerHeight&&b.left<=window.innerWidth}function dc(a,b){var c=null,d=function(){if(cc(a)){var e=new Date,f=c?+e-+c:1/30;b(f),c=e}requestAnimationFrame(d)};requestAnimationFrame(d)}function Ba(a){return new id(a.a,a.b,a.c,a.d)}function s(a){return 'rgba('+(a.a*255|0)+', '+(a.b*255|0)+', '+(a.c*255|0)+', '+a.d+')'}function ec(b,a){
b.a=Math.min(b.a+a,1),b.b=Math.min(b.b+a,1),b.c=Math.min(b.c+a,1)}function D(a){return new id((a>>16&255)/255,(a>>8&255)/255,(a&255)/255,1)}function lc(){Fa||(Fa=new pd,B(document,'keydown',function(a){Fa.a[a.keyCode]=!0}),B(document,'keyup',function(b){delete Fa.a[b.keyCode]}))}function mc(a){return lc(),a in Fa.a}function nc(a){}function $a(a){return a.c?a.c.target:a.d.target}function A(c){var a=$a(c).getBoundingClientRect(),b=null;return b=c.c?new sd(c.c.clientX,c.c.clientY):new sd(Da(c.d.touches)[0].clientX,Da(c.d.touches)[0].clientY),j(b,new sd(a.left,a.top))}function U(b,a){b.a.ka.push(a),a.Ga()}function ab(a){a.a.ma(),a.a=new md([])}function oc(k,a){B(a,'mousedown',function(b){k.a.Q(new kd(k,b,null)),N(b)}),B(a,'mousemove',function(c){k.a.H(new kd(k,c,null)),N(c)}),B(a,'mouseup',function(d){k.a.O(new kd(k,d,null)),N(d)}),B(a,'mouseleave',function(e){k.a.O(new kd(k,e,null)),N(e)}),B(a,'touchstart',function(f){k.a.Q(new kd(k,null,f)),N(f)}),B(a,'touchmove',function(g){k.a.H(new kd(k,null,g)),N(g)}),B(a,'touchend',
function(h){k.a.O(new kd(k,null,h)),N(h)})}function pc(b,a){return a.a>b.a.a&&a.b>b.a.b&&a.a<b.a.a+b.b.a&&a.b<b.a.b+b.b.b}function Ca(f){for(var a=new Cc,t=0,l=Object.keys(f.a),w=l.length;t<w;t=t+1|0){var b=l[t],c=f.a[b];if(a.a+=b+': '+c+';\n',b in bb)for(var g=0,h=bb[b],k=h.length;g<k;g=g+1|0){var d=h[g];a.a+=d+': '+c+';\n'}if(c in bb)for(var m=0,p=bb[c],q=p.length;m<q;m=m+1|0){var e=p[m];a.a+=b+': '+e+';\n'}}return a.a}function qc(){for(var a=new Cc,b=0;b<10;b=b+1|0){var c=Math.floor(Math.random()*52|0)|0;a.a+='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.slice(c,c+1|0)}return a.a}function u(a){var b=new rd;a(b);var c=rc(cb(b,''));return c in hb||(hb[c]=b,ib[c]=qc(),sc(c)),ib[c]}function sc(a){var b=ib[a];if(!document.getElementById(b)){var c=document.createElement('style');c.type='text/css',c.id=b;var d=hb[a];c.innerHTML=cb(d,b),document.getElementsByTagName('head')[0].appendChild(c)}}function cb(c,a){var b=new Cc;return Object.keys(c.a.a).length&&(b.a+='.'+a+' {\n',b.a+=Ca(c.a),b.a+='}\n'),Object.keys(c.b.a).length&&(b.a+='.'+a+':hover {\n',
b.a+=Ca(c.b),b.a+='}\n'),Object.keys(c.c.a).length&&(b.a+='.'+a+':active {',b.a+=Ca(c.c),b.a+='}\n'),b.a}function r(b,a){return new sd(b.a+a.a,b.b+a.b)}function j(b,a){return new sd(b.a-a.a,b.b-a.b)}function V(b,a){return new sd(b.a*a,b.b*a)}function J(b,a){return new sd(b.a/a,b.b/a)}function W(b,a){return new sd(b.a*Math.cos(a)-b.b*Math.sin(a),b.b*Math.cos(a)+b.a*Math.sin(a))}function M(a){return J(a,x(a))}function x(a){return Math.sqrt(a.a*a.a+a.b*a.b)}function ea(b,a){return b.a*a.a+b.b*a.b}function tc(){return new sd(0,0)}function Da(a){for(var b=[],c=0,d=a.length;c<d;c=c+1|0)b.push(a[c]);return b}function B(a,b,c){a.addEventListener(b,c)}function N(a){a.preventDefault()}function ga(d,a){for(var b=0,c=0,e=d.length;c<e;c=c+1|0)d[c]!=a&&(b<c&&(d[b]=d[c]),b=b+1|0);for(;b<d.length;)d.pop()}function lb(a){return a[a.length-1|0]}function Ha(c,a){for(var d=0,e=a.length;d<e;d=d+1|0){var b=a[d];c.push(b)}}function Z(b,a){~b.indexOf(a)||b.push(a)}function ra(c,a){var b=c.indexOf(a);b>-1&&c.splice(b,1)}function y(c,a,b){
return c[a]=b,c}function ta(c){var a=[];for(var b in c)a.push(c[b]);return a}function sa(c){var a=[];for(var b in c)a.push(b|0);return a}function mb(c){for(var a={},d=0,e=sa(c),f=e.length;d<f;d=d+1|0){var b=e[d];a[b]=c[b]}return a}function uc(a){return new sd(Math.abs(a.a),Math.abs(a.b))}function vc(a,b){return new sd(Math.min(a.a,b.a),Math.min(a.b,b.b))}function db(a){try{return a.getContext('2d')}catch(b){}return null}function eb(a){return a&&a.now?a.now():+new Date}function wc(a){return 'Good job! The new origin is node '+a.a}function Cc(){this.a=''}function Ec(){this.a=this.b=null,this.c=!1}function Fc(a,b){this.a=a,this.b=b,this.c=-1,this.d='error: missing top bar text',this.e=new sd(0,0),this.f=!1,this.g=1,this.h=[]}function Gc(a){var c=this;c.b=c.c=c.d=c.e=c.f=c.g=c.h=c.k=null,c.a=a,c.b=document.createElement('canvas'),c.b.style.width=c.b.style.height='100%',c.c=new Jc,Z(c.c.c,c),c.e=new Yc(c.b),c.d=new Fc(c.c,new Ec),Z(c.d.h,c),c.f=new Zc(c.b),c.g=new nd,oc(c.g,c.b),c.h=new $c(c.d),dc(c.b,function(b){(c.c.h||c.d.b.c)&&(Ob(c.f,
c.d),Lb(c.e,c.d),Pb(c.f,c.d))}),o(c.d,6,0),o(c.d,7,'Welcome to AlphaGraph - choose a tool to get started...'),B(window,'resize',function(){Ja(c)}),Ja(c)}function Ic(a,b,c,d){this.b=-1,this.c=this.d=this.e=null,this.a=a,this.b=wa(),this.c=b,this.d=c,this.e=d,S(this.a,this.c,this),S(this.a,this.d,this),S(this.a,this.e,this)}function Jc(){this.a=[],this.b={},this.c=[],this.d=[],this.e=[],this.f=null,this.g=new Xc,this.h=!1}function Kc(a,b){this.a=a,this.b=b}function Lc(a){this.a=-1,this.b=null,this.c=new sd(0,0),this.d=null,this.e=this.f=!1,this.g=null,this.b=a,this.a=wa()}function Mc(a,b,c){this.b=-1,this.c=this.d=null,this.a=a,this.b=wa(),this.c=b,this.d=c}function Xc(){this.a={}}Xc.aa=function(a){this.a={};for(var c=0,d=a.length;c<d;c=c+1|0){var b=a[c];this.a[b.a]=!0}};Xc.aa.prototype=Xc.prototype;function _c(a,b,c){this.a=this.b=this.c=this.d=null,this.e=new dd,this.a=a,this.b=b,this.c={},this.d=c;for(var e=0,f=K(this.b,this.a.a),g=f.length;e<g;e=e+1|0){var d=f[e];this.c[d.a]=i(d)}}function $c(a){var e=this;e.a=y(y(y(y(y(y(qa(null),
'Backspace',function(f){o(f,3,null)}),'Esc',function(g){o(g,6,1)}),'C',function(h){o(h,6,3)}),'M',function(k){o(k,6,1)}),'V',function(m){o(m,6,1)}),'E',function(p){o(p,6,2)}),B(document,'keydown',function(b){var c=0;b.key!==undefined?c=b.key:b.keyCode!==undefined?c=b.keyCode:b.which!==undefined&&(c=b.which);var d=Rb(e,c);d in e.a&&(e.a[d](a),N(b))})}function ad(a,b,c,d,e,f){this.a=a,this.b=b,this.c=c,this.d=d,this.e=e,this.f=f}function bd(a,b,c){this.a=a,this.b=b,this.c=c}function cd(a,b){this.a=a,this.b=b}function dd(){this.a=null}function ed(a,b){this.a=a,this.b=b}var fd={};function id(a,b,c,d){this.a=a,this.b=b,this.c=c,this.d=d}function kd(a,b,c){this.a=a,this.b=!1,this.c=b,this.d=c}function ld(){}I=ld.prototype;I.Q=function(a){};I.H=function(a){};I.O=function(a){};I.Ga=function(){};I.ma=function(){};function Nc(a){ld.call(this),this.a=a}Dc(Nc,ld);function Sc(a){Nc.call(this,a),this.E=this.fa=null}Dc(Sc,Nc);I=Sc.prototype;I.Q=function(a){this.a.a.f&&(this.E=this.a.a.f,ia(this.E)||o(this.a,8,new Xc.aa([this.E])),
this.fa=new _c(this.a,F(this.a.a.g),j(A(a),this.a.e)),a.b=!0)};I.H=function(a){var b=j(A(a),this.a.e),c=null;if(this.E){var d=Qb(this.fa,this.E,b);c=d.a,a.b=!0}ua(this.a.b,c)};I.O=function(a){this.H(a),this.E&&(a.b=!0,this.E.g&&xa(this.a.a,this.E,this.E.g),this.E=null)};function Tc(a){Nc.call(this,a),this.P=this.oa=this.R=null}Dc(Tc,Nc);I=Tc.prototype;I.Q=function(a){this.P=A(a),this.oa=this.a.e,this.R=$a(a),this.R.style.cursor='move',a.b=!0};I.H=function(a){this.P&&(nb(this.a,r(this.oa,j(A(a),this.P))),this.R.style.cursor='move',a.b=!0)};I.O=function(a){this.P&&(this.H(a),Fb(this),a.b=!0)};function Uc(a){Nc.call(this,a),this.la=null}Dc(Uc,Nc);I=Uc.prototype;I.Q=function(a){this.a.a.f&&(this.la=this.a.a.f)};I.O=function(a){this.la?(o(this.a,8,new Xc.aa([this.la])),this.la=null):o(this.a,8,new Xc)};function Vc(a){Nc.call(this,a),this.X=null}Dc(Vc,Nc);I=Vc.prototype;I.Q=function(a){this.X=j(A(a),this.a.e)};I.H=function(a){var b=j(A(a),this.a.e);if(this.X){var c=vc(this.X,b),d=uc(j(this.X,b)),e=new od(c,d);Ia(this.a.b,
e);for(var f=new Xc,h=0,k=this.a.a.d,m=k.length;h<m;h=h+1|0){var g=k[h];pc(e,i(g))&&(f.a[g.a]=!0)}o(this.a,8,f)}};I.O=function(a){this.X=null,Ia(this.a.b,null)};function Wc(a){Nc.call(this,a)}Dc(Wc,Nc);Wc.prototype.H=function(a){var b=Na(this.a.a,j(A(a),this.a.e),10);xb(this.a.a,b.length>0?b[0]:null)};function Rc(a){Nc.call(this,a),this.w=this.v=this.Y=null,this.w=new dd,this.v=$(a.a),o(this.a,7,'Click somewhere to start creating edges')}Dc(Rc,Nc);I=Rc.prototype;I.ma=function(){this.v&&C(this.a.a,this.v,null)};I.H=function(a){var h=this;h.w.a=h.a.a;var b=j(A(a),h.a.e),c=null,d=h.Y&&"It's a masterpiece!";if(h.v){h.v.d=h.v.g=null,z(h.v,b);var e=new Xc.aa([h.v]),f=za(h.w,h.v,b,e,function(g){return g!=h.Y});f.a&&(c=f.a),f.b!=null&&(d=f.b)}d!=null&&o(h.a,7,d),ua(h.a.b,c)};I.Q=function(a){this.H(a);var b=j(A(a),this.a.e);this.v.g?(xa(this.a.a,this.v,this.v.g),this.Y=this.v.g):this.Y=this.v,this.v=$(this.a.a),z(this.v,b),Ab(this.a.a,this.Y,this.v)};function Oc(a,b,c,d){Nc.call(this,a),this.e=null,this.b=b,this.c=c,this.d=d}
Dc(Oc,Nc);I=Oc.prototype;I.Ga=function(){this.a.f=!0};I.ma=function(){this.a.f=!1};I.Q=function(a){var b=this.a.a.f;b&&!(b.a in this.c.a)&&(this.e=b)};I.H=function(a){o(this.a,7,this.b)};I.O=function(a){this.e&&this.a.a.f==this.e&&this.d(this.a.a.f)};function jd(a,b){ld.call(this),this.pa=a,this.Ea=b}Dc(jd,ld);I=jd.prototype;I.ma=function(){this.Ea.ma()};I.Q=function(a){this.pa()&&this.Ea.Q(a)};I.H=function(a){this.pa()&&this.Ea.H(a)};I.O=function(a){this.pa()&&this.Ea.O(a)};function Pc(a,b,c){Nc.call(this,a),this.h=null,this.f=b,this.g=c}Dc(Pc,Nc);I=Pc.prototype;I.Q=function(a){this.h=a};I.H=function(a){var b=j(A(a),this.a.e);this.h&&x(j(j(A(this.h),this.a.e),b))>3&&(this.g.Q(this.h),this.h=null),this.h||this.g.H(a)};I.O=function(a){this.h?(this.f.Q(this.h),this.f.O(a),this.h=null):this.g.O(a)};function Qc(a){Nc.call(this,a),this.k=this.m=this.p=this.q=this.t=null,this.l=0,this.k=new dd,this.l=2,Qa(this)}Dc(Qc,Nc);I=Qc.prototype;I.ma=function(){switch(this.l){case 0:C(this.a.a,this.m,null),C(this.a.a,this.p,null),
C(this.a.a,this.q,null);break;case 1:C(this.a.a,this.p,null),C(this.a.a,this.q,null);break;case 2:C(this.a.a,this.q,null);break}};I.Q=function(a){this.H(a),T(this).g&&xa(this.a.a,T(this),T(this).g),Qa(this)};I.H=function(a){var b=j(A(a),this.a.e);this.k.a=this.a.a;switch(this.l){case 0:z(this.m,b),z(this.p,b),z(this.q,b);break;case 1:z(this.p,b);var c=j(i(this.p),i(this.m));z(this.q,r(i(this.p),W(c,-1.5707963267948966)));break;case 2:z(this.q,b);break}T(this).d=null,T(this).g=null;var d=new Xc.aa([this.m,this.p,this.q]),e=za(this.k,T(this),b,d,null);o(this.a,7,e.b==null?"It's a masterpiece!":e.b),ua(this.a.b,e.a)};function md(a){ld.call(this),[],this.ka=a}Dc(md,ld);I=md.prototype;I.Ga=function(){for(var b=0,c=this.ka,d=c.length;b<d;b=b+1|0){var a=c[b];a.Ga()}};I.ma=function(){for(var b=0,c=this.ka,d=c.length;b<d;b=b+1|0){var a=c[b];a.ma()}};I.Q=function(a){for(var c=0,d=this.ka,e=d.length;c<e;c=c+1|0){var b=d[c];if(b.Q(a),a.b)break}};I.O=function(a){for(var c=0,d=this.ka,e=d.length;c<e;c=c+1|0){var b=d[c];if(b.O(a),
a.b)break}};I.H=function(a){for(var c=0,d=this.ka,e=d.length;c<e;c=c+1|0){var b=d[c];if(b.H(a),a.b)break}};function nd(){this.a=new md([])}function od(a,b){if(this.a=this.b=null,b.a<0||b.b<0)throw new Error('You constructed a rect with a negative size');this.a=a,this.b=b}function pd(){this.a={}}function qd(){this.a=qa(null)}function rd(){this.a=new qd,this.b=new qd,this.c=new qd}function sd(a,b){this.a=a,this.b=b}fd.PositionControls=function(){React.Component.call(this)};Dc(fd.PositionControls,React.Component);I=fd.PositionControls.prototype;I.displayName=function(){return'PositionControls'};I._renderPositionItem=function(){var a='Mixed',b=F(this.props.e.a.g);if(ta(b.a).length==1){var c=i(Ma(this.props.e.a,sa(b.a)[0]));a=(c.a|0)+', '+(c.b|0)}return React.createElement(new fd.PropertyItem().constructor,new Object(new hd('POSITION',a)),[])};I._renderOriginItem=function(a,b,c){var d='Mixed';return c.length==1&&!c[0]?d='0, 0':c.length==1&&c[0]&&(d='Node '+c[0].a),React.createElement(new fd.PropertyItem().constructor,
new Object(new hd('ORIGIN',d)),[])};I._renderOriginControls=function(){var e=this,a=e.props.e.a,b=F(e.props.e.a.g),c=Yb(a,b),d=null;return d=c.length==1&&!c[0]?G.div(new Object({className:Aa(),onClick:function(){e.props.d(7,'Choose a node as the origin'),e.props.d(0,null)}}),'Choose origin'):G.div(new Object({style:new Object({marginBottom:'12px'})}),G.span(new Object({className:Aa(),onClick:function(){e.props.d(0,null)}}),'Change origin'),' or ',G.span(new Object({className:Aa(),onClick:function(){e.props.d(1,null)}}),'clear it')),G.div(null,e._renderOriginItem(a,b,c),d)};I.render=function(){var a=u(function(b){b.a.a.width='100%'});return G.div(new Object({className:a}),this._renderPositionItem(),this._renderOriginControls())};fd.PropertyItem=function(){React.Component.call(this)};Dc(fd.PropertyItem,React.Component);I=fd.PropertyItem.prototype;I.displayName=function(){return'PropertyItem'};I.render=function(){return G.div(new Object({className:_b()}),G.span(new Object({}),this.props.a),G.span(new Object({className:Zb()}),
this.props.b))};fd.InspectorView=function(){React.Component.call(this)};Dc(fd.InspectorView,React.Component);I=fd.InspectorView.prototype;I.displayName=function(){return'InspectorView'};I.render=function(){var a=this.props.e.a,b=F(a.g),c=ta(b.a).length,d='0 nodes selected';d=c^1?c+' nodes selected':'1 node selected';var e=G.div(new Object({className:ac()}),React.createElement(new fd.PropertyItem().constructor,new Object(new hd(d,null)),[])),f=null;return ta(F(a.g).a).length>0&&(f=React.createElement(new fd.PositionControls().constructor,new Object(this.props),[])),G.div(new Object({className:$b()}),e,f)};fd.ToolbarView=function(){React.Component.call(this)};Dc(fd.ToolbarView,React.Component);I=fd.ToolbarView.prototype;I.displayName=function(){return'ToolbarView'};I.render=function(){for(var a=u(function(b){b.a.a.width=b.a.a.height='100%'}),c=[],e=0,f=[1,2,3],g=f.length;e<g;e=e+1|0){var d=f[e];c.push(this._renderTool(d))}return G.div(new Object({className:a}),c)};I._renderTool=function(a){var d=this,b=u(function(c){
a^d.props.c?(c.a.a['background-color']=s(Ya),c.c.a['background-color']=s(bc),c.b.a['background-color']=s(xc)):c.a.a['background-color']=s(bc),c.a.a['background-image']="url('"+Xb(a)+"')",c.a.a['background-position']='center',c.a.a['background-repeat']='no-repeat',c.a.a.width=c.a.a.height='54px'});return G.div(new Object({key:'tool-button-'+Bc[a],className:b,onClick:function(){d.props.d(6,a)}}))};fd.GraphAppView=function(){React.Component.call(this)};Dc(fd.GraphAppView,React.Component);I=fd.GraphAppView.prototype;I.displayName=function(){return'GraphAppView'};I.render=function(){var a=u(function(b){b.a.a.width=b.a.a.height='100%',b.a.a.overflow='hidden',b.a.a['font-family']="'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",b.a.a.color='#444',b.a.a.display='flex',b.a.a['flex-direction']='column'}),c=u(function(d){d.a.a.width=d.a.a.height='100%',d.a.a.display='flex'}),e=u(function(f){f.a.a.width='54px',f.a.a.height='100%',f.a.a['background-color']=s(Ya),f.a.a['border-right']='1px solid '+s(gb)}),g=u(function(h){
h.a.a.width=h.a.a.height='100%',h.a.a['background-color']='white'}),k=u(function(m){m.a.a.width='216px',m.a.a.height='100%',m.a.a['background-color']=s(Ya),m.a.a['border-left']='1px solid '+s(gb)});return G.div(new Object({className:a}),this._renderTopBar(),G.div(new Object({className:c}),G.div(new Object({className:e}),React.createElement(new fd.ToolbarView().constructor,this.props)),G.div(new Object({className:g}),this._renderCanvas()),G.div(new Object({className:k}),React.createElement(new fd.InspectorView().constructor,this.props))))};I._renderTopBar=function(){var a=u(function(b){b.a.a.width='100%',b.a.a.height='36px',b.a.a['border-bottom']='1px solid '+s(gb),b.a.a['text-align']='center',b.a.a['line-height']='36px',b.a.a['font-size']='12px',b.a.a['letter-spacing']='1.1px'});return G.div(new Object({className:a+' '+ob(this.props.e)}),this.props.b)};I._renderCanvas=function(){var e=this,a=function(b){b&&b.appendChild(e.props.a)},c=u(function(d){d.a.a.width=d.a.a.height='100%'});return G.div(new Object({ref:a,
className:c}))};function Yc(a){this.b=this.c=null,this.a=a,this.b=db(a)}function Zc(a){this.b=null,this.a=a,this.b=db(this.a)}function gd(a,b,c,d,e){this.a=a,this.b=b,this.c=c,this.d=d,this.e=e}function hd(a,b){this.a=a,this.b=b}var G=React.DOM,fb=-1,Ya=D(15921906),xc=D(16316664),bc=D(14737632),gb=D(12434877),Za=D(6710886),yc=D(10066329),fc=D(9391359),gc=D(2525183),zc=D(10540785),da=D(7327639),hc=D(16777215),Fa=null,bb=y(y(qa(null),'flex',['-webkit-flex']),'flex-direction',['-webkit-flex-direction']),hb={},ib={},Ac=['CHOOSE_ORIGIN_FOR_SELECTION','CLEAR_ORIGIN_FOR_SELECTION','SET_ORIGIN_FOR_SELECTION','DELETE_SELECTION','REMOVE_TEMPORARY_BEHAVIORS','SET_TEMPORARY_BEHAVIORS','SET_TOOL','SET_TOP_BAR_TEXT','SET_SELECTION'],Bc=['NONE','MOVE','EDGE','CIRCLE'];Hc()})();
