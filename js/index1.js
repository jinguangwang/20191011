// 在移动端处理滑屏的事件的时候，我们要把文档滑动的默认行为禁止掉
$(document).on('touchstart touchmove touchend', function (ev) {
    ev.preventDefault();
})

let cubeModule = (function () {

    let $cubeBox = $('.cubeBox'),
        $cube = $cubeBox.children('.cube');

    //按下
    function down(ev) {
        // 

        let point = ev.changedTouches[0];
        this.startX = point.clientX;
        this.startY = point.clientY;
        if (!this.rotateX) {
            this.rotateX = -30;
            this.rotateY = 45;
        }
        this.isMove = false;
    }
    //移动
    function move(ev) {
        // console.log(ev);
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.startX;
        this.changeY = point.clientY - this.startY;
        if (Math.abs(this.changeX) > 10 || Math.abs(this.changeY) > 10) {
            this.isMove = true;
        }
    }
    //抬起,如果发生移动，在原始的旋转角度上继续移动
    function up(ev) {
        let point = ev.changedTouches[0],
            $this = $(this);
        if (!this.isMove) return;
        // this.rotateX = this.rotateX + this.changeX / 3;
        // this.rotateY = this.rotateY + this.changeY / 3;
        this.rotateY = this.rotateY + this.changeX / 3;
        this.rotateX = this.rotateX - this.changeY / 3;
        $this.css(`transform`, `scale(.8) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`);
    }

    return {
        init(isInit) {
            $cubeBox.css('display','block');
            if(isInit) return;
            $cube.css('transform', 'scale(.8) rotateX(-30deg) rotateY(45deg)').on('touchstart', down)
                .on('touchmove', move)
                .on('touchend', up);
            // 模仿佛灭一枚额事
            $cube.children('li').tap(function(){
                $cubeBox.css('display','none');
                swiperMoudule.init($(this).index()+1);
            })
        }
    }
})();

// ====滑屏模块====
let swiperMoudule = (function () {
    // SWiper的循环模式 把第一张复制放后面，把最后一张复制放前面。（规定）
    let swiperExample = null,
        $baseInfo = null,
        $swiperBox = $('.swiperBox'),
        $returnBox = $('.returnBox');

    function pageMove() {
        $baseInfo = $('.baseInfo');
        let activeIndex = this.activeIndex,
            slides = this.slides;
        // 第一页3d折叠菜单的处理
        if (activeIndex === 1 || activeIndex === 7) {
            $baseInfo.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $baseInfo.makisu('open');
        } else {
            $baseInfo.makisu({
                selector: 'dd',
                overlap: 0,
                speed: 0
            });
            $baseInfo.makisu('close');
        }

        // 给当前页面设置ID 让它有动画效果
        [].forEach.call(slides, (item, index) => {
            if (index === activeIndex) {
                activeIndex === 0 ? activeIndex = 6 : null;
                activeIndex === 7 ? activeIndex = 1 : null;
                item.id = 'page' + activeIndex;
                return;
            }
            item.id = null
        })


    }

    return {
        init(index = 1) {
            $swiperBox.css('display','block');
            if(swiperExample){
                swiperExample.slideTo(index, 0);
                return; 
            }
            swiperExample = new Swiper('.swiper-container', {
                initialSlide: index,
                direction: 'horizontal', //
                loop: true,
                effect: 'coverflow', // cube fade coverflow flip
                on: {
                    init: pageMove,
                    transitionEnd: pageMove
                }
            });
            swiperExample.slideTo(index, 0);

            //单击返回事件
            $returnBox.tap(function(){
                $swiperBox.css('display','none');
                cubeModule.init(true);  
            });
        }
    }
})();

cubeModule.init();
// swiperMoudule.init()

// 音乐的处理
function handleMusic(){
    let $musicAudio = $('.musicAudio'),
        musicAudio = $musicAudio[0],
        $musicIcon = $('.musicIcon');
    
    $musicAudio.on('play',function(){
        $musicIcon.css('display','block').addClass('move'); 
    })

    $musicIcon.tap(function(){
        if(musicAudio.paused){
            play();
            $musicIcon.addClass('move');
            return; 
        } 
        // 当前是播放状态
        musicAudio.pause();
        $musicIcon.removeClass('move'); 
    })

    function play(){
        musicAudio.play();
    }
    play();
}
setTimeout(handleMusic,1000)