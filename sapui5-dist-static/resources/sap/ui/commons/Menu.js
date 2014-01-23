/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.commons.Menu");jQuery.sap.require("sap.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.commons.Menu",{metadata:{publicMethods:["open","close"],library:"sap.ui.commons",properties:{"enabled":{type:"boolean",group:"Behavior",defaultValue:true},"ariaDescription":{type:"string",group:"Accessibility",defaultValue:null}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.commons.MenuItemBase",multiple:true,singularName:"item"}},events:{"itemSelect":{}}}});sap.ui.commons.Menu.M_EVENTS={'itemSelect':'itemSelect'};(function(w,u){jQuery.sap.require("sap.ui.commons.MenuItemBase");jQuery.sap.require("sap.ui.core.Popup");sap.ui.commons.Menu.prototype.init=function(){var t=this;this.bOpen=false;this.oOpenedSubMenu=null;this.oHoveredItem=null;this.oPopup=null;this.fAnyEventHandlerProxy=jQuery.proxy(this.onAnyEvent,this);this.fOrientationChangeHandler=function(){t.close()};this.bUseTopStyle=false};sap.ui.commons.Menu.prototype.exit=function(){if(this.oPopup){this.oPopup.detachOpened(this._menuOpened,this);this.oPopup.detachClosed(this._menuClosed,this);this.oPopup.destroy();delete this.oPopup}jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){jQuery(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false}if(this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null}if(this._sParentPopupId){delete this._sParentPopupId;delete this._bBubbleAutoClose}};sap.ui.commons.Menu.prototype.onBeforeRendering=function(){if(this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null}};sap.ui.commons.Menu.prototype.onAfterRendering=function(){if(this.oHoveredItem){this.oHoveredItem.hover(true,this)}};sap.ui.commons.Menu.prototype.open=function(W,o,m,a,b,c,d){if(this.bOpen){return}this.bOpen=true;this.oOpenerRef=o;this.getPopup().open(0,m,a,b,c||"0 0",d||"_sapUiCommonsMenuFlip _sapUiCommonsMenuFlip",true);var D=this.getDomRef();jQuery(D).attr("tabIndex",0).focus();if(W){this.setHoveredItem(this.getNextVisibleItem(-1))}jQuery.sap.bindAnyEvent(this.fAnyEventHandlerProxy);if(sap.ui.Device.support.orientation&&this.getRootMenu()===this){jQuery(w).bind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=true}};sap.ui.commons.Menu.prototype._menuOpened=function(){if(this.oOpenerRef){var o=this.oOpenerRef instanceof sap.ui.core.Control?this.oOpenerRef.$():jQuery(this.oOpenerRef);var p=o.closest("[data-sap-ui-popup]");var P=p.attr("data-sap-ui-popup");if(P){this._sParentPopupId=P;var O={id:this.getId()};var e="sap.ui.core.Popup.addFocusableContent-"+this._sParentPopupId;sap.ui.getCore().getEventBus().publish("sap.ui",e,O)}}I(this)};sap.ui.commons.Menu.prototype.close=function(){if(!this.bOpen||sap.ui.commons.Menu._dbg){return}jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){jQuery(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false}this.bOpen=false;if(this.oOpenedSubMenu){this.oOpenedSubMenu.close()}this.setHoveredItem();jQuery(this.getDomRef()).attr("tabIndex",-1);if(this.oOpenerRef&&!this.ignoreOpenerDOMRef){this.oOpenerRef.focus()}this.oOpenerRef=u;this.getPopup().close(0);this.onBeforeRendering();this.$().remove();this.bOutput=false;if(this.isSubMenu()){this.getParent().getParent().oOpenedSubMenu=null}};sap.ui.commons.Menu.prototype._menuClosed=function(){if(this._sParentPopupId){var o={id:this.getId(),bAutoClose:this._bBubbleAutoClose};var e="sap.ui.core.Popup.removeFocusableContent-"+this._sParentPopupId;sap.ui.getCore().getEventBus().publish("sap.ui",e,o)}delete this._sParentPopupId;delete this._bBubbleAutoClose};sap.ui.commons.Menu.prototype.onclick=function(e){this.selectItem(this.getItemByDomRef(e.target),false,!!(e.metaKey||e.ctrlKey));e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsapnext=function(e){if(e.keyCode!=jQuery.sap.KeyCodes.ARROW_DOWN){if(this.oHoveredItem&&this.oHoveredItem.getSubmenu()&&this.checkEnabled(this.oHoveredItem)){this.openSubmenu(this.oHoveredItem,true);return}}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getNextVisibleItem(i));e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsapprevious=function(e){if(e.keyCode!=jQuery.sap.KeyCodes.ARROW_UP){if(this.isSubMenu()){this.close();e.preventDefault();e.stopPropagation();return}}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getPreviousVisibleItem(i));e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsaphome=function(e){var a=this.getItems();var o=null;for(var i=0;i<a.length;i++){if(a[i].getVisible()){o=a[i];break}}this.setHoveredItem(o);e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsapend=function(e){var a=this.getItems();var o=null;for(var i=a.length-1;i>=0;i--){if(a[i].getVisible()){o=a[i];break}}this.setHoveredItem(o);e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsapselect=function(e){this._sapSelectOnKeyDown=true;e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onkeyup=function(e){if(!this._sapSelectOnKeyDown){return}else{this._sapSelectOnKeyDown=false}if(!jQuery.sap.PseudoEvents.sapselect.fnCheck(e)){return}this.selectItem(this.oHoveredItem,true,false);e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsapbackspace=function(e){if(jQuery(e.target).prop("tagName")!="INPUT"){e.preventDefault()}};sap.ui.commons.Menu.prototype.onsapbackspacemodifiers=sap.ui.commons.Menu.prototype.onsapbackspace;sap.ui.commons.Menu.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation()};sap.ui.commons.Menu.prototype.onsaptabnext=sap.ui.commons.Menu.prototype.onsapescape;sap.ui.commons.Menu.prototype.onsaptabprevious=sap.ui.commons.Menu.prototype.onsapescape;sap.ui.commons.Menu.prototype.onmouseover=function(e){var i=this.getItemByDomRef(e.target);if(!this.bOpen||!i||i==this.oHoveredItem){return}if(this.oOpenedSubMenu&&jQuery.sap.containsOrEquals(this.oOpenedSubMenu.getDomRef(),e.target)){return}this.setHoveredItem(i);if(this.oOpenedSubMenu){this.oOpenedSubMenu.close();this.oOpenedSubMenu=null}if(jQuery.sap.checkMouseEnterOrLeave(e,this.getDomRef())){this.getDomRef().focus()}if(this.checkEnabled(i)){this.openSubmenu(i,false)}};sap.ui.commons.Menu.prototype.onmouseout=function(e){I(this);if(jQuery.sap.checkMouseEnterOrLeave(e,this.getDomRef())){if(!this.oOpenedSubMenu||!this.oOpenedSubMenu.getParent()===this.oHoveredItem){this.setHoveredItem(null)}}};sap.ui.commons.Menu.prototype.onAnyEvent=function(e){if(!this.bOpen||e.type!="mousedown"){return}var s=e.target,d=this.getDomRef();if(!jQuery.sap.containsOrEquals(d,s)||s.tagName=="BODY"){this.getRootMenu().handleOuterEvent(this.getId(),e)}};sap.ui.commons.Menu.prototype.onsapfocusleave=function(e){if(this.oOpenedSubMenu||!this.bOpen){return}this.getRootMenu().handleOuterEvent(this.getId(),e)};sap.ui.commons.Menu.prototype.handleOuterEvent=function(m,e){var i=false;if(e.type=="mousedown"){var c=this;while(c){if(jQuery.sap.containsOrEquals(c.getDomRef(),e.target)){i=true}c=c.oOpenedSubMenu}}else if(e.type=="sapfocusleave"){if(e.relatedControlId){var c=this;while(c){if((c.oOpenedSubMenu&&c.oOpenedSubMenu.getId()==e.relatedControlId)||jQuery.sap.containsOrEquals(c.getDomRef(),jQuery.sap.byId(e.relatedControlId).get(0))){i=true}c=c.oOpenedSubMenu}}}if(!i){this.ignoreOpenerDOMRef=true;this._bBubbleAutoClose=!!this._sParentPopupId;this.close();this.ignoreOpenerDOMRef=false}};sap.ui.commons.Menu.prototype.getItemByDomRef=function(d){var o=this.getItems(),l=o.length;for(var i=0;i<l;i++){var a=o[i],b=a.getDomRef();if(jQuery.sap.containsOrEquals(b,d)){return a}}return null};sap.ui.commons.Menu.prototype.selectItem=function(i,W,c){if(!i||!(i instanceof sap.ui.commons.MenuItemBase&&this.checkEnabled(i))){return}var s=i.getSubmenu();if(!s){this.getRootMenu().close()}else{this.openSubmenu(i,W)}i.fireSelect({item:i,ctrlKey:c});this.getRootMenu().fireItemSelect({item:i})};sap.ui.commons.Menu.prototype.isSubMenu=function(){return this.getParent()&&this.getParent().getParent&&this.getParent().getParent()instanceof sap.ui.commons.Menu};sap.ui.commons.Menu.prototype.getRootMenu=function(){var m=this;while(m.isSubMenu()){m=m.getParent().getParent()}return m};sap.ui.commons.Menu.prototype.getMenuLevel=function(){var l=1;var m=this;while(m.isSubMenu()){m=m.getParent().getParent();l++}return l};sap.ui.commons.Menu.prototype.getPopup=function(){if(!this.oPopup){this.oPopup=new sap.ui.core.Popup(this,false,true);this.oPopup.attachOpened(this._menuOpened,this);this.oPopup.attachClosed(this._menuClosed,this)}return this.oPopup};sap.ui.commons.Menu.prototype.setHoveredItem=function(i){if(this.oHoveredItem){this.oHoveredItem.hover(false,this)}if(!i){this.oHoveredItem=null;jQuery(this.getDomRef()).removeAttr("aria-activedescendant");return}this.oHoveredItem=i;i.hover(true,this);if(sap.ui.getCore().getConfiguration().getAccessibility()){jQuery(this.getDomRef()).attr("aria-activedescendant",i.getId())}};sap.ui.commons.Menu.prototype.openSubmenu=function(i,W){var s=i.getSubmenu();if(!s){return}if(this.oOpenedSubMenu===s){this.oOpenedSubMenu=null;s.close()}else{if(this.oOpenedSubMenu){this.oOpenedSubMenu.close();this.oOpenedSubMenu=null}this.oOpenedSubMenu=s;var e=sap.ui.core.Popup.Dock;s.open(W,this,e.BeginTop,e.EndTop,i,"0 0")}};sap.ui.commons.Menu.prototype.checkEnabled=function(i){I(this);return i&&i.getEnabled()&&this.getEnabled()};sap.ui.commons.Menu.prototype.getNextVisibleItem=function(a){var o=null;var b=this.getItems();for(var i=a+1;i<b.length;i++){if(b[i].getVisible()){o=b[i];break}}if(!o){for(var i=0;i<=a;i++){if(b[i].getVisible()){o=b[i];break}}}return o};sap.ui.commons.Menu.prototype.getPreviousVisibleItem=function(a){var o=null;var b=this.getItems();for(var i=a-1;i>=0;i--){if(b[i].getVisible()){o=b[i];break}}if(!o){for(var i=b.length-1;i>=a;i--){if(b[i].getVisible()){o=b[i];break}}}return o};sap.ui.commons.Menu.prototype.setRootMenuTopStyle=function(U){this.getRootMenu().bUseTopStyle=U;sap.ui.commons.Menu.rerenderMenu(this.getRootMenu())};sap.ui.commons.Menu.rerenderMenu=function(m){var a=m.getItems();for(var i=0;i<a.length;i++){var s=a[i].getSubmenu();if(s){sap.ui.commons.Menu.rerenderMenu(s)}}m.invalidate();m.rerender()};jQuery.ui.position._sapUiCommonsMenuFlip={left:function(p,d){if(jQuery.ui.position.flipfit){jQuery.ui.position.flipfit.left.apply(this,arguments);return}if(d.at[0]==="center"){return}var a=jQuery(w),o=d.collisionPosition.left+d.collisionWidth-a.width()-a.scrollLeft(),m=d.my[0]==="left"?-d.elemWidth:d.my[0]==="right"?d.elemWidth:0,b=d.at[0]==="left"?d.targetWidth:-d.targetWidth,c=-2*d.offset[0],e=0,s=false;o=d.collisionPosition.left<0?Math.abs(d.collisionPosition.left):o;if(o>0){e=m+b+c;var f=d.collisionPosition.left+e;if(e>0){f+=d.collisionWidth-a.width()-a.scrollLeft();s=f>0&&Math.abs(f)>o}else if(e<0){s=f<0&&Math.abs(f)>o}e=s?0:e}p.left+=e},top:function(p,d){if(jQuery.ui.position.flipfit){jQuery.ui.position.flipfit.top.apply(this,arguments);return}if(d.at[1]==="center"){return}var a=jQuery(w),o=d.collisionPosition.top+d.collisionHeight-a.height()-a.scrollTop(),m=d.my[1]==="top"?-d.elemHeight:d.my[1]==="bottom"?d.elemHeight:0,b=d.at[1]==="top"?d.targetHeight:-d.targetHeight,c=-2*d.offset[1],e=0;if(d.collisionPosition.top<0||o>0){e=m+b+c;var f=d.collisionPosition.top+e;if(f<0&&o>0&&Math.abs(f)>o){e=0}}p.top+=e}};var I=function(){};if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<9){I=function(m,d){if(d===u){d=50}jQuery.sap.delayedCall(d,m,function(){var e=this.$();if(e.length>0){var D=e[0].firstChild;sap.ui.core.RenderManager.forceRepaint(D)}})}}})(window);