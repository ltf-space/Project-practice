!(function (w){
    w.damu = {};
    // 移动样式
    w.damu.css = function (node,type,val){
        if(typeof node === "object" && typeof node["transform"] === "undefined"){
            node["transform"] = {};
        }
        if(arguments.length >= 3){
            // 设置
            var text = "";
            node["transform"][type] = val;
            for(item in node["transform"]){
                if(node["transform"].hasOwnProperty(item)){
                    switch(item){
                        case "translateX":
                        case "translateY":
                            text += item+"("+node["transform"][item]+"px)";
                            break;
                        case "scale":
                            text += item+"("+node["transform"][item]+")";
                            break;
                        case "rotate":
                            text += item+"("+node["transform"][item]+"deg)";
                            break;
                    }
                }
            }
            node.style.transform = node.style.webkitTransform = text;
        }else if(arguments.length == 2){
            // 读取
            val = node["transform"][type];
            if(typeof val === "undefined"){
                switch(type){
                    case "translateX":
                    case "translateY":
                    case "translateZ":
                    case "rotate":
                        val = 0;
                        break;
                    case "scale":
                        val = 1;
                        break;
                }
            }
            return val;
        }
            
    }
    // 轮播图
    w.damu.carousel = function (arr){
        // 布局
        var carouselWrap = document.querySelector(".carousel-wrap");
        if(carouselWrap){
            var pointslength = arr.length;
            // 无缝
            var needCarousel = carouselWrap.getAttribute("needCarousel");
            // console.log(needCarousel);
            needCarousel = needCarousel == null?false:true;
            if(needCarousel){
                arr = arr.concat(arr);
            }
            
            var ulNode = document.createElement("ul");
            damu.css(ulNode,"translateZ",0);
            var styleNode = document.createElement("style");
             //为ul创建class = list  
            ulNode.classList.add("list");
            for(var i=0;i<arr.length;i++){
                ulNode.innerHTML += '<li><a href="javascript:;"><img src="'+arr[i]+'"></a></li>';                     
            }
            styleNode.innerHTML = ".carousel-wrap > .list > li{width: "+(1/arr.length*100)+"%;}.carousel-wrap > .list{width: "+arr.length+"00%;}";
            carouselWrap.appendChild(ulNode);
            document.head.appendChild(styleNode);

            var imgNodes = document.querySelector(".carousel-wrap > .list > li > a > img");
            setTimeout(function(){
                carouselWrap.style.height = imgNodes.offsetHeight+"px";
            },100);

            // 加小圆点
            var pointsWrap = document.querySelector(".carousel-wrap>.point-wrap");
            if(pointsWrap){
                for(var i=0;i<pointslength;i++){
                    if(i == 0){
                        pointsWrap.innerHTML += "<span class = active></span>"; 
                    }else{
                        pointsWrap.innerHTML += "<span></span>";
                    }
                                         
                }
                var pointsSpan = document.querySelectorAll(".carousel-wrap>.point-wrap>span");
            }
            


            
            // 滑屏
                // 1.拿到元素一开始的位置
                // 2.拿到手指一开始的位置
                // 3.拿到手指move的实时距离
                // 4.将手指移动距离加给元素

            // 防抖动
                // 1.判断用户首次滑屏的方向
                        // 如果是x轴方向，以后怎么滑都会抖动
                        // 如果是Y轴方向，以后怎么滑都不会抖动
                        
            var startX = 0;//手指开始距离
            var elementX = 0;//元素开始距离
            var index = 0;
            // var disX;
            // var translateX = 0;
            var startY = 0;
            var elementY = 0;

            // 首次滑屏的方向
            var isX = true;
            var isFirst = true;
            carouselWrap.addEventListener("touchstart",function(ev){
                ev = ev||event;
                var TouchC = ev.changedTouches[0];
                // 无缝：
                // 点击第一组的第一张时，瞬间跳到第二组的第一张
                // 点击第二组的最后一张时，瞬间跳到第一组的最后一张
                if(needCarousel){
                // index代表ul的位置，-index代表索引
                var index = damu.css(ulNode,"translateX")/document.documentElement.clientWidth;
                if(-index === 0){
                    index = -pointslength;
                }else if(-index === (arr.length-1)){
                    index = -(pointslength-1);
                }
                console.log(ulNode.transform);
                damu.css(ulNode,"translateX",index*document.documentElement.clientWidth);
            }
                
                startX = TouchC.clientX;
                startY = TouchC.clientY;
                elementX = damu.css(ulNode,"translateX");
                elementY = damu.css(ulNode,"translateY");
                ulNode.style.transition = "none";
                // 清除定时器,当手指滑动时，清除自动播放
                clearInterval(timer);

                isX = true;
                isFirst = true;
            });
            carouselWrap.addEventListener("touchmove",function(ev){
                // 看门狗，二次以上的滑动
                if(!isX){
                    return;
                }
                ev = ev||event;
                var TouchC = ev.changedTouches[0];
                var nowX = TouchC.clientX;
                var nowY = TouchC.clientY;
                var disX = nowX - startX;
                var disY = nowY - startY;
                if(isFirst){
                    isFirst = false;
                    if(Math.abs(disY)>Math.abs(disX)){
                        // 说明在Y轴上滑动
                        isX = false;
                        return;
                    }
                }
                
                damu.css(ulNode,"translateX",elementX + disX);
            });
            carouselWrap.addEventListener("touchend",function(ev){
                ev = ev||event;
                index = damu.css(ulNode,"translateX")/document.documentElement.clientWidth;
                // 二分之一跳转
                index = Math.round(index);
                // 图片滑动超出控制
                if(index>0){
                    index = 0;
                }else if(index < 1-arr.length){
                    index = 1-arr.length;
                }
                point(index);
                
                ulNode.style.transition = ".5s transform";
                damu.css(ulNode,"translateX",index*(document.documentElement.clientWidth));
                // 手指离开自动开启定时器
                if(needAuto){
                    auto();
                }
            });
            // 轮播
            var timer = 0;
            var needAuto = carouselWrap.getAttribute("needAuto");
            needAuto = needAuto == null?false:true;
            if(needAuto){
                auto();
            }
            // 抽象图片
            index = 0;
            
            function auto(){
                clearInterval(timer);
                timer = setInterval(function(){
                    
                    if(index == 1-arr.length){
                        ulNode.style.transition = "none";
                        index = 1-arr.length/2;
                        damu.css(ulNode,"translateX",index*document.documentElement.clientWidth);
                    }
                    
                    setTimeout(function(){
                        index--;
                        ulNode.style.transition = ".5s transform";
                        point(index);
                        damu.css(ulNode,"translateX",index*document.documentElement.clientWidth);
                    },50);
                    
                },2000)
            }
            // 小圆点跟随图片切换
            function point(index){
                if(!pointsWrap){
                    return ;
                }
                for(var i=0;i<pointsSpan.length;i++){
                    pointsSpan[i].classList.remove("active");
                }
                pointsSpan[-index%pointslength].classList.add("active");
            }


        }
    }
    // 导航滑屏
    w.damu.dragNav = function(){
        // 滑屏区域
        var wrap = document.querySelector(".damu-nav-wrapper");
        // 滑屏元素
        var item = document.querySelector(".damu-nav-wrapper .list");
        var startX = 0;
        var elementX = 0;
        var minX = wrap.clientWidth - item.offsetWidth;

        // 快速滑屏参数
        var lastTime = 0;
        var lastPoint = 0;
        var timeDis = 1;
        var pointDis = 0;

        wrap.addEventListener("touchstart",function(ev){
            ev = ev||event;
            var touchC = ev.changedTouches[0];
            startX = touchC.clientX;
            elementX = damu.css(item,"translateX");
            item.style.transition = "none";

            lastTime = new Date().getTime();
            // lastPoint = damu.css(item,"translateX");
            lastPoint = touchC.clientX;
            pointDis = 0;
        });
        wrap.addEventListener("touchmove",function(ev){
            ev = ev||event;
            var touchC = ev.changedTouches[0];
            var nowX = touchC.clientX;
            var disX = nowX - startX;
            var translateX = elementX+disX;
            
            var nowTime = new Date().getTime();
            var nowPoint = touchC.clientX;
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            lastTime = nowTime;
            lastPoint = nowPoint;
            // 手动橡皮筋效果
            if(translateX>0){
                var scale = document.documentElement.clientWidth/(document.documentElement.clientWidth+translateX);
                // 要用damu.css(item,"translateX")实时位置代替elementX
                translateX = damu.css(item,"translateX")+pointDis*scale;
            }else if(translateX<minX){
                var over = minX - translateX;
                var scale = document.documentElement.clientWidth/(document.documentElement.clientWidth+over);
                translateX = damu.css(item,"translateX")+pointDis*scale;
            }
            damu.css(item,"translateX",translateX);
            
        });

        wrap.addEventListener("touchend",function(ev){
            ev = ev||event;
            var translateX = damu.css(item,"translateX");
            var speed = pointDis/timeDis;
            console.log(pointDis,timeDis);
            speed = Math.abs(speed)<0.5?0:speed;
            // 位移
            var targetX = translateX + speed*200;
            var time = Math.abs(speed)*0.2;
            time = time<1?1:time;
            // 快速滑动橡皮筋效果
            var bsr = "";
            if(targetX>0){
                targetX = 0;
                // css: cubic-bezier曲线
                bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                // damu.css(item,"translateX",translateX);
            }else if(targetX<minX){
                targetX = minX;
                bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                // damu.css(item,"translateX",translateX);
            }
            item.style.transition = time+"s "+bsr+" transform";
            damu.css(item,"translateX",targetX);
        });
    }
    // 竖向滑屏
    w.damu.dragMove = function (wrap) {
        // 滑屏区域
        // 滑屏元素
        var item = wrap.children[0];
        damu.css(item,"translateZ",0);
        var start ={};
        var element = {};
        var minY = wrap.clientHeight - item.offsetHeight;
    
        // 快速滑屏参数
        var lastTime = 0;
        var lastPoint = 0;
        var timeDis = 1;
        var pointDis = 0;
        
        var isY = true;
        var isFirst = true;
        wrap.addEventListener("touchstart", function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            start = {clientX:touchC.clientX,clientY:touchC.clientY};
            element.y = damu.css(item, "translateY");
            element.x = damu.css(item, "translateX");
            item.style.transition = "none";
    
            lastTime = new Date().getTime();
            // lastPoint = damu.css(item,"translateY");
            lastPoint = touchC.clientY;
            pointDis = 0;
            isY = true;
            isFirst = true;
        });
        wrap.addEventListener("touchmove", function (ev) {
            if(!isY){//看门狗
                return;
            }
            ev = ev || event;
            var touchC = ev.changedTouches[0];
    
            var now = touchC;
            var dis = {};
            dis.y = now.clientY - start.clientY;
            dis.x = now.clientX - start.clientX;
            var translateY = element.y + dis.y;

            if(isFirst){//防Y轴抖动
                isFirst = false;
                if(Math.abs(dis.x)>Math.abs(dis.y)){
                    isY = false;
                    return;
                }
            }

            var nowTime = new Date().getTime();
            var nowPoint = touchC.clientY;
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            lastTime = nowTime;
            lastPoint = nowPoint;
            // 手动橡皮筋效果
            if (translateY > 0) {
                var scale = document.documentElement.clientHeight / (document.documentElement.clientHeight + translateY);
                // 要用damu.css(item,"translateY")实时位置代替elementY
                translateY = damu.css(item, "translateY") + pointDis * scale;
            } else if (translateY < minY) {
                var over = minY - translateY;
                var scale = document.documentElement.clientHeight / (document.documentElement.clientHeight + over);
                translateY = damu.css(item, "translateY") + pointDis * scale;
            }
            damu.css(item, "translateY", translateY);
    
        });
    
        wrap.addEventListener("touchend", function (ev) {
            ev = ev || event;
            var translateY = damu.css(item, "translateY");
            var speed = pointDis / timeDis;
            speed = Math.abs(speed) < 0.5 ? 0 : speed;
            // 位移
            var targetY = translateY + speed * 200;
            var time = Math.abs(speed) * 0.2;
            time = time < 1 ? 1 : time;
            console.log(targetY,time);
            // 快速滑动橡皮筋效果
            var bsr = "";
            if (targetY > 0) {
                targetY = 0;
                // css: cubic-bezier曲线
                bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                // damu.css(item,"translateY",translateY);
            } else if (targetY < minY) {
                targetY = minY;
                bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                // damu.css(item,"translateY",translateY);
            }
            item.style.transition = time + "s " + bsr + " transform";
            damu.css(item, "translateY", targetY);
            
        });
    }
})(window)