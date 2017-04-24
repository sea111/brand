$(function(){
//	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});
	window.aesFail = "";
//	$.ajax({
//		type:"post",
//		url:wpCommon.Url+"/wpwl/getKey",
//		async:true,
//		success:function(datas){
//			key=datas.data;
//			localStorage.setItem('key',datas.data)
//			actionList(key);
//		}
//	});
	function actionList(key){
//		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{
//				key:key,
//				params:["posId"]
//		},function(msg){
//			codeValue=msg.data.result;
			$.ajax({
				type:"get",
				url:"JSON/actionList.json",
				async:true,
				timeout:10000,
//				data:{
//					posId:codeValue[0]
//				},
				success:function(datas){
					if(datas.errMsg=="AES加密解密失败"){
						if(!aesFail){
//							$.ajax({
//								type:"post",
//								url:wpCommon.Url+'/wpwl/getKey',
//								success:function(datas){
//									key = datas.data;
//									localStorage.setItem('key',datas.data)
//									actionList(key);
//								}
//							})
							aesFail=true;
						}
					}else if(datas.success==false){
						$("#listContent").hide();
						$(".loading").show();
						$(".middle img").attr('src',"images/error_else.png");
						$(".middle p").html("出错了，请稍后再试");
						$(".head").html("异常页面");
					}else{
						try{
							if(datas.success){
								var listContHtml=$("#listContHtml").html();
								var dt=datas.data;
/*								for(var i=0;i<dt.length;i++){
									if(dt[i].content.length>=20){
										//截取前20个字
										dt[i].content=dt[i].content.substr(0,20)+"..."
									}				
								}*/
								//模板引擎
								laytpl(listContHtml).render(dt,function(html){
									$("#listConts").append(html);
									imgError('images/now_error.png');
								})
							}
						}catch(e){
							$("#listContent").hide();
							$(".loading").show();
							$(".middle img").attr('src',"images/error_else.png");
							$(".middle p").html("出错了，请稍后再试");
							$(".head").html("异常页面");
						}
//						WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
//					    function() {});
//					    WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
//					    function() {});
					}	
				},
				error:function(jqXHR, textStatus, errorThrown){
					if(textStatus=="timeout"){
						$("#listContent").hide();
						$(".loading").show();
						$(".head").html("网络异常")
					}
//					WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
//		            function() {});
//		            WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
//		            function() {});
//		            WPBridge.callMethod("JsInvokeNative", "wpNetError", {url:wpCommon.Url+"/h5/brand.html"},
//		            function() {});
				}
			});	
//		})
	}	
	actionList()
	//重新加载
//	$("#wpReload").click(function(){
//		actionList(key);
//	})
	//跳转到活动详情
	$("#listContent").on("click","#listConts #listCont",function(){
		var actionId=$(this).attr("actionId");
		localStorage.setItem("actionId",actionId)
//		WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
//	        eventId:"h5_e069",
//	        otherId:actionId
//	   	},
//	    function() {});
//		window.location.href="eventDetails.html?pageId=H5_C013&otherId="+actionId;
		window.location.href="eventDetails.html"
	})
	//返回上一页
//	$("#back").on('touchstart',function(){
//		WPBridge.callMethod('JsInvokeNative','wpH5Back',{},'');
//	})
})