(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=5)})([function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),b.h=function(a,b){for(var c,d=[],e=[],f=arguments.length;2<f--;)d.push(arguments[f]);for(;d.length;)if((c=d.pop())&&c.pop)for(f=c.length;f--;)d.push(c[f]);else null!=c&&!0!==c&&!1!==c&&e.push(c);return'function'==typeof a?a(b||{},e):{nodeName:a,attributes:b||{},children:e,key:b&&b.key}},b.app=function(a,b,c,d){function e(a,b){return{nodeName:a.nodeName.toLowerCase(),attributes:{},children:b.call(a.childNodes,function(a){return 3===a.nodeType?a.nodeValue:e(a,b)})}}function f(){s=!s;var a=c(w,x);for(d&&!s&&(u=r(d,u,v,v=a));a=t.pop();)a()}function g(){s||(s=!s,setTimeout(f))}function h(a,b){var c={};for(var d in a)c[d]=a[d];for(var d in b)c[d]=b[d];return c}function i(a,b,c){var d={};return a.length?(d[a[0]]=1<a.length?i(a.slice(1),b,c[a[0]]):b,h(c,d)):b}function j(a,b){for(var c=0;c<a.length;c++)b=b[a[c]];return b}function k(a,b,c){for(var d in c)'function'==typeof c[d]?function(d,e){c[d]=function(d){return'function'==typeof(d=e(d))&&(d=d(j(a,w),c)),d&&d!==(b=j(a,w))&&!d.then&&g(w=i(a,h(b,d),w)),d}}(d,c[d]):k(a.concat(d),b[d]=b[d]||{},c[d]=h(c[d]))}function l(a){return a?a.key:null}function m(a,b,c,d,e){if('key'===b);else if('style'===b)for(var f in h(e,c))a[b][f]=null==c||null==c[f]?'':c[f];else'function'==typeof c||b in a&&!d?a[b]=null==c?'':c:null!=c&&!1!==c&&a.setAttribute(b,c),(null==c||!1===c)&&a.removeAttribute(b)}function n(a,b){var c='string'==typeof a||'number'==typeof a?document.createTextNode(a):(b=b||'svg'===a.nodeName)?document.createElementNS('http://www.w3.org/2000/svg',a.nodeName):document.createElement(a.nodeName);if(a.attributes){a.attributes.oncreate&&t.push(function(){a.attributes.oncreate(c)});for(var d=0;d<a.children.length;d++)c.appendChild(n(a.children[d],b));for(var e in a.attributes)m(c,e,a.attributes[e],b)}return c}function o(a,b,c,d){for(var e in h(b,c))c[e]!==('value'==e||'checked'==e?a[e]:b[e])&&m(a,e,c[e],d,b[e]);c.onupdate&&t.push(function(){c.onupdate(a,b)})}function p(a,b,c){if(c=b.attributes){for(var d=0;d<b.children.length;d++)p(a.childNodes[d],b.children[d]);c.ondestroy&&c.ondestroy(a)}return a}function q(a,b,c,d){function e(){a.removeChild(p(b,c))}c.attributes&&(d=c.attributes.onremove)?d(b,e):e()}function r(a,b,c,d,e,f){if(d===c);else if(null==c)b=a.insertBefore(n(d,e),b);else if(d.nodeName&&d.nodeName===c.nodeName){o(b,c.attributes,d.attributes,e=e||'svg'===d.nodeName);for(var g=[],h={},k={},m=0;m<c.children.length;m++){g[m]=b.childNodes[m];var i=c.children[m],p=l(i);null!=p&&(h[p]=[g[m],i])}for(var m=0,s=0;s<d.children.length;){var i=c.children[m],j=d.children[s],p=l(i),t=l(j);if(k[p]){m++;continue}if(null==t)null==p&&(r(b,g[m],i,j,e),s++),m++;else{var u=h[t]||[];p===t?(r(b,u[0],u[1],j,e),m++):u[0]?r(b,b.insertBefore(u[0],g[m]),u[1],j,e):r(b,g[m],null,j,e),s++,k[t]=j}}for(;m<c.children.length;){var i=c.children[m];null==l(i)&&q(b,g[m],i),m++}for(var m in h)k[h[m][1].key]||q(b,h[m][0],h[m][1])}else d.nodeName===c.nodeName?b.nodeValue=d:(b=a.insertBefore(n(d,e),f=b),q(a,f,c));return b}var s,t=[],u=d&&d.children[0]||null,v=u&&e(u,[].map),w=h(a),x=h(b);return g(k([],w,x)),x}},function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),b.default={AUTHOR_COOKIE_NAME:'k-comm-author',RECAPTCHA_CALLBACK:'__recaptcha_done',STATE:{LOADED:'loaded',LOADING:'loading',UNKNOWN:'unknown'},RECAPTCHA_SCRIPT_NAME:'recaptcha_script',RECAPTCHA_DIV_PREFIX:'recaptcha_reply_'}},function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0});var c='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};b.default={s:document.cookie,type:'cookie',set:function(a,b,d,e,f){if(b!==void 0&&'object'===('undefined'==typeof b?'undefined':c(b)))var g=JSON.stringify(b);else var g=encodeURIComponent(b);document.cookie=a+'='+g+(d?'; expires='+new Date(d).toUTCString():'')+'; path='+(e||'/')+(f?'; secure':'')},get:function(a){var b=this.getAllRawOrProcessed(!1);return b.hasOwnProperty(a)?this.processValue(b[a]):void 0},processValue:function(a){if('{'==a.substring(0,1))try{return JSON.parse(a)}catch(b){return a}return'undefined'==a?void 0:decodeURIComponent(a)},getAllRawOrProcessed:function(a){var b=document.cookie.split('; '),c={};if(1===b.length&&''===b[0])return c;for(var d,e=0;e<b.length;e++)d=b[e].split('='),c[d[0]]=a?this.processValue(d[1]):d[1];return c},getAll:function(){return this.getAllRawOrProcessed(!0)},remove:function(a){this.set(a,'',-1)},removeAll:function(){var a=this.getAll();for(var b in a)this.remove(b);return this.getAll()}}},function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),b.getRecaptchaCallbackName=function(a){return'undefined'==typeof a&&(a='root'),e.default.RECAPTCHA_CALLBACK+'_'+a},b.getRecaptchaDivId=function(a){return'undefined'==typeof a&&(a='root'),e.default.RECAPTCHA_DIV_PREFIX+a};var d=c(1),e=function(a){return a&&a.__esModule?a:{default:a}}(d)},function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});var d=c(0),e=c(1),f=function(a){return a&&a.__esModule?a:{default:a}}(e),g=c(3),h={show:!1,body:''};b.default=function(a){var b=a.comment,c=a.author,f=a.updateReply,i=a.sendReply,j=a.updateAuthor,e=a.settings,k=b.reply?b.reply:h,l=c&&c.name?c.name:'',m=c&&c.email?c.email:'',n=(0,g.getRecaptchaDivId)(b.id),o=b.postingReply?(0,d.h)('div',{class:'loader-container'},(0,d.h)('div',{class:'loader'}),' '):'';return k.show?(0,d.h)('div',{class:'reply-form'},o,(0,d.h)('textarea',{placeholder:'What do you think?',oninput:function(a){return a.preventDefault()||f({comment:b,field:'body',value:a.target.value})}},k.body||''),(0,d.h)('input',{type:'text',placeholder:'Name',oninput:function(a){return a.preventDefault()||j({field:'name',value:a.target.value})},value:l}),(0,d.h)('input',{type:'text',placeholder:'Email (not published)',oninput:function(a){return a.preventDefault()||j({field:'email',value:a.target.value})},value:m}),(0,d.h)('div',{id:n,class:'g-recaptcha'}),(0,d.h)('button',{class:'bttn-material-flat bttn-sm bttn-primary bttn-no-outline',onclick:function(a){return a.preventDefault()||i({comment:b})}},'Send')):null}},function(a,b,c){c(6),a.exports=c(14)},function(a,b,c){'use strict';function d(a){return a&&a.__esModule?a:{default:a}}var e,f=c(0),g=c(7),h=d(g),j=c(9),k=d(j),l=c(10),m=d(l),n=!0,o=!1;try{for(var p,q=document.getElementsByClassName('k-comments')[Symbol.iterator]();!(n=(p=q.next()).done);n=!0){var r=p.value,i=Object.assign({},k.default);(0,f.app)(i,h.default,m.default,r).load({server:r.dataset.kServer,uri:r.dataset.kUri})}}catch(a){o=!0,e=a}finally{try{!n&&q.return&&q.return()}finally{if(o)throw e}}},function(a,b,c){'use strict';function d(a){return a&&a.__esModule?a:{default:a}}function e(){return new Date().getTime()+157680000000}Object.defineProperty(b,'__esModule',{value:!0});var f=c(1),g=d(f),h=c(2),i=d(h),j=c(8),k=d(j),l=c(3),m={method:'post',headers:{"Content-type":'application/json; charset=UTF-8'},mode:'cors'};b.default={sendReply:function(a){var b=a.comment;return async function(a,c){return b.postingReply=!0,c.setNewState({commentMap:a.commentMap}),c.withRecaptchaScript(function(){'undefined'!=typeof b.recaptcha&&(console.log('reseting recaptcha with widget id ',b.recaptcha),grecaptcha.reset(b.recaptcha));var d=(0,l.getRecaptchaCallbackName)(b.id),e=(0,l.getRecaptchaDivId)(b.id);b.recaptcha=grecaptcha.render(e,{sitekey:a.settings.recaptcha.sitekey,size:'invisible',callback:d,"error-callback":function(a){console.log('error recaptcha ',a)},"expired-callback":function(a){console.log('expired-callback',a)}}),console.log('loaded new recaptcha widget with id ',b.recaptcha),window[d]=async function(){delete window[d],await c.postReplyToServer({comment:b});a.commentMap[b.id].postingReply=!1;c.setNewState({commentMap:a.commentMap})},c.setNewState({commentMap:a.commentMap}),grecaptcha.execute(b.recaptcha)}),{}}},postReplyToServer:function(a){var b=a.comment;return async function(a,c){fetch(a.server+'api/v1/comment',Object.assign({},m,{body:JSON.stringify({body:b.reply.body,email:a.author.email,author:a.author.name,uri:a.uri,parent:b._isRootComment?void 0:b.id,recaptcha:'temp'})})).then(function(a){return a.json()}).then(function(d){a.commentMap[d.id]=d,b._isRootComment?(a.rootComment.reply={},a.commentOrderList.push(d.id)):'undefined'!=typeof a.commentMap[b.id]&&(a.commentMap[b.id].replies.push(d),a.commentMap[b.id].reply={}),b.postingReply=!1,c.setNewState({rootComment:a.rootComment,commentMap:a.commentMap,commentOrderList:a.commentOrderList})})}},updateReply:function(a){var b=a.comment,c=a.field,d=a.value;return function(a){return('undefined'==typeof b.reply&&(b.reply={}),b.reply[c]=d,b._isRootComment)?{rootComment:b}:(a.commentMap[b.id]=b,{commentMap:a.commentMap})}},updateAuthor:function(a){var b=a.field,c=a.value;return function(a){return a.author[b]=c,i.default.set(g.default.AUTHOR_COOKIE_NAME,a.author,e()),{author:a.author}}},setScriptLoaded:function(a){return function(b){return b.loadedScripts[a]=!0,{loadedScripts:b.loadedScripts}}},withRecaptchaScript:function(a){return function(b,c){return b.loadedScripts[g.default.RECAPTCHA_SCRIPT_NAME]?(console.log('not loading recaptcha'),setTimeout(a,0)):(console.log('loading recaptcha'),c.setNewState({loadingScript:!0}),window[g.default.RECAPTCHA_CALLBACK]=function(){b.loadedScripts[g.default.RECAPTCHA_SCRIPT_NAME]=!0,c.setNewState({loadingScript:!1,loadedScripts:b.loadedScripts}),delete window[g.default.RECAPTCHA_CALLBACK],a()},(0,k.default)(['https://www.google.com/recaptcha/api.js?onload='+g.default.RECAPTCHA_CALLBACK+'&render=explicit'])),{}}},react:function(a){var b=a.comment,c=a.reaction;return async function(a,d){var e;if('undefined'==typeof b||'undefined'==typeof b.id)return void console.log('react(): comment or comment id are not present');if('dislike'===c)e='dislike';else if('like'===c)e='like';else return void console.log('unexpected reaction: ',c);await fetch(a.server+'api/v1/'+e,Object.assign({},m,{body:JSON.stringify({id:b.id})}));a.commentMap[b.id][e+'s']++,d.setNewState({commentMap:a.commentMap})}},toggleReplyForm:function(a){return function(b){return('undefined'==typeof a.reply&&(a.reply={}),a.reply.show=!a.reply.show,a._isRootComment)?{rootComment:a}:(b.commentMap[a.id]=a,{commentMap:b.commentMap})}},setNewState:function(a){return a},load:function(a){var b=a.server,c=a.uri;return async function(a,d){var e=await fetch(b+'api/v1/comments?uri='+encodeURIComponent(c)).then(function(a){return a.json()}).then(function(a){var b,c=[],d=[],e=function(a,b){var d,e=!0,f=!1;try{for(var g,h,i=b[Symbol.iterator]();!(e=(g=i.next()).done);e=!0)h=g.value,c[h.id]=h}catch(a){f=!0,d=a}finally{try{!e&&i.return&&i.return()}finally{if(f)throw d}}},f=!0,g=!1;try{for(var h,i,j=a.comments[Symbol.iterator]();!(f=(h=j.next()).done);f=!0)i=h.value,c[i.id]=i,d.push(i.id),e(c,i.replies)}catch(a){g=!0,b=a}finally{try{!f&&j.return&&j.return()}finally{if(g)throw b}}return{state:'loaded',list:d,map:c}});d.setNewState({commentOrderList:e.list,commentMap:e.map,state:g.default.STATE.LOADED,server:b,uri:c})}}}},function(a,b){'use strict';var c,d,e,f='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};(function(f,g){d=[],c=g,e='function'==typeof c?c.apply(b,d):c,!(e!==void 0&&(a.exports=e))})(void 0,function(){function a(a,b){a=a.push?a:[a];var c,d,e,f,g=[],h=a.length,i=h;for(c=function(a,c){c.length&&g.push(a),i--,i||b(g)};h--;){if(d=a[h],e=j[d],e){c(d,e);continue}f=k[d]=k[d]||[],f.push(c)}}function b(a,b){if(a){var c=k[a];if(j[a]=b,!!c)for(;c.length;)c[0](a,b),c.splice(0,1)}}function c(a,b){a.call&&(a={success:a}),b.length?(a.error||g)(b):(a.success||g)(a)}function d(a,b,c,f){var h,i,e=document,j=c.async,k=(c.numRetries||0)+1,l=c.before||g;f=f||0,/(^css!|\.css$)/.test(a)?(h=!0,i=e.createElement('link'),i.rel='stylesheet',i.href=a.replace(/^css!/,'')):(i=e.createElement('script'),i.src=a,i.async=void 0===j||j),i.onload=i.onerror=i.onbeforeload=function(e){var g=e.type[0];if(h&&'hideFocus'in i)try{i.sheet.cssText.length||(g='e')}catch(a){g='e'}return'e'==g&&(f+=1,f<k)?d(a,b,c,f):void b(a,g,e.defaultPrevented)},!1!==l(a,i)&&e.head.appendChild(i)}function e(a,b,c){a=a.push?a:[a];var e,f,g=a.length,h=g,i=[];for(e=function(a,c,d){if('e'==c&&i.push(a),'b'==c)if(d)i.push(a);else return;g--,g||b(i)},f=0;f<h;f++)d(a[f],e,c)}function f(a,d,f){var g,i;if(d&&d.trim&&(g=d),i=(g?f:d)||{},g)if(g in h)throw'LoadJS';else h[g]=!0;e(a,function(a){c(i,a),b(g,a)},i)}var g=function(){},h={},j={},k={};return f.ready=function(b,d){return a(b,function(a){c(d,a)}),f},f.done=function(a){b(a,[])},f.reset=function(){h={},j={},k={}},f.isDefined=function(a){return a in h},f})},function(a,b,c){'use strict';function d(a){return a&&a.__esModule?a:{default:a}}Object.defineProperty(b,'__esModule',{value:!0});var e=c(2),f=d(e),g=c(1),h=d(g);b.default={server:'initial',uri:'',author:f.default.get(h.default.AUTHOR_COOKIE_NAME)||{name:'',email:''},state:h.default.STATE.UNKNOWN,commentMap:{},commentOrderList:[],rootComment:{_isRootComment:!0},settings:{recaptcha:{sitekey:'6LfPnjMUAAAAAJDZP70cFhHl_68jbL-GhB2DWn5H'}},loadedScripts:{},loadingScript:!1}},function(a,b,c){'use strict';function d(a){return a&&a.__esModule?a:{default:a}}Object.defineProperty(b,'__esModule',{value:!0});var e=c(0),f=c(4),g=d(f),h=c(11),i=d(h);b.default=function(a,b){return(0,e.h)('div',{style:{width:'100%'}},(0,e.h)('a',{href:'',onclick:function(c){return c.preventDefault()||b.toggleReplyForm(a.rootComment)}},'Post comment'),(0,e.h)('br',null),(0,e.h)(g.default,{comment:a.rootComment,updateReply:b.updateReply,sendReply:b.sendReply,updateAuthor:b.updateAuthor,author:a.author}),(0,e.h)('ul',null,a.commentOrderList.map(function(c){return(0,e.h)(i.default,{comment:a.commentMap[c],toggleReplyForm:b.toggleReplyForm,updateReply:b.updateReply,sendReply:b.sendReply,updateAuthor:b.updateAuthor,author:a.author,react:b.react,settings:a.settings})})))}},function(a,b,c){'use strict';function d(a){return a&&a.__esModule?a:{default:a}}Object.defineProperty(b,'__esModule',{value:!0});var e=c(0),f=c(12),g=d(f),h=c(4),i=d(h),j=(0,g.default)();b.default=function a(b){var c,d=b.comment,f=b.toggleReplyForm,g=b.updateReply,h=b.sendReply,k=b.author,l=b.updateAuthor,m=b.react,n=b.settings,o=0===d.replies.length?(0,e.h)('div',null):(0,e.h)('ul',{class:'children'},d.replies.map(function(b){return(0,e.h)(a,{comment:b,updateReply:g,sendReply:h,toggleReplyForm:f,updateAuthor:l,author:k,react:m,settings:n})}));return c='undefined'!=typeof d.reply&&d.reply.show?(0,e.h)(i.default,{comment:d,updateReply:g,sendReply:h,updateAuthor:l,author:k,settings:n}):(0,e.h)('div',null),(0,e.h)('li',{class:'comment'},(0,e.h)('div',{class:'k__avatar'},(0,e.h)('img',{src:'https://www.gravatar.com/avatar/'+d.email+'?s=48'})),(0,e.h)('div',null,(0,e.h)('div',{class:'comment-body'},(0,e.h)('div',{class:'comment-header'},(0,e.h)('div',{class:'comment-author'},(0,e.h)('b',null,d.author?d.author:'Anonymous'),' \u2022 ',(0,e.h)('span',{class:'time'},j.format(d.created)))),(0,e.h)('p',null,d.body))),(0,e.h)('div',{class:'comment-footer'},(0,e.h)('ul',null,(0,e.h)('li',{class:'like'},(0,e.h)('a',{href:'',onclick:function(a){return a.preventDefault()||m({comment:d,reaction:'like'})}},(0,e.h)('i',{class:'icon-thumbs-up'}),d.likes)),(0,e.h)('li',{class:'dislike'},(0,e.h)('a',{href:'',onclick:function(a){return a.preventDefault()||m({comment:d,reaction:'dislike'})}},(0,e.h)('i',{class:'icon-thumbs-down'}),d.dislikes)),(0,e.h)('li',{class:'reply'},(0,e.h)('a',{href:'',onclick:function(a){return a.preventDefault()||f(d)}},'Reply')))),c,o)}},function(a,b,c){'use strict';(function(a){var b='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};!function(c,d){'object'==b(a)&&a.exports?(a.exports=d(),a.exports.default=a.exports):c.timeago=d()}('undefined'==typeof window?void 0:window,function(){function b(a){return a instanceof Date?a:isNaN(a)?/^\d+$/.test(a)?new Date(g(a)):(a=(a||'').trim().replace(/\.\d+/,'').replace(/-/,'/').replace(/-/,'/').replace(/(\d)T(\d)/,'$1 $2').replace(/Z/,' UTC').replace(/([\+\-]\d\d)\:?(\d\d)/,' $1$2'),new Date(a)):new Date(g(a))}function g(a){return parseInt(a)}function j(b,c,e){c=s[c]?c:s[e]?e:'en';for(var f=0,h=0>b?1:0,i=b=d(b);b>=l[f]&&f<p;f++)b/=l[f];return b=g(b),f*=2,b>(0===f?9:1)&&(f+=1),s[c](b,f,i)[h].replace('%s',b)}function k(a,c){return((c=c?b(c):new Date)-b(a))/1e3}function n(a){for(var b=1,c=0,e=d(a);a>=l[c]&&c<p;c++)a/=l[c],b*=l[c];return e%=b,e=e?b-e:b,Math.ceil(e)}function o(a){return i(a,'data-timeago')||i(a,'datetime')}function i(a,b){return a.getAttribute?a.getAttribute(b):a.attr?a.attr(b):void 0}function q(a,b){return a.setAttribute?a.setAttribute(h,b):a.attr?a.attr(h,b):void 0}function a(a,b){this.nowDate=a,this.defaultLocale=b||'en'}function c(b,c){return new a(b,c)}var d=Math.abs,r=['second','minute','hour','day','week','month','year'],f=['\u79D2','\u5206\u949F','\u5C0F\u65F6','\u5929','\u5468','\u6708','\u5E74'],s={en:function(a,b){if(0===b)return['just now','right now'];var c=r[parseInt(b/2)];return 1<a&&(c+='s'),[a+' '+c+' ago','in '+a+' '+c]},zh_CN:function(a,b){if(0===b)return['\u521A\u521A','\u7247\u523B\u540E'];var c=f[parseInt(b/2)];return[a+c+'\u524D',a+c+'\u540E']}},l=[60,60,24,7,4.345238095238096,12],p=6,h='data-tid',m={};return a.prototype.doRender=function(b,f,e){var g,a=k(f,this.nowDate),c=this;b.innerHTML=j(a,e,this.defaultLocale),m[g=setTimeout(function(){c.doRender(b,f,e),delete m[g]},Math.min(1e3*n(a),2147483647))]=0,q(b,g)},a.prototype.format=function(a,b){return j(k(a,this.nowDate),b,this.defaultLocale)},a.prototype.render=function(a,b){void 0===a.length&&(a=[a]);for(var c=0,d=a.length;c<d;c++)this.doRender(a[c],o(a[c]),b)},a.prototype.setLocale=function(a){this.defaultLocale=a},c.register=function(a,b){s[a]=b},c.cancel=function(a){if(a)(b=i(a,h))&&(clearTimeout(b),delete m[b]);else{for(var b in m)clearTimeout(b);m={}}},c})}).call(b,c(13)(a))},function(a){'use strict';a.exports=function(a){return a.webpackPolyfill||(a.deprecate=function(){},a.paths=[],!a.children&&(a.children=[]),Object.defineProperty(a,'loaded',{enumerable:!0,get:function(){return a.l}}),Object.defineProperty(a,'id',{enumerable:!0,get:function(){return a.i}}),a.webpackPolyfill=1),a}},function(){}]);