// 地图跟节点
var root = document.getElementsByTagName("body")[0]
var title
// 雷区节点
var areas = null
var markedArea = []
var safeArea = []
var dangerArea = []
// NOTE: 触发长按的时间节点 ms
var mouseDruationTime = 500
// NOTE: 标记按键触发
var mouseOn = null;
// NOTE: 记录当前按键码
var mouseCode = null
// NOTE: 长按是否可触发
var mouse_down = {}
var mouse_up = {}
// NOTE: 用于游戏状态判断
var win = false
var lose = false
// NOTE: 用于长时间点击
var mouse_down_time = new Date();
var mouse_up_time = new Date();
var mouse_duration = null
// NOTE: 是否执行触发长按动作
var mouse_keeping = false
// NOTE: 用于解决鼠标按键冲突
var mouse_busy = false
var mouse_busy_button = null
// NOTE: 扫雷配置
var config = {
    bomb_area_width: 10, // 雷区宽度
    bomb_area_height: 10, // 雷区高度
    bomb_area: 50,
    bomb_num: 10, // 雷数目
    bomb_arr: [], // 雷位置
    bomb_map: [], // 雷区地图
    bomb_char: '*',
    start_time: null,
    end_time: null,
    result: null,
}

/**
 * 配置初始化
 */
function init() {
    title = document.getElementsByClassName("title")[0]
    title.innerText = "简单扫雷"
    root = document.getElementById("root");
    root.innerHTML = []
    areas = null
    markedArea = []
    safeArea = []
    dangerArea = []
    mouseDruationTime = 500
    mouseOn = null;
    mouseCode = null
    mouse_down = {}
    mouse_up = {}
    win = false
    lose = false
    mouse_down_time = new Date();
    mouse_up_time = new Date();
    mouse_duration = null
    mouse_keeping = false
    mouse_busy = false
    mouse_busy_button = null
    config = {
        bomb_area_width: 10, // 雷区宽度
        bomb_area_height: 10, // 雷区高度
        bomb_area: 50,
        bomb_num: 10, // 雷数目
        bomb_arr: [], // 雷位置
        bomb_map: [], // 雷区地图
        bomb_char: '*',
        start_time: null,
        end_time: null,
        result: null,
    }
    return
}
/**
 * 获取DOM元素集合存储到变量areas
 */
function setAreas() {
    areas = document.getElementsByClassName("column")
    return areas
}
/**
 * 数组初始化，填充 0
 * @param {number} length 数组长度
 */
function initArr(length) {
    var arr = []
    while (arr.length < length)
        arr.push(0)
    return arr
}
/**
 * 通过坐标或 坐标号码 生成对象
 * @param {number} num 坐标号码
 * @param {number} x 坐标x值
 * @param {number} y 坐标y值
 * @returns {object}{ num: 12, x: 1, y: 2}
 */
function setPoint(num, x, y) {
    var point = {}
    if (num != null) {
        point.num = parseInt(num)
        point.x = Math.floor(point.num / config.bomb_area_width)
        point.y = Math.floor(point.num % config.bomb_area_width)
    } else {
        point.x = x
        point.y = y
        point.mun = x * config.bomb_area_width + y
    }
    return point
}

/* 生成雷区地图相关***********************************************************/
/**
 * 生成目标个有效雷区位置
 * 数据来自全局变量config
 * 返回生成的坐标数组
 * @returns 返回生成的雷点
 */
function setBomb() {
    var bomb;
    while (config.bomb_arr.length < config.bomb_num) {
        // 获取可能的雷坐标
        bomb = Math.floor(Math.random() * config.bomb_area_width * config.bomb_area_height)
        // 判断该位置是否被占用，没有被占用则在该位置添加雷
        if (config.bomb_arr.indexOf(bomb) == -1) {
            config.bomb_arr.push(bomb)
        }
    }
    return config.bomb_arr
}
/**
 * 设置雷区
 */
function setMap() {
    // 生成10个雷
    // 雷的数量config
    // config.bomb_num // 雷个数
    setBomb()
    // 初始化雷区 填充0
    config.bomb_map = initArr(config.bomb_area_width * config.bomb_area_height)
    for (var i = 0; i < config.bomb_num; i++) {
        // 遍历并取出雷的坐标
        var aroundNums = []
        var point
        point = setPoint(config.bomb_arr[i])
        // 获取雷的周围坐标
        aroundNums = getAround(point)
        console.log('雷' + i, point, "around ", aroundNums)
        // 雷
        config.bomb_map[point.num] = config.bomb_char
        // 类的周围
        aroundNums.forEach(function (value) {
            if (config.bomb_map[value] != config.bomb_char) {
                config.bomb_map[value] += 1
            }
        })
    }
    console.warn("雷区设置完成")
    return
}
/**
 * 获取雷区周围的可点击区域
 *
 * @param {*} point
 * @returns 数组
 */
// x width
// y height
// NOTE: up x > 0
// NOTE: down x < height - 1
// NOTE: left up x > 0 y > 0
// NOTE: right up x > 0 y < wdhth - 1
// NOTE:left y > 0
// NOTE: right y < width - 1
function getAround(point) {
    var aroundNum = []
    // top
    if (point.x > 0) {
        aroundNum.push(point.num - config.bomb_area_width)
        // left
        if (point.y > 0) {
            aroundNum.push(point.num - config.bomb_area_width - 1)
        }
        // right
        if (point.y < config.bomb_area_width - 1) {
            aroundNum.push(point.num - config.bomb_area_width + 1)
        }
    }
    // bottom
    if (point.x < config.bomb_area_height - 1) {
        aroundNum.push(point.num + config.bomb_area_width)
        // left
        if (point.y > 0) {
            aroundNum.push(point.num + config.bomb_area_width - 1)
        } // right
        if (point.y < config.bomb_area_width - 1) {
            aroundNum.push(point.num + config.bomb_area_width + 1)
        }
    }
    // left
    if (point.y > 0) {
        aroundNum.push(point.num - 1)
    }
    // right
    if (point.y < config.bomb_area_width - 1) {
        aroundNum.push(point.num + 1)
    }
    return aroundNum.sort();
}
/* 点击事件相关***********************************************************/

/**
 * 周围有雷 危险
 * @param {object} e
 */
function areaDanger(element) {
    element.innerText = config.bomb_map[parseInt(element.getAttribute("area"))]
    element.classList.add("danger")
    // NOTE: 添加该点到危险数组
    dangerArea.push(parseInt(element.getAttribute("area")))
    return
}
/**
 * 周围无雷 安全
 * @param {*} e
 */
function areaSafe(element) {
    element.innerText = ''
    element.classList.add("safe")
    // NOTE: 天加该点到 安全数组
    safeArea.push(parseInt(element.getAttribute("area")))
    return
}

function winOrLose() {
    console.log(safeArea.length + dangerArea.length + config.bomb_arr.length, config.bomb_area_width * config.bomb_area_height)
    if (safeArea.length + dangerArea.length + config.bomb_arr.length === config.bomb_area_width * config.bomb_area_height) {
        win = true
        console.log("%cWin", "color:pink")
    }
    if (lose) {
        console.error("lose")
    }
    return win || lose
}

function explode(element) {
    element.classList.add("boom")
    lose = true
}

function explodeAll() {
    // config.bombarr
    config.bomb_arr.forEach(function (item) {
        areas[item].classList.add("boom")
    })
    lose = true
    return
}

function explore(element) {
    element.point = setPoint(parseInt(element.getAttribute("area")))
    // console.log(element.point)
    if (element.classList.contains("marked") || element.classList.contains("doubt")) {
        console.log("已标记，点击无效")
        return
    }
    switch (config.bomb_map[element.point.num]) {
        // NOTE: 该点为 * 雷
        case config.bomb_char: {
            element.classList.add("boom")
            explodeAll()
            // bomb(element)
            break
        }
        // NOTE: 该点为 0 安全
        case 0: {
            areaSafe(element)
            exploreAround(element.point.num)
            break
        }
        // NOTE: 该点为数字 危险
        default: {
            //
            areaDanger(element)
        }
    }
    console.log("explore")
}

function exploreAround(elementNum) {
    elementAround = getAround(setPoint(elementNum))
    // console.log(elementAround)
    elementAround.forEach(function (item) {
        if (areas[item].classList.contains("marked") || areas[item].classList.contains("doubt")) {
            console.log("已标记，无法探索")
            return
        }
        if (safeArea.indexOf(item) !== -1 || dangerArea.indexOf(item) !== -1) {
            return
        }
        if (config.bomb_map[item] === 0) {
            areaSafe(areas[item])
            exploreAround(item)
        } else {
            areaDanger(areas[item])
        }
        return 0
    })
}

function mark(element) {
    console.log("mark")
    // console.log(element)
    // NOTE: 逻辑 "marked" "doubt" "" 三者循环
    // 确定 不确定 未知
    // NOTE: 如果当前标记为 marked 则修改为doubt
    if (element.classList.contains("marked")) {
        element.classList.remove("marked")
        element.classList.add("doubt")
        console.log(" marked ==> doubt")
    } else
        // NOTE: 判断当前节点是否被标记doubt
        if (element.classList.contains("doubt")) {
            // NOTE: 已经标记，取消标记
            element.classList.remove("doubt")
            console.log(" doubt ==> ")
        }
        else {
            // NOTE: 未标记， 添加标记 marked
            element.classList.add("marked")
            console.log(" ==> marked")
        }
}

function mouseClick() {
    // NOTE: 屏蔽右键菜单
    root.oncontextmenu = function () {
        return false
    }
    // NOTE: 按键按下时触发
    root.onmousedown = function (e) {
        switch (e.button) {
            case 0: {
                console.log("==>", "左键按下");
                break;
            }
            case 1: {
                console.log("==>", "中键按下");
                break;
            }
            case 2: {
                console.log("==>", "右键按下");
                break;
            }
        }
        mouse_down = {
            down: true,
            code: e.button,
            time: new Date(),
        }
        // if (!mouseCode && !mouseOn) {
        //     mouseCode = e.button
        //     mouseOn = true
        //     console.log("按下")
        // }
        // mouseClick = true
        // NOTE: 判断全局按键码
        // NOTE: 若null 继续执行，
        // NOTE: 否则忽略
        // console.log("before 判断全局按键码 ")
        // console.log(mouse_down)
        // console.log("mouseOn", mouseOn)
        // console.log("mouseCode", mouseCode)
        // NOTE: 拦截执行
        //
        if (win) {
            console.log("%cyou win", "color:red;fontsize:24px")
            return
        } if (lose) {
            console.log("%cyou lose", "color:red;fontsize:24px")
            return
        }
        if (mouseOn === true && mouseCode !== null && mouseCode !== mouse_down.code) {
            console.log("按键触发冲突")
            return
        }
        if (e.path[0].classList.contains("safe") || e.path[0].classList.contains("danger")) {
            return console.log("已经探索过了，点击无效")
        }
        if (win || lose) {
            console.log("geme over")
            return
        }
        // NOTE: 同步当前按键码到全局
        mouseOn = true
        mouseCode = mouse_down.code
        setTimeout(() => {
            time = new Date()
            if (mouseOn === true && mouseCode !== null && mouseCode === mouse_down.code && time - mouse_down.time >= mouseDruationTime) {
                if (mouse_down.code === 0) {
                    console.log("|-mouseLeftKeeping", "左键持续按压触发")
                    mark(e.path[0])
                    // return
                }
                if (mouse_down.code === 2) {
                    console.log("|-mouseLeftKeeping", "右键持续按压触发")
                    // doubt(e.path[0])
                    // return
                }
                console.log(time - mouse_down.time)
                console.log("长按触发")
            } else {
                if (!mouseOn) {
                    console.log("按键未触发")
                }
                if (mouseCode === null) {
                    console.log("按键码空")
                }
                // NOTE:解决接连出发按键（第一次不足定时条件），触发两次定时任务
                if (time - mouse_down.time < mouseDruationTime) {
                    console.log("时间过短")
                }
            }
        }, mouseDruationTime);
        // NOTE: 判断按键码
        // NOTE: 左键执行安全判定
        // NOTE: 右键执行标记判定

        switch (e.button) {
            case 0: {
                console.log("%c|=>", "color:pink", "触发左键长按，左键按下，执行结束");
                break;
            }
            case 1: {
                console.log("%c|=>", "color:pink", "触发中键长按，中键按下，执行结束");
                break;
            }
            case 2: {
                console.log("%c|=>", "color:pink", "触发右键长按，右键按下，执行结束");
                break;
            }
        }
    }
    // NOTE: 按键释放时触发
    root.onmouseup = function (e) {
        switch (e.button) {
            case 0: {
                console.log("|=>", "左键松开");
                break;
            }
            case 1: {
                console.log("|=>", "中键松开");
                break;
            }
            case 2: {
                console.log("|=>", "右键松开");
                break;
            }
        }
        // NOTE: 标记鼠标释放
        mouse_up = {
            up: true,
            // NOTE: 记录当前按键码
            code: e.button,
            // NOTE: 记录鼠标释放时间
            time: new Date()
        }
        if (mouse_up.code !== mouseCode) {
            console.log("松开冲突")
            return
        }
        // NOTE: 动作拦截
        if (win) {
            console.log("%cyou win", "color:red;fontsize:24px")
            title.innerText = "好棒！！"
            return
        } if (lose) {
            console.log("%cyou lose", "color:red;fontsize:24px")
            title.innerText = "继续努力！！"
            return
        }

        if (mouse_up.time - mouse_down.time < mouseDruationTime) {
            if (mouse_down.code == 0) {
                console.log("lefton")
                if (e.path[0].classList.contains("marked")) {
                    console.log("被标记 marked")
                    console.warn("点击失效")
                }
                if (e.path[0].classList.contains("doubt")) {
                    console.log("被标记 doubt ")
                    console.warn("点击失效")
                }
                explore(e.path[0])
                console.log(e.path[0])
                // return
            }
            if (mouse_down.code == 2) {
                console.log("righton")
                mark(e.path[0])
                console.log(e.path[0])
                // return
            }
        }

        // if (e.path[0].classList.contains("safe") || e.path[0].classList.contains("danger")) {
        // return console.log("已经探索过了，点击无效")
        // }
        // NOTE: 判断全局按键码
        // NOTE: 若null 继续执行，
        // NOTE: 否则忽略
        // START 有效代码区
        winOrLose()
        // if (win || lose) {

        //     return
        // }
        if (win) {
            console.log("geme over")
            console.log("%cyou win", "color:red;fontsize:24px")
            title.innerText = "好棒！！"
            return
        } if (lose) {
            console.log("geme over")
            console.log("%cyou lose", "color:red;fontsize:24px")
            title.innerText = "继续努力！！"
            return
        }
        //NOTE: 判断是否胜利或失败

        // NOTE: 暂时没有作用
        // END 有效代码区
        console.log("mouseup")
        // NOTE: 恢复全局按键状态
        mouseOn = false
        // NOTE: 恢复全局按键码
        mouseCode = null
        // NOTE: 点击次数自增
        // clickTimes += 1;
        switch (e.button) {
            case 0: {
                console.log("%c|=>", "color:pink", "左键松开执行结束");
                break;
            }
            case 1: {
                console.log("%c|=>", "color:pink", "中键松开执行结束");
                break;
            }
            case 2: {
                console.log("%c|=>", "color:pink", "右键松开执行结束");
                break;
            }
        }
    }
}
/**
 * 生成DOM 节点
 * 前置条件，定义root节点，生成的节点都挂载于root 节点
 * 读取的配置 width height
 * @param j asd
 */
function createMapElement() {
    // 地图结构
    // ul#root.rows>li.row>ul.columns>li.column
    // 雷区的宽高
    var width = config.bomb_area_width;
    var height = config.bomb_area_height;
    var i = 0;
    var rli;
    var cul;
    var cli;
    var j = 0;
    var text;
    setAreas()
    while (i < height) {
        console.log("生成第", i + 1, "行")
        rli = document.createElement("li")
        rli.className = "row";
        cul = document.createElement("ul")
        cul.className = "columns"
        j = 0
        while (j < width) {
            cli = document.createElement("li");
            cli.className = "column"
            text = document.createTextNode(i * width + j)
            cli.setAttribute('area', (i * width + j))
            // test cli.setAttribute('onclick', "console.log(this.getAttribute('area'))")
            cli.appendChild(text)
            cul.appendChild(cli)
            j++
            // console.log(cul)
        }
        console.log(cul)
        rli.appendChild(cul)
        root.appendChild(rli)
        i++
    }
    root.style.width = 36 * config.bomb_area_width + "px"
    console.log("生成结束")

    return
}
/**
 * 页面加载完后执行
 */
window.onload = function () {

    init()
    // 生成地图
    setMap()
    // console.clear()

    // 生成DOM
    createMapElement()
    // 点击事件
    mouseClick()

    console.clear()
}
/**
 * 重新开始
 */
function restart() {
    // NOTE: 清空控制台
    console.clear()
    init()
    console.log("重新开始")
    setMap()
    createMapElement()
    return
}
/**
 * 自定义开始
 */
function startMe() {
    init()
    config.bomb_num = parseInt(document.getElementsByName("bomb_num")[0].value)
    config.bomb_area_width = parseInt(document.getElementsByName("bomb_area_width")[0].value)
    config.bomb_area_height = parseInt(document.getElementsByName("bomb_area_height")[0].value)
    console.clear()

    setMap()
    createMapElement()
    return
}