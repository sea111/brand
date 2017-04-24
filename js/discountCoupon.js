$(function(){
	function resetCss(){
		var count=Math.ceil($('.discountBox').width()/19);
		$('.discountBox').each(function(){
			if(!$(this).hasClass('complete')){
				$(this).width(19*count);
				/*$(this).find('.intro').dotdotdot();*/
				$(this).addClass('complete');
			}
		})
	}	
//	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});	
//	window.aesFail = "";
//	$.ajax({
//		type:"post",
//		url:wpCommon.Url+"/wpwl/getKey",
//		async:true,
//		success:function(datas){
//			key=datas.data;
//			localStorage.setItem('key',datas.data)
//			getData(type,key)
//		}
//	});	
	var scrollEndTimer=null;
	var pageIndex={
		disCountContent:1,
		undisCountContent:1
	}
	var pageSize=6;
	var complete=true;
	//获取数据
	function getData(type,key){
		//var url='JSON/contC.json';
		var obj='';
		var layHTML=$('#discountCouponTpl').html();
		var couponsType="";
		switch(type){
			case 'disCountContent':
				url='JSON/CountContents.json';
				obj=$('#discountContent');
				couponsType=1;
				break;
			case 'undisCountContent':
				url='JSON/undisCountContents.json';
				obj=$('#undiscountContent');
				couponsType=0;
				break;
		}
		if(complete){
			complete=false;
//		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{
//				key:key,
//				params:["zh"]
//		},function(msg){
//			codeValue=msg.data.result;			
				$.ajax({
					url:url,
					type:'get',
					data:{
						pageIndex:pageIndex[type],
						pageSize:pageSize
//						couponsType:couponsType
					},
					timeout:10000,
					success:function(res){	
						if(res.errMsg == "AES加密解密失败"){
	//						if(!aesFail){
	//							$.ajax({
	//								type:"post",
	//								url:wpCommon.Url+'/wpwl/getKey',
	//								success:function(datas){
	//									key = datas.data;
	//									localStorage.setItem('key',datas.data)
	//									getData(key);
	//								}
	//							})
	//							aesFail=true;
	//						}
						}else if(res.success==false){
							$("#box").hide();
							$(".loadEffect").hide().siblings(".middle").show();
							$(".middle img").attr('src',"images/error_else.png");
							$(".middle p").html("出错了，请稍后再试");
							$(".top div").html("异常页面");
						}else{
							try{															
								if(res.success){
									var cou=res.data.coupons;
									laytpl(layHTML).render(cou,function(html){
										console.log(1)
										obj.append(html);
										resetCss();
									})
									for(var i=0;i<cou.length;i++){
										console.log(2)
										//倒计时函数只到天为止 传入结束时间
										function countDownDay(endDate){
											var startTime=new Date().getTime();
											var type='day';
											var endDateArray=endDate.split('.');
											for(var i=0;i<endDateArray.length;i++){
												endDateArray[i]=endDateArray[i]*1;
												console.log(endDateArray[i])
											}
											var end=new Date();
											end.setFullYear(endDateArray[0],endDateArray[1]-1,endDateArray[2]+1);
											end.setHours(0,0,0);
											var endTime=end.getTime();
											var countTime=endTime-startTime;
											var day=Math.floor(countTime/(60*60*1000*24));
											if(day===0){
												day=Math.floor(countTime/(60*60*1000));
												type='hour';
											}
											return {
												time:day,
												type:type
											}
										}
										var endDate=cou[i].activityEndTime;
										var data=countDownDay(endDate);
										if(data.type==='day'){
											$(".number").eq(i).html(+data.time+'天');
										}else if(data.type==='hour'){
											$(".number").eq(i).html(+data.time+'小时');
										}
									}
									$(".loading").hide();
									if(pageIndex[type]==Math.ceil(res.data.total/pageSize)){
										obj.addClass('complete');
									}
									pageIndex[type]+=1;
									complete=true;
								}
							}catch(e){
								$(".loadEffect").hide().siblings(".middle").show();
								$(".middle img").attr('src',"images/error_else.png");
								$(".middle p").html("出错了，请稍后再试");
								$(".top div").html("异常页面");
								$('.look').hide();
								$("#box").hide()
							}
//						WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
//					    function() {});
//					    WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
//					    function() {});							
						}
					},
					error:function(jqXHR, textStatus, errorThrown){
	//				WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
	//	            function() {});
	//	            WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
	//	            function() {});
	//	            WPBridge.callMethod("JsInvokeNative", "wpNetError", {url:wpCommon.Url+"/h5/brand.html"},
	//	            function() {});						
						if(textStatus=="timeout"){
							$("#box").hide();
							$(".loadEffect").hide().siblings(".middle").show();
							$(".top div").html("网络异常");
							$('.look').hide();
						}
					}
				})
//			})
		}
	}
	//获取类型
	function getType(name){
		var type='';
		switch(name){
			case 'discountContent':
				type='disCountContent';
				break;
			case 'undiscountContent':
				type='undisCountContent';
				break;
		}
		return type;
	}
	getData('disCountContent');
	//下拉加载
	$(window).on('scroll',function(){
		var scrollTop=$(this).scrollTop();
		clearTimeout(scrollEndTimer);
		scrollEndTimer=setTimeout(function(){
			var scroll=scrollTop+$(window).height();
			var wh=$('.dis_content.current').height()+$('.dis_content.current').offset().top;
			if(scroll>(wh-10)){
				$('.dis_content').each(function(){
					var $t=$(this);
					if($t.hasClass('current')){
						if(!$t.hasClass('complete')){
							$(".loadEffect").css({
								top:$(".loadEffect").offset().top+scrollTop
							})
							$(".loading").show().siblings(".middle").hide();
							//获取的是当前优惠券还是失效的优惠券
							var id=$t.attr('id');
							var type=getType(id);
							getData(type);//调用函数方法,获取数据
						}
						return false; 
					}
				})
			}
		},300)
	})
	function changeContent($t){
		var obj=$t.attr('content');
		var $obj=$('#'+obj);
		$('.dis_content.current').removeClass('current');
		$obj.addClass('current');	
		if(!$obj.html().trim()){
			var type=getType(obj);
			getData(type);
		}
		//点击查看更多显示失效的内容
		$('.look .more').attr('content','undiscountContent');
		$(window).scrollTop(0);
	}
	//重新加载
	$("#wpReload").click(function(){
		getData(key);
	})
	//查看更多
	$('.look .more').on('click',function(){
		var $t=$(this);
		$('.look').hide();
		changeContent($t);
	})
	//后退
	$('#back').on('click',function(){
		if($('.look:visible').length){
			//调用app  WPBridge.callMethod('JsInvokeNative','wpH5Back',{},'');
		}else{
			$("#discountContent").addClass('current');
			$("#undiscountContent").removeClass('current');
				$(".look").show();		
			$(window).scrollTop(0);
			window.location.reload();
		}
	})	
	//进入优惠详情页
	$("#discountContent").on("click",".discountBox",function(){
		var coupId=$(this).attr("couponId");
		var couponName=$(this).attr("couponName");
		localStorage.setItem("couponName",couponName)
//		WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
//	        eventId:"h5_e079",
//	        otherId:""
//	   	},
//	    function() {});
		window.location.href="discountDetail.html?receiveCouponId"+coupId;
	})
})
