var g=Object.defineProperty,k=Object.defineProperties;var m=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var s=(e,t,a)=>t in e?g(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,o=(e,t)=>{for(var a in t||(t={}))h.call(t,a)&&s(e,a,t[a]);if(i)for(var a of i(t))Q.call(t,a)&&s(e,a,t[a]);return e},l=(e,t)=>k(e,m(t));import{a8 as q,ap as v,aq as S,m as r,ab as y,as as b,a6 as f}from"./vendor.eeb8c9cb.js";const w=["text","rect","circle","QBtn","QBadge","QChip","QToolbar","QCheckbox","QRadio","QToggle","QSlider","QRange","QInput","QAvatar"],x=["wave","pulse","pulse-x","pulse-y","fade","blink","none"];var B=q({name:"QSkeleton",props:l(o({},v),{tag:{type:String,default:"div"},type:{type:String,validator:e=>w.includes(e),default:"rect"},animation:{type:String,validator:e=>x.includes(e),default:"wave"},animationSpeed:{type:[String,Number],default:1500},square:Boolean,bordered:Boolean,size:String,width:String,height:String}),setup(e,{slots:t}){const a=f(),d=S(e,a.proxy.$q),u=r(()=>{const n=e.size!==void 0?[e.size,e.size]:[e.width,e.height];return{"--q-skeleton-speed":`${e.animationSpeed}ms`,width:n[0],height:n[1]}}),c=r(()=>`q-skeleton q-skeleton--${d.value===!0?"dark":"light"} q-skeleton--type-${e.type}`+(e.animation!=="none"?` q-skeleton--anim q-skeleton--anim-${e.animation}`:"")+(e.square===!0?" q-skeleton--square":"")+(e.bordered===!0?" q-skeleton--bordered":""));return()=>y(e.tag,{class:c.value,style:u.value},b(t.default))}});export{B as Q};
