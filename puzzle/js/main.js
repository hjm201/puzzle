/*===========================================*/
/* 拼图组件
*  基于zepto来开发
*  develop by: huangjm
*  time: 2014.11.4
*/
 /*===========================================*/

//var jigsaw = (function($,window){
//    "use strict";
//
//    var Tile = function(src, board){
//        this.picSrc = src;
//        this.board = board;
//        this.tile_width = 0;    //每个tile的宽度
//        this.tile_height = 0;   //每个tile的高度
//        this.el = null;         //tile的元素
//        this.x = 0;             //顶点座标：x
//        this.y = 0;             //顶点座标: y
//        this.position = 0;      //在board里面的位置
//        this.row = 0;
//        this.col = 0;
//        this.tile_tmplate = '<div class="tile" draggable="false"></div>';
//        this.board_width = 0;
//        this.board_height = 0;
//    };
//    /*
//    * Tile对象
//    */
//    Tile.prototype = {
//        init:function(info){
//            this.initTileInfo(info);
//            this.render();
//        },
//        initTileInfo:function(info){
//            this.tile_width = info.width;
//            this.tile_height = info.height;
//            this.col = info.col;
//            this.row = info.row;
//            this.board_width = $(this.board).width();
//            this.board_height = $(this.board).height();
//        },
//        render:function(_pos){
//            this.el = $(this.tile_tmplate);
//            this.el.css({width:this.tile_width, height:this.tile_height});
//            var str = '<img src="'+this.picSrc+'" style="width:'+this.board_width+'px; height:'+this.board_height+'px;">';
//            this.el.append(str);
//            this.el.appendTo(this.board);
//        },
//        update:function(_pos,flag){
//            this.initPosInfo(_pos);
//            if(flag) this.initImgInfo(_pos);
//        },
//        initPosInfo:function(_pos){
//            this.x = (_pos%this.col)*this.tile_width;
//            this.y = Math.floor(_pos/this.col)*this.tile_height;
//            this.el.data("position", _pos);
//            this.el.css(this.cssTransform(this.x, this.y));
//        },
//        initImgInfo:function(_pos){
//            this.el.attr("id","id"+_pos);
//            this.el.find("img").eq(0).css(this.cssTransform(-1*this.x, -1*this.y));
//        },
//        cssTransform:function (x, y) {
//            return {left:x, top:y};
//        }
//    };
//
//
//   /*
//   * 传两参数，一个是id， 及拼图成功的回调函数
//   * */
//    var Board = function(args){
//        this.id = args.id;   //board的ID
//        this.callback = args.callback||function(){};    //刷图成功后的回调函数
//        this.board_width = 0;
//        this.board_height = 0;
//        this.col = args.col;   //board有几行
//        this.row = args.row;   //board有几列
//        this.board = null;
//        this.tiles = [];
//        this.slider = {};   //每个tile的宽和高
//        this.sliderInfo = {};
//    };
//    Board.prototype = {
//        init:function(){
//            this.board_height = window.screen.height;
//            //this.board_height = $("body")[0].scrollHeight;
//            this.board_width = window.screen.width;
//            //this.board_width = $("body").width();
//            console.log(this.board_height+" "+this.board_width);
//            this.render();
//        },
//        start:function(){
//            this.shuffle();
//            this.update();
//            this.initEvent();
//        },
//        render:function(){
//            this.board = $(this.id);
//            this.board.css({width:this.board_width, height:this.board_height});
//            this.slider.width = Math.floor(this.board_width/this.col);
//            this.slider.height = Math.floor(this.board_height/this.row);
//            var imgSrc = this.board.find("img").eq(0).attr("src");
//            this.board.html("");
//            this.fillTile(imgSrc);
//            this.update(true);
//        },
//        fillTile:function(_src){
//            for(var i = 0; i < this.row; i++){
//                for(var j = 0; j < this.col; j++){
//                    var tmpTile = new Tile(_src,this.id);
//                    tmpTile.init({
//                        width:this.slider.width,
//                        height:this.slider.height,
//                        col:this.col,
//                        row:this.row
//                    });
//                    this.tiles.push(tmpTile);
//                }
//            }
//        },
//        /*
//        * flag:true 为要渲染的img，及所在tile的位置信息
//        * flag:flase　只要设置tiles的集团信息即可
//        * */
//        update:function(flag){
//            flag = flag || false;
//            for(var i = 0; i < this.tiles.length; i++){
//                this.tiles[i].update(i,flag);
//            }
//        },
//        initEvent:function(){
//            var self = this;
//            this.board.find(".tile").each(function(i){
//                var tmpId ="#"+ $(this).attr("id");
//                console.log("tmpId::"+tmpId);
//                touch.on(tmpId, "touchstart",function(){
//                    console.log("----touchstart----tmpId:"+tmpId);
//                    var x = parseInt($(tmpId).css("left"));
//                    var y = parseInt($(tmpId).css("top"));
//                    self.sliderInfo.x = x;
//                    self.sliderInfo.y = y;
//                });
//                touch.on(tmpId, "drag", function(ev){
//                    var offx = self.sliderInfo.x + ev.x,
//                        offy = self.sliderInfo.y + ev.y;
//                    $(tmpId).css(self.tiles[0].cssTransform(offx, offy)).addClass("active");
//                });
//                touch.on(tmpId, "dragend", function(ev){
//                    var currPos = parseInt($(tmpId).data("position"));
//                    console.log("currPos::"+currPos);
//                    console.log("ev.x::"+ev.x+"  self.slider.width::"+self.slider.width);
//                    console.log("ev.y::"+ev.y+"  self.slider.height::"+self.slider.height);
//                    var move_x = Math.round(ev.x/self.slider.width);
//                    var move_y = Math.round(ev.y/self.slider.height);
//                    console.log("move_x::"+move_x+"  move_y::"+move_y);
//                    var nextPos = currPos + move_x + move_y*self.col;
//                    console.log("nextPos::"+nextPos);
//                    self.exchange(currPos, nextPos);
//                    $(tmpId).removeClass("active");
//                    var flag =self.isComplete();
//                    console.log("flag::"+flag);
//                    if(flag) self.callback();
//                });
//            });
//        },
//        exchange:function(currPos, nextPos){
//            var currObj = this.tiles[currPos];
//            this.tiles[currPos] = this.tiles[nextPos];
//            this.tiles[nextPos] = currObj;
//            this.tiles[currPos].update(currPos);
//            this.tiles[nextPos].update(nextPos);
//        },
//        shuffle: function () {
//            var i, j, temp;
//            for (i = this.tiles.length - 1; i > 0; i--) {
//                j = Math.floor(Math.random() * (i + 1));
//                temp = this.tiles[i];
//                this.tiles[i] = this.tiles[j];
//                this.tiles[j] = temp;
//            }
//        },
//        isComplete:function(){
//            for(var i = 0; i < $(".tile").size(); i++){
//                if($(".tile").eq(i).data("position") != i){
//                    return false;
//                }
//            }
//            return true;
//        }
//    };
//
//    return {
//        game:null,
//
//        init:function(args){
//            //callback = callback||function(){};
//            $("body").on("touchstart",function(e){
//                e.preventDefault();
//            })
//            this.game = new Board(args);
//            this.game.init();
//        }
//    }
//})(Zepto,window);



var jigsaw = (function($,window){
    "use strict";

    var Tile = function(src, board){
        this.picSrc = src;
        this.board = board;
        this.tile_width = 0;    //每个tile的宽度
        this.tile_height = 0;   //每个tile的高度
        this.el = null;         //tile的元素
        this.x = 0;             //顶点座标：x
        this.y = 0;             //顶点座标: y
        this.position = 0;      //在board里面的位置
        this.row = 0;
        this.col = 0;
        this.tile_tmplate = '<div class="tile" draggable="false"></div>';
        this.board_width = 0;
        this.board_height = 0;
    };
    /*
     * Tile对象
     */
    Tile.prototype = {
        init:function(info){
            this.initTileInfo(info);
            this.render();
        },
        initTileInfo:function(info){
            console.log("---initTileInfo---");
            this.tile_width = info.width;
            this.tile_height = info.height;
            this.col = info.col;
            this.row = info.row;
            this.board_width = info.board_width;
            this.board_height = info.board_height;
        },
        render:function(_pos){
            console.log("this.picSrc::"+this.picSrc);
            this.el = $(this.tile_tmplate);
            this.el.css({width:this.tile_width, height:this.tile_height});
            //var str = '<img src="'+this.picSrc+'" style="width:'+this.board_width+'px; height:'+this.board_height+'px;">';
            //this.el.append(str);
            this.el.appendTo(this.board);
        },
        update:function(_pos,flag){
            this.initPosInfo(_pos);
            if(flag) this.initImgInfo(_pos);
        },
        initPosInfo:function(_pos){
            this.x = (_pos%this.col)*this.tile_width;
            this.y = Math.floor(_pos/this.col)*this.tile_height;
            this.el.data("position", _pos);
            this.el.css(this.cssTransform(this.x, this.y));
        },
        initImgInfo:function(_pos){
            //this.el.attr("id","id"+_pos);
            this.el.css("background","url("+this.picSrc+") "+(-1*this.x)+"px "+(-1*this.y)+"px");
            //this.el.find("img").eq(0).css(this.cssTransform(-1*this.x, -1*this.y));
        },
        cssTransform:function (x, y) {
            return {left:x, top:y};
        }
    };


    /*
     * 传两参数，一个是id， 及拼图成功的回调函数
     * */
    var Board = function(args){
        this.id = args.id;   //board的ID
        this.callback = args.result_callback||function(){};    //刷图成功后的回调函数
        this.board_width = args.width ||0;
        this.board_height = args.height || 0;
        this.col = args.col;   //board有几行
        this.row = args.row;   //board有几列
        this.times = args.times;    //游戏的总时间
        this.timesBak = this.times;
        this.timeCall = args.time_callback;
        this.diff = 20;             //游戏刷的时间间格
        this.board = null;
        this.tiles = [];
        this.tiles_bak = [];
        this.slider = {};   //每个tile的宽和高
        this.sliderInfo = {};
    };
    Board.prototype = {
        init:function(){
            console.log(this.timeCall);
            this.board_height = this.board_height == 0?window.screen.height:this.board_height;
            //this.board_height = $("body")[0].scrollHeight;
            this.board_width = this.board_width == 0 ?window.screen.width:this.board_width;
            //this.board_width = $("body").width();
            console.log(this.board_height+" "+this.board_width);
            this.render();
            //var self = this;
            //setTimeout(function(){
            //    self.shuffle();
            //    self.update();
            //    self.initEvent();
            //}, 300);
        },
        start:function(){
            this.shuffle();
            this.update();
            this.initEvent();
            this.showTime();
        },
        render:function(){
            this.board = typeof this.id == "string"?$(this.id): this.id;
            this.board.css({width:this.board_width, height:this.board_height});
            this.slider.width = Math.floor(this.board_width/this.col);
            this.slider.height = Math.floor(this.board_height/this.row);
            console.log(this.board[0]);
            console.log(this.board.find("img").eq(0)[0]);
            var imgSrc = this.board.find("img").eq(0).attr("src");
            console.log("---hjm:: fun Board.render()-- imgSrc="+imgSrc);
            this.board.html("");
            this.fillTile(imgSrc);
            this.update(true);
        },
        fillTile:function(_src){
            for(var i = 0; i < this.row; i++){
                for(var j = 0; j < this.col; j++){
                    var tmpTile = new Tile(_src,this.board);
                    tmpTile.init({
                        width:this.slider.width,
                        height:this.slider.height,
                        col:this.col,
                        row:this.row,
                        board_width:this.board_width,
                        board_height:this.board_height
                    });
                    this.tiles.push(tmpTile);
                }
            }
            this.tiles_bak = this.tiles.slice(0);
        },
        /*
         * flag:true 为要渲染的img，及所在tile的位置信息
         * flag:flase　只要设置tiles的集团信息即可
         * */
        update:function(flag){
            flag = flag || false;
            for(var i = 0; i < this.tiles.length; i++){
                this.tiles[i].update(i,flag);
            }
        },
        initEvent:function(){
            var self = this;
            this.board.find(".tile").each(function(i){
                //var tmpId ="#"+ $(this).attr("id");
                //console.log("tmpId::"+tmpId);
                var tmpId = $(this);

                touch.on(tmpId, "touchstart",function(){
                    console.log(tmpId.css("background"));
                    //console.log(self.board.parent().data("sflag"));
                    //if(self.board.parent().data("sflag") != "0") return true;
                    //console.log("----touchstart----tmpId:"+tmpId);
                    var x = parseInt(tmpId.css("left"));
                    var y = parseInt(tmpId.css("top"));
                    self.sliderInfo.x = x;
                    self.sliderInfo.y = y;
                });
                touch.on(tmpId, "drag", function(ev){
                    //if(self.board.parent().data("sflag") != "0") return true;
                    var offx = self.sliderInfo.x + ev.x,
                        offy = self.sliderInfo.y + ev.y;
                    $(tmpId).css(self.tiles[0].cssTransform(offx, offy)).addClass("active");
                });
                touch.on(tmpId, "dragend", function(ev){
                    //if(self.board.parent().data("sflag") != "0") return true;
                    var currPos = parseInt(tmpId.data("position"));
                    console.log("currPos::"+currPos);
                    console.log("ev.x::"+ev.x+"  self.slider.width::"+self.slider.width);
                    console.log("ev.y::"+ev.y+"  self.slider.height::"+self.slider.height);
                    var move_x = Math.round(ev.x/self.slider.width);
                    var move_y = Math.round(ev.y/self.slider.height);
                    console.log("move_x::"+move_x+"  move_y::"+move_y);
                    var nextPos = currPos + move_x + move_y*self.col;
                    if(nextPos < 0 || nextPos >= self.col*self.row) nextPos = currPos;
                    console.log("nextPos::"+nextPos);
                    self.exchange(currPos, nextPos);
                    tmpId.removeClass("active");
                    var flag =self.isComplete();
                    console.log("flag::"+flag);
                    if(flag){
                        self.callback(true);
                        self.clearTime();
                    }
                });
            });
        },
        exchange:function(currPos, nextPos){
            var currObj = this.tiles[currPos];
            this.tiles[currPos] = this.tiles[nextPos];
            this.tiles[nextPos] = currObj;
            this.tiles[currPos].update(currPos);
            this.tiles[nextPos].update(nextPos);
        },
        shuffle: function(){
            var i, j, temp;
            for (i = this.tiles.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = this.tiles[i];
                this.tiles[i] = this.tiles[j];
                this.tiles[j] = temp;
            }
        },
        isComplete:function() {
            for (var i = 0; i < $(".tile").size(); i++) {
                if ($(".tile").eq(i).data("position") != i) {
                    return false;
                }
            }
            return true;
        },


        reset:function(){
            this.tiles = this.tiles_bak.slice(0);
            this.times = this.timesBak;
            this.update();
            this.shuffle();
            this.update();
            //this.initEvent();
            //this.showTime();
        },

        showTime:function(){
            console.log("this.showTime::"+this.times);
            if(this.times <= 0){
                this.callback(false);
                this.clearTime();
                return;
            }
            this.times = this.times - this.diff;
            var str = (this.times/1000).toFixed(2)+"''";
            this.timeCall(str);
            var self = this;
            this.t_timeout = setTimeout(function(){
                self.showTime();
            }, this.diff);
        },
        clearTime:function(){
            clearTimeout(this.t_timeout);
        }
    };

    return {
        game:null,

        init:function(args){
            //$("body").on("touchstart",function(e){
            //    e.preventDefault();
            //});
            console.log("------in puzzle main.js---");
            console.log(args);
            this.game = new Board(args);
            this.game.init();
        }
    }
})(Zepto,window);