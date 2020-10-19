// 地图跟节点
var root = document.getElementsByTagName("body")[0]
// 雷区节点
var areas = null
var markedArea = []
var safeArea = []
var dangerArea = []
var scannedArea = []


var clickTimes = 0
// TAG 标记按键触发
var mouseOn = null;
// TAG 记录当前按键码
var mouseCode = null
// TAG 长按是否可触发
var mouseContains = true

var mouse_down = {}
var mouse_up = {}

// TAG 用于游戏状态判断
var win = false
var lose = false
//  TAG 用于长时间点击
var mouse_down_time = new Date();
var mouse_up_time = new Date();
var mouse_duration = null
// TAG 是否执行触发长按动作
var mouse_keeping = false
// TAG 用于解决鼠标按键冲突
var mouse_busy = false
var mouse_busy_button = null
var mouse_up = false
var mouse_down = false
// TAG
var config = {
    bomb_area_width: 10, // 雷区宽度
    bomb_area_height: 10, // 雷区高度
    bomb_area: 50,
    bomb_num: 10,  // 雷数目
    bomb_arr: [], // 雷位置
    bomb_map: [],// 雷区地图
    bomb_char: '*',
    start_time: null,
    end_time: null,
    result: null,
}
function mouseLeftKeeping() {
    console.log("|-mouseLeftKeeping", "左键持续按压触发")
} function mouseRightKeeping() {
    console.log("|-mouseLeftKeeping", "右键持续按压触发")
}
function getMouseStatus(prefix, data) {
    console.log(data)
    // console.log(prefix, "mouse_duration  : ", mouse_duration)
    if (mouse_up_time - mouse_down_time <= 0) {
        console.log(prefix, "mouse_down_time  : ", mouse_down_time)
    }
    else {
        console.log(prefix, "mouse_up_time  : ", mouse_up_time)
        console.log(prefix, "点击时间", mouse_up_time - mouse_down_time, 'ms')
    }
    console.log(prefix, "mouse_up  : ", mouse_up)
    console.log(prefix, "mouse_down  : ", mouse_down)
    console.log(prefix, "mouse_busy  : ", mouse_busy)
    console.log(prefix, "mouse_busy_button  : ", mouse_busy_button)
    // console.log(prefix, "mouse_up  : ", mouse_up)
    return
}
function init() {
    areas = null
    markedArea = []
    areas = null
    markedArea = []
    safeArea = []
    dangerArea = []
    scannedArea = []
    win = false
    lose = false
    config = {
        bomb_area_width: 10, // 雷区宽度
        bomb_area_height: 10, // 雷区高度
        bomb_area: 50,
        bomb_num: 10,  // 雷数目
        bomb_arr: [], // 雷位置
        bomb_map: [],// 雷区地图
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
 * @param {*} length 数组长度
 */
function initArr(length) {
    var arr = []
    while (arr.length < length)
        arr.push(0)
    return arr
}
/**
 * 通过坐标或 坐标号码 生成对象
 * @param {*} num  坐标号码
 * @param {*} x 坐标x值
 * @param {*} y 坐标y值
 */
function setPoint(num, x, y) {
    var point = {}
    if (num != null) {
        point.num = parseInt(num)
        point.x = Math.floor(point.num / config.bomb_area_width)
        point.y = Math.floor(point.num % config.bomb_area_width)
    }
    else {
        point.x = x
        point.y = y
        point.mun = x * config.bomb_area_width + y
    }
    return point
}
/**
 * 扫雷配置
 */
var config = {
    bomb_area_width: 10, // 雷区宽度
    bomb_area_height: 10, // 雷区高度
    bomb_area: 50,
    bomb_num: 10,  // 雷数目
    bomb_arr: [], // 雷位置
    bomb_map: [],// 雷区地图
    bomb_char: '*',
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
    // 生成10个雷 // 雷的数量config
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
            if (config.bomb_map[value] != config.bomb_char) { config.bomb_map[value] += 1 }
        })
    }
    console.warn("雷区设置完成")
    return
}
/**
 * 获取雷区周围的可点击区域
 *
 * @param {*} point
 * @returns   数组
 */
//  x width
//  y height
/*
up   x > 0
down x < height -1
left up x > 0 y > 0
right up x > 0 y < wdhth - 1
left y > 0
right y < width -1
 */
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
        }// right
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
 * 获得胜利
 */
function youwin() {
    alert("你赢了")
    // 修改标记变量
    win = true
    console.warn("win")
    return
}
/**
 * 扫雷失败
 */
function youLose() {
    // 修改标记变量
    lose = true
    alert("您引爆了地雷")
    console.log("youlose")
    return
}
/**
 * 添加标记
 * 添加类名marked
 * @param {*} e
 */
// function mark(e) {
//     e.classList.add('marked')
//     if (markedArea.indexOf(parseInt(e.getAttribute('area'))) == -1) {
//         markedArea.push(parseInt(e.getAttribute('area')))
//     }
//     return
// }
/**
 * 取消标记
 * 去除类名marked
 * @param {*} e
 */
function unMark(e) {
    e.classList.remove("marked");
    if (markedArea.indexOf(parseInt(e.getAttribute('area'))) != -1) {
        // console.warn(parseInt(e.getAttribute('area')))
        markedArea[(markedArea.indexOf(parseInt(e.getAttribute('area'))))] = null
    }
    return
}
/**
 * 引爆地雷
 * 扫雷失败
 * @param {*} e
 */
function boom(element) {
    // 修改标记变量
    lose = true
    element.classList.add("boom")
    // TAG 连锁爆炸，遍历爆炸
    config.bomb_arr.forEach(function (item) {
        areas[item].classList.add('boom')
    })
    return
}
/**
 * 周围有雷 危险
 * @param {object} e
 */
function areaDanger(element) {

    element.innerText = config.bomb_map[parseInt(element.getAttribute("area"))]
    element.classList.add("danger")
    // TAG 添加该点到危险数组
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
    // TAG 天加该点到 安全数组
    safeArea.push(parseInt(element.getAttribute("area")))
    return
}
/**
 * 实现点击到安全区，自动向周围探索
 * @param {*} element 被点击的DOM节点 - li
 */
function aroundStatus(element) {
    var point = setPoint(parseInt(element.getAttribute('area')))
    around = getAround(point)
    around.forEach(function (item) {
        //没有被探索过的
        if (safeArea.indexOf(item) == -1 && dangerArea.indexOf(item) == -1 && markedArea.indexOf(item) == -1) {
            var status = config.bomb_map[item]
            if (status == 0) {
                areaSafe(areas[item])
                if (safeArea.indexOf(item) == -1) {
                    safeArea.push(item)
                }
                aroundStatus(areas[item])
                return
            }
            if (status >= 1 && status <= 8) {
                areaDanger(areas[item])
                if (dangerArea.indexOf(item) == -1) {
                    dangerArea.push(item)
                }
            }
        }
        if (safeArea.indexOf(item) >= 0 || dangerArea.indexOf(item) >= 0 || markedArea.indexOf(item) >= 0) {
            // areaDanger(areas[item])
            //    continue
        }
    })
    return
}
/**
 * 判断是否搜出所有雷区
 */
function isWin() {
    console.log("iswin")
    if (safeArea.length + dangerArea.length == config.bomb_area_width * config.bomb_area_height - config.bomb_num) {
        youwin()
    }
    return
}
function remove(DOM) {
    var area = {}
    area.num = parseInt(DOM.getAttribute("area"))
    area.status = {}
    area.config = {}
    area.status.safe = DOM.classList.contains("safe")
    area.status.marked = DOM.classList.contains("marked")
    area.status.danger = DOM.classList.contains("danger")
    area.config.status = config.bomb_map[area.num]
    console.log(area.config.status)
    area.status.hidden = area.status.mark || area.status.safe || area.status.danger
    // console.log('--clickAction--left')
    if (safeArea.indexOf(area.num) == -1 && dangerArea.indexOf(area.num) == -1 && markedArea.indexOf(area.num) == -1) {
        switch (area.config.status) {
            case 0: {
                // 修改区块属性
                areaSafe(DOM)
                aroundStatus(DOM)
                if (scannedArea.indexOf(area.num) == -1) {
                    scannedArea.push(area.num)
                }
                break;
            }
            case config.bomb_char: {
                boom(DOM)
                setTimeout(function () {
                    // 这里就是处理的事件
                    if (lose) {
                        youLose()
                    }
                }, 1000);
                break
            }
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8: {
                console.warn("danger")
                areaDanger(DOM)
                break
            } default: {
                console.log(area)
            }
        }
    }
    else {
        console.warn("左键点击失效")
    }
    return
}
function sign(DOM) {
    var area = {}
    area.num = parseInt(DOM.getAttribute("area"))
    area.status = {}
    area.config = {}
    area.status.safe = DOM.classList.contains("safe")
    area.status.marked = DOM.classList.contains("marked")
    area.status.danger = DOM.classList.contains("danger")
    area.config.status = config.bomb_map[area.num]
    // console.warn(area.config.status)
    area.status.hidden = area.status.mark || area.status.safe || area.status.danger
    // area.around = getAround(DOM)
    // console.log('--clickAction--right')
    if (!area.status.safe && !area.status.danger) {
        if (area.status.marked) {
            unMark(DOM)
            console.log('unmark', DOM)
        }
        else {
            mark(DOM)
            console.log('marked', DOM)
        }
    }
    else {
        console.warn("右键点击失效")
    }
    return
}
/**
 * 对按键做出的反应
 * @param {*} BTN 鼠标按键码
 * @param {*} DOM dom节点
 *
 */
function clickAction(BTN, DOM) {
    // console.clear()
    var mouseLeftCode = 0;
    var mouseCenterCode = 1
    var mouseRightCode = 2
    var area = {}
    if (mouse_duration > 500) {
        console.log("|->", "clickAction->")
        sign(DOM)
        return
    }
    area.num = parseInt(DOM.getAttribute("area"))
    area.status = {}
    area.config = {}
    area.status.safe = DOM.classList.contains("safe")
    area.status.marked = DOM.classList.contains("marked")
    area.status.danger = DOM.classList.contains("danger")
    area.config.status = config.bomb_map[area.num]
    console.log(area.config.status)
    area.status.hidden = area.status.mark || area.status.safe || area.status.danger
    area.around = getAround(DOM)
    if (BTN == mouseLeftCode) {
        // console.clear()
        remove(DOM)
    }
    if (BTN == mouseRightCode) {
        sign(DOM)
    }
    if (BTN == mouseCenterCode) {
    }
    mouse_duration = null
    console.log("area      ", area)
    return
}
function freeMouse() {
    mouse_busy = false
    mouse_busy_button = null
    console.log("|->", "释放鼠标")
    getMouseStatus("| |-", "|-free")
}
function tempMousedownTop(e) {
    console.warn("onmousedown")
    switch (e.button) {
        case 0: { console.log("==>", "左键按下"); break; }
        case 1: { console.log("==>", "中键按下"); break; }
        case 2: { console.log("==>", "右键按下"); break; }
    }
    console.log("| \\ \n|  |\-", "e.button", e.button)
}
function tempMousedownSetTime() {
    setTimeout(() => {
        if (mouse_down && !mouse_up) {
            if (mouse_busy_button == 0) {
                // TAG 标记已经执行长按操作
                mouse_keeping = true
                return mouseLeftKeeping()
            }
            if (mouse_busy_button == 2) {
                mouse_keeping = true
                return mouseRightKeeping()
            }
        }
        switch (e.button) {
            case 0: { console.log("%c|=>", "color:pink", "触发左键长按，左键按下，执行结束"); break; }
            case 1: { console.log("%c|=>", "color:pink", "触发中键长按，中键按下，执行结束"); break; }
            case 2: { console.log("%c|=>", "color:pink", "触发右键长按，右键按下，执行结束"); break; }
        }
        return
    }, 510);
}
function tempMousedownBottom(e) {
    switch (e.button) {
        case 0: { console.log("%c|=>", "color:pink", "左键按下执行结束"); break; }
        case 1: { console.log("%c|=>", "color:pink", "中键按下执行结束"); break; }
        case 2: { console.log("%c|=>", "color:pink", "右键按下执行结束"); break; }
    }
}
function tempMouseupTop(e) {
    console.warn("onmouseup")
    switch (e.button) {
        case 0: { console.log("|=>", "左键松开"); break; }
        case 1: { console.log("|=>", "中键松开"); break; }
        case 2: { console.log("|=>", "右键松开"); break; }
    }
    console.log(e.button)
}
function tempMouseupBottom(e) {
    switch (e.button) {
        case 0: { console.log("%c|=>", "color:pink", "左键松开执行结束"); break; }
        case 1: { console.log("%c|=>", "color:pink", "中键松开执行结束"); break; }
        case 2: { console.log("%c|=>", "color:pink", "右键松开执行结束"); break; }
    }
}

function explode(element) {

    element.classList.add("boom")
    lose = true

}
function hasWin() {
    if (safeArea.length + dangerArea.length + config.bomb_arr.length === config.bomb_area_width * config.bomb_area_height) {
        win = true
        console.log("%cWin","color:pink")

    }
    if(lose)
    {
        console.error("lose")
    }
    return win
}
function explodeAll() {
    // config.bombarr
    config.bomb_arr.forEach(function (item) {
        areas[item].classList.add("boom")
    })
    lose = true
    return
}

function exploreAround(elementNum) {


    elementAround = getAround(setPoint(elementNum))
    console.log(elementAround)

    elementAround.forEach(function (item) {


        if (safeArea.indexOf(item) !== -1 || dangerArea.indexOf(item) !== -1) {
            return
        }

        if (config.bomb_map[item] === 0) {
            areaSafe(areas[item])
            exploreAround(item)
        }
        else {
            areaDanger(areas[item])
        }

        return 0
    })
}

function explore(element) {
    element.point = setPoint(parseInt(element.getAttribute("area")))
    // console.log(element.point)
    switch (config.bomb_map[element.point.num]) {
        // TAG 该点为 * 雷
        case config.bomb_char: {
            element.classList.add("boom")
            explodeAll()
            // bomb(element)
            break
        }
        // TAG 该点为  0 安全
        case 0: {
            areaSafe(element)
            exploreAround(element.point.num)
            break
        }
        // TAG 该点为数字 危险
        default: {
            //
            areaDanger(element)

        }
    }
    console.log("explore")
}

function mark(element) {
    console.log("mark")
    console.log(element)
    // // TAG 判断当前节点是否被标记
    // if (element.classList.contains("marked")) {
    //     // TAG 已经标记，取消标记
    //     element.classList.remove("marked")
    //     element.classList.add("doubt")

    // }
    // if(true) {
    //     // TAG 未标记， 添加标记
    //     element.classList.add("marked")
    // }
    if (element.classList.contains("marked")) {
        element.classList.remove("marked")
        element.classList.add("doubt")
    } else
        // TAG 判断当前节点是否被标记
        if (element.classList.contains("doubt")) {
            // TAG 已经标记，取消标记
            element.classList.remove("doubt")

            console.log("not doubt ")
        }
        else {
            // TAG 未标记， 添加标记
            element.classList.add("marked")
            console.log("marked")
        }
    console.log("=======================================")
}

function doubt(element) {
}
// tempMousedownBottom(e)
/**
 * 鼠标点击控制
 *
 */
function mouseClick() {
    root.oncontextmenu = function () { return false }
    root.onmousedown = function (e) {


        mouse_down = {
            down: true,
            code: e.button,
            time: new Date(),
            click_times: clickTimes
        }


        // TODO 判断全局按键码
        // TODO 若null 继续执行，
        // WARN 否则忽略

        console.log("before 判断全局按键码 ")
        console.log(mouse_down)
        console.log("mouseOn", mouseOn)
        console.log("mouseCode", mouseCode)



        // TAG 拦截执行
        //
        if (mouseOn === true && mouseCode !== null && mouseCode !== mouse_down.code) {
            console.log("按键触发冲突")
            return
        }

        if (e.path[0].classList.contains("safe") || e.path[0].classList.contains("danger")) {
            return console.log("已经探索过了，点击无效")
        }
        if(win || lose)
        {
            console.log("geme over")
            return
        }



        // TODO 同步当前按键码到全局
        mouseOn = true
        mouseCode = mouse_down.code

        setTimeout(() => {
            time = new Date()
            if (mouseOn === true && mouseCode !== null && mouseCode === mouse_down.code && mouseContains && time - mouse_down.time >= 1000) {

                if (mouse_down.code === 0) {
                    mark(e.path[0])
                }

                if (mouse_down.code === 2) {
                    doubt(e.path[0])
                }

                console.log(time - mouse_down.time)
                console.log("长按触发")
            }
            else {
                if (!mouseContains) {
                    console.log("不允许触发长按事件")
                }
                if (!mouseOn) {
                    console.log("按键未触发")
                }
                if (mouseCode === null) {
                    console.log("按键码空")
                }
                // DEBUG 解决接连出发按键（第一次不足定时条件），触发两次定时任务
                if (time - mouse_down.time < 1000) {
                    console.log("时间过短")
                }
            }
        }, 1000);


        // TAG 判断按键码
        // TAG 左键执行安全判定
        // TAG 右键执行标记判定
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
            return
        }

        if (mouse_down.code == 2) {
            console.log("righton")

            mark(e.path[0])
            console.log(e.path[0])
            return
        }
    }
    root.onmouseup = function (e) {
        // TAG 标记鼠标释放
        mouse_up = {
            up: true,
            // TAG 记录当前按键码
            code: e.button,
            // TAG 记录鼠标释放时间
            time: new Date()
        }


        // if (e.path[0].classList.contains("safe") || e.path[0].classList.contains("danger")) {
        //     return console.log("已经探索过了，点击无效")
        // }

        // TODO 判断全局按键码
        // TODO 若null 继续执行，
        // WARN 否则忽略


        // START 有效代码区
        if (win || lose) {
            console.log("geme over")
            return
        }
        hasWin()

        if (mouse_up.time - mouse_down.time < 1000) {
            console.log("未触发长按")
        }
        else {
            console.log("已经触发长按")
        }


        // console.log(e.composedPath()[0])

        // END  有效代码区

        console.log("mouseup")

        // TAG 恢复全局按键状态
        // TAG 恢复全局按键码

        mouseOn = false
        mouseCode = null
        // TAG 点击次数自增
        clickTimes += 1;

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
    console.log("生成结束")
    console.log(root)
    return
}
window.onload = function () {
    root = document.getElementById("root");
    // 生成地图
    setMap()
    // console.clear()
    // 生成DOM
    createMapElement()
    // 点击事件
    mouseClick()
    console.clear()
}
function restart() {
    console.log('------------------', root)
    config = {
        bomb_area_width: 10, // 雷区宽度
        bomb_area_height: 10, // 雷区高度
        bomb_area: 50,
        bomb_num: 10,  // 雷数目
        bomb_arr: [], // 雷位置
        bomb_map: [],// 雷区地图
        bomb_char: '*',
    }
    var i = 0
    console.log(root.length)
    root.innerHTML = ""
    areas = null
    markedArea = []
    safeArea = []
    dangerArea = []
    scannedArea = []
    lose = false
    win = false
    setMap()
    // console.clear()
    // 生成DOM
    createMapElement()
    return
}
function testCookie() {
    console.log()
}
function startMe() {
    init()
    config.bomb_num = parseInt(document.getElementsByName("bomb_num")[0].value)
    config.bomb_area_width = parseInt(document.getElementsByName("bomb_area_width")[0].value)
    config.bomb_area_height = parseInt(document.getElementsByName("bomb_area_height")[0].value)
    console.clear()
    root.innerHTML = []
    // setBomb()
    setMap()
    createMapElement()
    console.log(config)
    return
}
function getElementTop(el) {
    var actualTop = el.offsetTop
    var current = el.offsetParent
    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }
    return actualTop
}
