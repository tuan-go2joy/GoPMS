var Qo=Object.defineProperty,bo=Object.defineProperties;var Ro=Object.getOwnPropertyDescriptors;var S=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var G=(o,e,t)=>e in o?Qo(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,l=(o,e)=>{for(var t in e||(e={}))K.call(e,t)&&G(o,t,e[t]);if(S)for(var t of S(e))z.call(e,t)&&G(o,t,e[t]);return o},c=(o,e)=>bo(o,Ro(e));var J=(o,e)=>{var t={};for(var a in o)K.call(o,a)&&e.indexOf(a)<0&&(t[a]=o[a]);if(o!=null&&S)for(var a of S(o))e.indexOf(a)<0&&z.call(o,a)&&(t[a]=o[a]);return t};import{Q as W,a as So}from"./QCard.c20bfcde.js";import{Q as Co}from"./QDialog.3faf22fe.js";import{_ as X,aH as Z,h as Mo,d as D,g as oo,bb as eo,m as F,o as b,n as ro,w as R,u as s,c as V,F as ho,K as Io,a as p,$ as O,j as to,D as wo,R as Fo,q as so,l as Vo,am as Oo,H as xo,C as no}from"./vendor.eeb8c9cb.js";import{a as x,Q as f,_ as jo,u as ao}from"./index.79b96d91.js";import{Q as qo}from"./QSkeleton.bf4df3d0.js";import{t as Eo,e as C,a as Lo,b as j,Q as Uo}from"./index.e9c5546a.js";import{Q as uo}from"./QSelect.3ba49c3b.js";import{Q as ko}from"./QForm.d45826d0.js";import{a as q,u as Bo}from"./useNotify.283984e3.js";import{u as To,a as No}from"./useRoomsQuery.02554421.js";const $o=async o=>{const{data:e}=await x.post("/rooms/create/",o);return e},Yo=()=>{const o=Z(),{findRoomTypeCodeById:e}=q(),t=r=>{const u=o.getQueryData(f.ROOMS),m=e(r.room_type);!u||!m||o.setQueryData(f.ROOMS,()=>u.map(n=>n.room_floor_id!==r.room_floor?n:c(l({},n),{list_rooms:[{id:r.id,name:r.name,room_type_code:m,room_type_id:r.id},...n.list_rooms]})))},a=r=>{const u=o.getQueryData(f.ROOM_TYPES);!u||o.setQueryData(f.ROOM_TYPES,()=>u.map(m=>m.id!==r.room_type?m:c(l({},m),{num_of_room:m.num_of_room+1})))};return X($o,{onSuccess:r=>{a(r),t(r)}})},Ao=async({queryKey:o})=>{const[,e]=o;if(!e)return;const{data:t}=await x.get(`/rooms/get/${e}`);return t},Po=o=>{const e=[f.ROOMS,o];return Mo(e,Ao)},Ho=async t=>{var a=t,{room_id:o}=a,e=J(a,["room_id"]);const{data:r}=await x.put(`/rooms/update/${o}`,l({},e));return r},Ko=()=>{const o=Z(),{findRoomTypeCodeById:e}=q(),t=r=>{const u=o.getQueryData(f.ROOMS);if(!u)return;const m=u.flatMap(({list_rooms:_,room_floor_id:i,room_floor_name:v})=>_.map(M=>c(l({},M),{room_floor_id:i,room_floor_name:v}))).find(_=>_.id===r.id);if(!m)return;const n=e(r.room_type);if(!!n)return o.setQueryData(f.ROOMS,()=>{switch(m.room_floor_id!==r.room_floor){case!0:return u.map(i=>i.room_floor_id!==r.room_floor?c(l({},i),{list_rooms:i.list_rooms.filter(v=>v.id!==r.id)}):c(l({},i),{list_rooms:[...i.list_rooms,{id:r.id,name:r.name,room_type_code:n,room_type_id:r.room_type}]}));case!1:return u.map(i=>i.room_floor_id!==r.room_floor?i:c(l({},i),{list_rooms:i.list_rooms.map(v=>v.id!==r.id?v:{id:r.id,name:r.name,room_type_code:n,room_type_id:r.room_type})}))}}),m.room_type_code},a=(r,u)=>{const m=o.getQueryData(f.ROOM_TYPES);!m||!u||o.setQueryData(f.ROOM_TYPES,()=>m.map(n=>n.id===r.room_type?c(l({},n),{num_of_room:n.num_of_room+1}):n.code===u?c(l({},n),{num_of_room:n.num_of_room-1}):n))};return X(Ho,{onSuccess:r=>{const u=t(r);a(r,u)}})};const zo={key:0,class:"wrapper"},Go={key:1,class:"wrapper"},Jo={class:"q-mt-md row justify-end q-gutter-md"},Wo=D({props:{roomId:{type:[String,Number],required:!0}},setup(o){var T;const e=o,{notifySaveSuccess:t,notifySaveFailed:a}=Bo(),r=oo(),u=eo(),{data:m,isLoading:n,findRoomTypeIdByCode:_}=q(),{data:i,isLoading:v}=To(),{findRoomByRoomId:M,isLoading:mo}=No(),{data:E,isLoading:io}=Po(e.roomId==="new"?0:e.roomId),lo=Yo(),co=Ko(),L=F(()=>n.value||v.value||mo.value||io.value),po=Array.isArray(u.query.sortby)||(T=u.query.sortby)==null?void 0:T.replaceAll("_"," "),_o=_(po),yo=Eo(C.object({room_floor_id:C.number().int().positive(),room_type_id:C.number().int().positive(),name:C.string().max(50).nonempty()})),{t:Q}=ao(),fo=F(()=>{var g,y,d,N,$,Y,A,P,H;return{room_floor_id:(y=(g=E.value)==null?void 0:g.room_floor)!=null?y:r.options.history.state.floorId,room_type_id:(A=(Y=(N=(d=E.value)==null?void 0:d.room_type)!=null?N:_o)!=null?Y:($=m.value)==null?void 0:$[0].id)!=null?A:0,name:e.roomId==="new"?"":(H=(P=M(e.roomId))==null?void 0:P.name)!=null?H:""}}),{handleSubmit:vo}=Lo({validationSchema:yo,initialValues:fo}),{value:h,errorMessage:U}=j("room_floor_id"),{value:I,errorMessage:k}=j("room_type_id"),{value:w,errorMessage:B}=j("name"),go=vo(g=>{if(e.roomId==="new"){lo.mutate(g,{onSuccess:()=>{t()},onError:()=>{a()}});return}co.mutate(c(l({},g),{room_id:e.roomId}),{onSuccess:()=>{t()},onError:()=>{a()}})});return(g,y)=>(b(),ro(ko,{onSubmit:s(go)},{default:R(()=>[s(L)?(b(),V("div",zo,[(b(),V(ho,null,Io(3,d=>p(qo,{key:d,type:"QInput"})),64))])):(b(),V("div",Go,[p(Uo,{modelValue:s(w),"onUpdate:modelValue":y[0]||(y[0]=d=>O(w)?w.value=d:null),label:s(Q)("room_name"),"error-message":s(B),error:!!s(B)},null,8,["modelValue","label","error-message","error"]),p(uo,{modelValue:s(I),"onUpdate:modelValue":y[1]||(y[1]=d=>O(I)?I.value=d:null),label:s(Q)("room_type"),"error-message":s(k),error:!!s(k),options:s(m),"map-options":"","option-label":"code","option-value":"id","emit-value":""},null,8,["modelValue","label","error-message","error","options"]),p(uo,{modelValue:s(h),"onUpdate:modelValue":y[2]||(y[2]=d=>O(h)?h.value=d:null),label:s(Q)("floor"),"error-message":s(U),error:!!s(U),options:s(i),"map-options":"","option-label":"name","option-value":"id","emit-value":""},null,8,["modelValue","label","error-message","error","options"])])),to("div",Jo,[wo(p(so,{label:s(Q)("cancel"),flat:"",type:"button"},null,8,["label"]),[[Fo]]),p(so,{label:s(Q)("save"),color:"orange-9",type:"submit",disable:s(L)},null,8,["label","disable"])])]),_:1},8,["onSubmit"]))}});var Xo=jo(Wo,[["__scopeId","data-v-7fc45f50"]]);const Zo={class:"text-h6"},le=D({setup(o){const e=oo(),t=eo(),{t:a}=ao(),r=Vo(!1),u=F(()=>{const{roomId:n}=t.params;return Array.isArray(n)?null:n==="new"?"new":typeof+n=="number"?+n:null});Oo(()=>r.value=!0);const m=()=>{e.replace({path:"/settings/room-settings",query:t.query})};return(n,_)=>s(u)?(b(),ro(Co,{key:0,modelValue:r.value,"onUpdate:modelValue":_[0]||(_[0]=i=>r.value=i),onHide:m},{default:R(()=>[p(So,{style:{width:"500px","max-width":"80vw"}},{default:R(()=>[p(W,null,{default:R(()=>[to("div",Zo,no(s(u)==="new"?s(a)("new_room"):s(a)("edit_room"))+" "+no(s(e).options.history.state.roomName),1)]),_:1}),p(W,{class:"q-pt-none"},{default:R(()=>[p(Xo,{"room-id":s(u)},null,8,["room-id"])]),_:1})]),_:1})]),_:1},8,["modelValue"])):xo("v-if",!0)}});export{le as default};
