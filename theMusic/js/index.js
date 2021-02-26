window.onload = function(){
    document.addEventListener("touchstart",function(ev){
        ev = ev||event;
        ev.preventDefault();
    });
    (function(){
        var styleNode = document.createElement("style");
        var w = document.documentElement.clientWidth/16;
        styleNode.innerHTML = "html{font-size:"+w+"px!important}";
        document.head.appendChild(styleNode);
    })();

    // tap选项卡
    tap();
    function tap(){
        var contentNodes =document.querySelectorAll("#wrap .content .tap-wrap .tap-content");
        
        var tapWrap =document.querySelector("#wrap .content .tap-wrap");
        var w = tapWrap.offsetWidth;
        for(var i=0;i<contentNodes.length;i++){
            move(contentNodes[i]);
        }
        function move(content){
            // 小绿的下标
            var now = 0;
            var smallGreen = content.parentNode.querySelector(".tap-nav .smallGreen");
            var aNodes = content.parentNode.querySelectorAll(".tap-nav a");                   
            var loadings = content.querySelectorAll(".tap-loading");
            damu.css(content,"translateX",-w);
            smallGreen.style.width = aNodes[0].offsetWidth+"px";
            var startPoint = {x:0,y:0};
            var elementPoint = {x:0,y:0};
            var isX = true;
            var isFirst = true;
            // 在1/2跳转时，整个jump只触发一次
            var isOver = false;
            content.addEventListener("touchstart",function(ev){
                if(isOver){
                    return;
                }
                ev = ev||event;
                var touchC = ev.changedTouches[0];
                startPoint.x = touchC.clientX;
                startPoint.y = touchC.clientY;
                elementPoint.x = damu.css(content,"translateX");
                elementPoint.y = damu.css(content,"translateY");
                isX = true;
                isFirst = true;
                content.style.transition = "none";
                
            });
            content.addEventListener("touchmove",function(ev){
                if(isOver){
                    return;
                }
                if(!isX){
                    return;
                }
                ev = ev||event;
                var touchC = ev.changedTouches[0];
                var nowPoint = {x:0,y:0};
                var dis = {x:0,y:0};
                nowPoint.x = touchC.clientX;
                nowPoint.y = touchC.clientY;
                dis.x = nowPoint.x - startPoint.x;
                dis.y = nowPoint.y - startPoint.y;
                if(isFirst){
                    isFirst = false;
                    if(Math.abs(dis.y)>Math.abs(dis.x)){
                        isX = false;
                        return;
                    }
                }
                
                var translateX = elementPoint.x + dis.x;
                damu.css(content,"translateX",translateX);
                // 超过1/2跳转
                jump(dis.x);
                
            });
            content.addEventListener("touchend",function(ev){
                if(isOver){
                    return;
                }
                ev = ev||event;
                var touchC = ev.changedTouches[0];
                var nowPoint = {x:0,y:0};
                var dis = {x:0,y:0};
                nowPoint.x = touchC.clientX;
                dis.x = nowPoint.x - startPoint.x;
                if(Math.abs(dis.x)<w/2){
                    content.style.transition = "1s transform";
                    damu.css(content,"translateX",-w);
                }
            });
            // 跳转
            function jump(disX){
                if(isOver){
                    return;
                }
                if(Math.abs(disX)>w/2){
                    isOver = true;
                    // console.log(jump);
                    content.style.transition = "1s transform";
                    // 向右滑
                    if(disX>0){
                        damu.css(content,"translateX",0);
                    }else{
                        damu.css(content,"translateX",-2*w);
                    }

                    content.addEventListener("Transitionend",endFn);
                    content.addEventListener("webkitTransitionEnd",endFn);

                    function endFn(){
                        // 循环定时器 回调函数第一步请定时器
                        // DOM2绑定Transitionend事件 回调函数头部第一行解绑事件
                        content.removeEventListener("Transitionend",endFn);
                        content.removeEventListener("webkitTransitionEnd",endFn);
                        content.style.transition = "none";
                        for(var i=0;i<loadings.length;i++){
                            loadings[i].style.opacity = 1;
                        }
                        setTimeout(function(){
                            for(var i=0;i<loadings.length;i++){
                                loadings[i].style.opacity = 0;
                            }
                            damu.css(content,"translateX",-w);
                            isOver = false;
                        },1000);
                        // 控制小绿
                        disX<0?now++:now--
                        if(now<0){//往右滑
                            now = aNodes.length - 1;
                        }else if(now>aNodes.length - 1){
                            now = 0;
                        }
                        console.log(now);
                        smallGreen.style.transition = ".5s transform , 1s width";
                        damu.css(smallGreen,"translateX",aNodes[now].offsetLeft);
                        if(smallGreen.offsetWidth != aNodes[now].offsetWidth){
                            smallGreen.style.width = aNodes[now].offsetWidth+"px";
                        }
                    }
                }
            }
        }
    }
    // 菜单栏
    CMCFMenuBtn();
    function CMCFMenuBtn(){
        var menuBtn = document.querySelector("#wrap .head .head-top .menuBtn");
        var mask = document.querySelector("#wrap .head .mask");
        // 菜单是否显示为X符号
        var isXXX = false;
        menuBtn.addEventListener("touchstart",function(ev){
            ev = ev||event;
            var touchC = ev.changedTouches[0];
            if(!isXXX){
                tools.addClass(menuBtn,"active");   
                mask.style.display = "block";
            }else{
                tools.removeClass(menuBtn,"active");
                mask.style.display = "none";
            }
            isXXX=!isXXX;
            ev.stopPropagation();
            ev.preventDefault();
        });
        document.addEventListener("touchstart",function(ev){
            ev = ev||event;
            if(isXXX){
                tools.removeClass(menuBtn,"active");
                mask.style.display = "none";
                isXXX = !isXXX;
            }
        });
        mask.addEventListener("touchstart",function(ev){
            ev = ev||event;
            ev.stopPropagation();
            ev.preventDefault();
        });
    }

    // 改变焦点
    changeFocus();
    function changeFocus(){
        var inputText = document.querySelector("#wrap .head .head-bottom form input[type='text']");
        inputText.addEventListener("touchstart",function(ev){
            ev=ev||event;
            this.focus();
            ev.stopPropagation();
            ev.preventDefault();
        })
        document.addEventListener("touchstart",function(){
            inputText.blur();
        })
    }

    // 改变颜色
    changeColor();
    function changeColor(){
        // 事件委托
        var list = document.querySelector("#wrap .content .damu-nav-wrapper .list");
        var liNodes = document.querySelectorAll("#wrap .content .damu-nav-wrapper .list>li");

        list.addEventListener("touchstart",function(){
                this.isMove = false;
        });
        list.addEventListener("touchmove",function(){
            this.isMove = true;
        });
        list.addEventListener("touchend",function(ev){
            if(this.isMove){
                return;
            }
            ev = ev||event;
            // console.log(ev);
            var touchC = ev.changedTouches[0];
            for(var i=0;i<liNodes.length;i++){
                tools.removeClass(liNodes[i],"active");
            }
            if(touchC.target.nodeName.toUpperCase()==="A"){
                tools.addClass(touchC.target.parentNode,"active");
            }else if(touchC.target.nodeName.toUpperCase()==="LI"){
                tools.addClass(touchC.target,"active");
            }
        });
        
    }
    // function changeColor(){
    //     var liNodes = document.querySelectorAll("#wrap .content .damu-nav-wrapper .list>li");
    //     for(var i=0;i<liNodes.length;i++){
    //         liNodes[i].addEventListener("touchstart",function(){
    //             this.isMove = false;
    //         });
    //         liNodes[i].addEventListener("touchmove",function(){
    //             this.isMove = true;
    //         });
    //         liNodes[i].addEventListener("touchend",function(){
    //             if(!this.isMove){
    //                 for(var i=0;i<liNodes.length;i++){
    //                     tools.removeClass(liNodes[i],"active");
    //                 }
    //                 tools.addClass(this,"active");
    //             }
                
    //         });
    //     }
    // }

    // 导航滑屏
    drag();
    function drag(){
        damu.dragNav();
    }
    //竖向滑屏
    Move();
    function Move(){
        var head = document.querySelector("#wrap .head");
        var content = document.querySelector("#wrap .content");
        var div = document.querySelector("#wrap .content>div");
        var scrollBar = document.querySelector("#wrap .scrollBar");
         // scrollBar/视口 = 视口/内容
        // 滚动条的高度
        var scale = document.documentElement.clientHeight/(head.offsetHeight+div.offsetHeight);
        scrollBar.style.height = document.documentElement.clientHeight*scale+"px";
        var callBack = {
            start:function(){
                scrollBar.style.opacity = 1;
            },
            move:function(){
                // 滚动条滚动的实时距离/滚动条的滚动的最远距离 = 内容滚动的实时距离/内容滚动的最远距离
                var scale = damu.css(this,"translateY")/(div.offsetHeight+head.offsetHeight - document.documentElement.clientHeight);//得出比例,this指item
                damu.css(scrollBar,"translateY",-scale*(document.documentElement.clientHeight - scrollBar.offsetHeight));
            },
            end:function(){
                scrollBar.style.opacity = 0;
            }
        }
        damu.dragMove(content,callBack);
    }
    
    // 轮播图
    carouselMap();
    function carouselMap(){
        var arr = ["../img/1.jpg","../img/2.jpg","../img/3.jpg","../img/4.jpg","../img/5.jpg"];
        damu.carousel(arr);
    }
}