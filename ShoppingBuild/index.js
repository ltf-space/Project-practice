window.onload = function(){
    const app = new Vue({
        el:"#order",
        data:{
            array:[
                {
                    id:1,
                    name:"《算法导论》",
                    time:'2006-9',
                    price:85,
                    count:1
                },
                {
                    id:2,
                    name:"《UNIX编程艺术》",
                    time:'2006-2',
                    price:59,
                    count:1
                },
                {
                    id:3,
                    name:"《编程珠玑》",
                    time:'2008-10',
                    price:39,
                    count:1
                },
                {
                    id:4,
                    name:"《代码大全》",
                    time:'2006-3',
                    price:128,
                    count:1
                }
            ]
        },
        methods:{
            decrement(index){
                return this.array[index].count--
            },
            increment(index){
                return this.array[index].count++
            },
            removeHandle(index){
                this.array.splice(index,1)
            }
        },
        // 过滤器
        filters:{
            showPrice(price){
                return'￥'+price.toFixed(2)
            }         
        },
        computed:{
            totlePrice(){
                //第一种
                // let num= 0;
                // for(let i=0;i<this.array.length;i++){
                //     num+=this.array[i].price * this.array[i].count;
                // }
                // return num
                
                //第二种，i为索引
                // let num= 0;
                // for(let i in this.array){
                //     num+=this.array[i].price * this.array[i].count;
                // }
                // return num

                //第三种(简便)
                // let num= 0;
                // for(let obj of this.array){
                //     num+=obj.price * obj.count;
                // }
                // return num
                
                //第四种 reduce函数
                return this.array.reduce(function(num,arr){
                    return num+arr.price*arr.count
                },0)
            }
            
        }
    })
}
