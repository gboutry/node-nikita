/*! For license information please see component---src-pages-current-actions-js-ad6a0e78e13059d8485a.js.LICENSE.txt */
(self.webpackChunknikita_docs=self.webpackChunknikita_docs||[]).push([[30],{1846:function(e,a){"use strict";var t=60103,o=60106,n=60107,r=60108,i=60114,s=60109,d=60110,c=60112,l=60113,u=60120,p=60115,f=60116,m=60121,b=60122,g=60117,x=60129,h=60131;if("function"==typeof Symbol&&Symbol.for){var Z=Symbol.for;t=Z("react.element"),o=Z("react.portal"),n=Z("react.fragment"),r=Z("react.strict_mode"),i=Z("react.profiler"),s=Z("react.provider"),d=Z("react.context"),c=Z("react.forward_ref"),l=Z("react.suspense"),u=Z("react.suspense_list"),p=Z("react.memo"),f=Z("react.lazy"),m=Z("react.block"),b=Z("react.server.block"),g=Z("react.fundamental"),x=Z("react.debug_trace_mode"),h=Z("react.legacy_hidden")}function k(e){if("object"==typeof e&&null!==e){var a=e.$$typeof;switch(a){case t:switch(e=e.type){case n:case i:case r:case l:case u:return e;default:switch(e=e&&e.$$typeof){case d:case c:case f:case p:case s:return e;default:return a}}case o:return a}}}},7301:function(e,a,t){"use strict";t(1846)},7771:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return A}});var o=t(2122),n=t(7294),r=t(5444),i=t(920),s=t(9355),d=t(9968),c=t(6410),l=t(2961),u=t(8970);var p=t(8481),f=t(1253),m=(t(7301),t(5505)),b=t(9055),g=t(8063),x=t(4621);var h=n.createContext({}),Z=t(2933),k=n.forwardRef((function(e,a){var t,r=e.children,i=e.classes,s=e.className,x=e.defaultExpanded,k=void 0!==x&&x,v=e.disabled,y=void 0!==v&&v,R=e.expanded,C=e.onChange,w=e.square,B=void 0!==w&&w,$=e.TransitionComponent,E=void 0===$?b.Z:$,N=e.TransitionProps,S=(0,f.Z)(e,["children","classes","className","defaultExpanded","disabled","expanded","onChange","square","TransitionComponent","TransitionProps"]),T=(0,Z.Z)({controlled:R,default:k,name:"Accordion",state:"expanded"}),I=(0,p.Z)(T,2),_=I[0],A=I[1],q=n.useCallback((function(e){A(!_),C&&C(e,!_)}),[_,C,A]),L=n.Children.toArray(r),P=(t=L,(0,d.Z)(t)||(0,c.Z)(t)||(0,l.Z)(t)||(0,u.Z)()),F=P[0],M=P.slice(1),D=n.useMemo((function(){return{expanded:_,disabled:y,toggle:q}}),[_,y,q]);return n.createElement(g.Z,(0,o.Z)({className:(0,m.default)(i.root,s,_&&i.expanded,y&&i.disabled,!B&&i.rounded),ref:a,square:B},S),n.createElement(h.Provider,{value:D},F),n.createElement(E,(0,o.Z)({in:_,timeout:"auto"},N),n.createElement("div",{"aria-labelledby":F.props.id,id:F.props["aria-controls"],role:"region"},M)))})),v=(0,x.Z)((function(e){var a={duration:e.transitions.duration.shortest};return{root:{position:"relative",transition:e.transitions.create(["margin"],a),"&:before":{position:"absolute",left:0,top:-1,right:0,height:1,content:'""',opacity:1,backgroundColor:e.palette.divider,transition:e.transitions.create(["opacity","background-color"],a)},"&:first-child":{"&:before":{display:"none"}},"&$expanded":{margin:"16px 0","&:first-child":{marginTop:0},"&:last-child":{marginBottom:0},"&:before":{opacity:0}},"&$expanded + &":{"&:before":{display:"none"}},"&$disabled":{backgroundColor:e.palette.action.disabledBackground}},rounded:{borderRadius:0,"&:first-child":{borderTopLeftRadius:e.shape.borderRadius,borderTopRightRadius:e.shape.borderRadius},"&:last-child":{borderBottomLeftRadius:e.shape.borderRadius,borderBottomRightRadius:e.shape.borderRadius,"@supports (-ms-ime-align: auto)":{borderBottomLeftRadius:0,borderBottomRightRadius:0}}},expanded:{},disabled:{}}}),{name:"MuiAccordion"})(k),y=t(7055),R=t(3729),C=n.forwardRef((function(e,a){var t=e.children,r=e.classes,i=e.className,s=e.expandIcon,d=e.IconButtonProps,c=e.onBlur,l=e.onClick,u=e.onFocusVisible,p=(0,f.Z)(e,["children","classes","className","expandIcon","IconButtonProps","onBlur","onClick","onFocusVisible"]),b=n.useState(!1),g=b[0],x=b[1],Z=n.useContext(h),k=Z.disabled,v=void 0!==k&&k,C=Z.expanded,w=Z.toggle;return n.createElement(y.Z,(0,o.Z)({focusRipple:!1,disableRipple:!0,disabled:v,component:"div","aria-expanded":C,className:(0,m.default)(r.root,i,v&&r.disabled,C&&r.expanded,g&&r.focused),onFocusVisible:function(e){x(!0),u&&u(e)},onBlur:function(e){x(!1),c&&c(e)},onClick:function(e){w&&w(e),l&&l(e)},ref:a},p),n.createElement("div",{className:(0,m.default)(r.content,C&&r.expanded)},t),s&&n.createElement(R.Z,(0,o.Z)({className:(0,m.default)(r.expandIcon,C&&r.expanded),edge:"end",component:"div",tabIndex:null,role:null,"aria-hidden":!0},d),s))})),w=(0,x.Z)((function(e){var a={duration:e.transitions.duration.shortest};return{root:{display:"flex",minHeight:48,transition:e.transitions.create(["min-height","background-color"],a),padding:e.spacing(0,2),"&:hover:not($disabled)":{cursor:"pointer"},"&$expanded":{minHeight:64},"&$focused":{backgroundColor:e.palette.action.focus},"&$disabled":{opacity:e.palette.action.disabledOpacity}},expanded:{},focused:{},disabled:{},content:{display:"flex",flexGrow:1,transition:e.transitions.create(["margin"],a),margin:"12px 0","&$expanded":{margin:"20px 0"}},expandIcon:{transform:"rotate(0deg)",transition:e.transitions.create("transform",a),"&:hover":{backgroundColor:"transparent"},"&$expanded":{transform:"rotate(180deg)"}}}}),{name:"MuiAccordionSummary"})(C),B=n.forwardRef((function(e,a){var t=e.classes,r=e.className,i=(0,f.Z)(e,["classes","className"]);return n.createElement("div",(0,o.Z)({className:(0,m.default)(t.root,r),ref:a},i))})),$=(0,x.Z)((function(e){return{root:{display:"flex",padding:e.spacing(1,2,2)}}}),{name:"MuiAccordionDetails"})(B),E=t(7739),N=t(8129),S=t(835),T=t(5857),I=(0,i.Z)((function(){return{accordionRoot:{boxShadow:"none",backgroundColor:"inherit","&:not(:last-child)":{borderBottom:0},"&:before":{display:"none"},"&$expanded":{margin:"auto"}},accordionExpanded:{marginTop:"0 !important"},accordionSummaryRoot:{padding:0},accordionDetailsRoot:{padding:0,display:"inherit"}}})),_=function(e){var a=e.data,t=e.path,o=(0,s.Z)(),i=function(e){var a;return{package:{marginTop:e.spacing(2),paddingBottom:e.spacing(2),"& > a":{fontSize:"1.2rem"},borderBottom:"1px solid #0000001f"},actions:(a={columnCount:3,"& a":{display:"block"}},a[e.breakpoints.down("sm")]={columnCount:2},a[e.breakpoints.down("xs")]={columnCount:1},a)}}(o),d=I(),c=(0,N.Z)(o.breakpoints.down("xs"),{noSsr:!0}),l=a.packages;return(0,T.tZ)(S.Z,{page:{keywords:"node.js, nikita, packages",title:"Browse all Nikita actions",description:"Nikita actions are developed and distributed in several packages.",slug:t,version:"current"}},l.nodes&&(0,T.tZ)(n.Fragment,null,(0,T.tZ)("p",null,"Actions are developed and distributed in several packages:"),(0,T.tZ)("ul",null,l.nodes.map((function(e){return(0,T.tZ)("li",{key:e.slug,css:i.package},(0,T.tZ)(r.Link,{to:e.slug},e.name),(0,T.tZ)("br",null),e.description,(0,T.tZ)(v,{square:!0,defaultExpanded:!c,classes:{root:d.accordionRoot,expanded:d.accordionExpanded}},(0,T.tZ)(w,{classes:{root:d.accordionSummaryRoot},expandIcon:(0,T.tZ)(E.Z,null)},"Actions"),(0,T.tZ)($,{classes:{root:d.accordionDetailsRoot}},(0,T.tZ)("div",{css:i.actions},e.actions.sort((function(e,a){return e.slug>a.slug})).map((function(e){return(0,T.tZ)(r.Link,{key:e.slug,to:e.slug},e.name)}))))))})))))},A=function(e){return(0,T.tZ)(r.StaticQuery,{query:"1553078677",render:function(a){return(0,T.tZ)(_,(0,o.Z)({data:a},e))}})}}}]);
//# sourceMappingURL=component---src-pages-current-actions-js-ad6a0e78e13059d8485a.js.map