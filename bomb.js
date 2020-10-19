// 地图跟节点
var root = document.getElementsByTagName("body")[0]
// 雷区节点
var areas = null
var markedArea = []
var safeArea = []
var dangerArea = []
var scannedArea = []
var win = false
var lose = false
var mouse_down_time = new Date();
var mouse_up_time = new Date();
var mouse_duration
var mouse_up = false
var mouse_down = false
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
}
/**
 * 扫雷失败
 */
function youLose() {
    // 修改标记变量
    lose = true
    alert("您引爆了地雷")
    console.log("youlose")
}
/**
 * 添加标记
 * 添加类名marked
 * @param {*} e
 */
function mark(e) {
    e.classList.add('marked')
    if (markedArea.indexOf(parseInt(e.getAttribute('area'))) == -1) {
        markedArea.push(parseInt(e.getAttribute('area')))
    }
}
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
}
/**
 * 引爆地雷
 * 扫雷失败
 * @param {*} e
 */
function boom(e) {
    // 修改标记变量
    lose = true
    e.classList.add("boom")
    config.bomb_arr.forEach(function (item) {
        areas[item].classList.add('boom')
    })
}
/**
 * 周围有雷 危险
 * @param {object} e
 */
function areaDanger(e) {
    e.innerText = config.bomb_map[parseInt(e.getAttribute("area"))]
    e.classList.add("danger")
    dangerArea.push(parseInt(e.getAttribute("area")))
}
/**
 * 周围无雷 安全
 * @param {*} e
 */
function areaSafe(e) {
    e.innerText = ''
    e.classList.add("safe")
    safeArea.push(parseInt(e.getAttribute("area")))
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
}
/**
 * 判断是否搜出所有雷区
 */
function isWin() {
    console.log("iswin")
    if (safeArea.length + dangerArea.length == config.bomb_area_width * config.bomb_area_height - config.bomb_num) {
        youwin()
    }
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
    console.warn(area.config.status)
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
    console.warn(area.config.status)
    area.status.hidden = area.status.mark || area.status.safe || area.status.danger
    // area.around = getAround(DOM)
    // console.log('--clickAction--right')
    if (!area.status.safe && !area.status.danger) {
        if (area.status.marked) {
            unMark(DOM)
            console.warn('unmark', DOM)
        }
        else {
            mark(DOM)
            console.warn('marked', DOM)
        }
    }
    else {
        console.warn("右键点击失效")
    }
}
function clickAction(BTN, DOM) {
    // console.clear()
    var mouseLeftCode = 0;
    var mouseCenterCode = 1
    var mouseRightCode = 2
    var area = {}
    if (mouse_duration > 500) {
        sign(DOM)
        mouse_duration = 0
        return
    }
    area.num = parseInt(DOM.getAttribute("area"))
    area.status = {}
    area.config = {}
    area.status.safe = DOM.classList.contains("safe")
    area.status.marked = DOM.classList.contains("marked")
    area.status.danger = DOM.classList.contains("danger")
    area.config.status = config.bomb_map[area.num]
    console.warn(area.config.status)
    area.status.hidden = area.status.mark || area.status.safe || area.status.danger
    area.around = getAround(DOM)
    mouse_duration = mouse_up_time - mouse_down_time
    time = new Date()
    if (time - mouse_down_time > 500) {
        sign(DOM)
        return 0
    }
    // console("sfsdf")
    if (BTN == mouseLeftCode) {
        // console.clear()
        remove(DOM)
    }
    if (BTN == mouseRightCode) {
        sign(DOM)
    }
    if (BTN == mouseCenterCode) {
        // console.clear()
        // console.log('--clickAction--center')
    }
    console.log("area      ", area)
    // console.warn(safeArea)
}
/**
 * 鼠标点击控制
 *
 */
function mouseClick() {
    root.oncontextmenu = function () { return false }
    root.onmousedown = function (e) {

        // 标记鼠标按下
        mouse_down = true
        // 记录鼠标按下时间
        mouse_down_time = new Date()
        // 获取DOM 节点
        DOM = e.path[0]
        console.clear()
        // 判断时候胜利或失败
        // if (win) {
        //     // console.clear()
        //     console.log("win")
        //     return
        // }
        // if (lose) {
        //     // console.clear()
        //     console.log("lose")
        //     return
        // }
        console.warn("onmousedown")
        // console.log()
        getMouseStatus("| |-", "|-status")

        // 定时任务
        // TODO适配手机不能右键
        setTimeout(() => {

            // if (mouse_down) {
            //     console.clear()
            //     // console.log()
            //     time = new Date
            //     console.log(mouse_down_time, time)
            //     console.warn("settimeout")
            //     console.log(e)
            //     clickAction(e.button, e.path[0])
            // }
            // else {
            //     console.clear()
            //     console.warn("settimeout--晚了")
            // }
            if (mouse_down && !mouse_up) {
                mouse_duration = new Date() - mouse_down_time;
                clickAction(e.button, DOM)
                console.log("|-setTimeout", new Date - mouse_down_time)
            }

        }, 510);
        // console.clear()
        // console.log(e.path[0])
        // 鼠标按下后 鼠标状态为按下状态
        mouse_up = false
    }

    root.onmouseup = function (e) {
        // 记录鼠标松开
        mouse_up = true
        // 记录鼠标松开时间
        mouse_up_time = new Date()

        console.warn("onmouseup")
        getMouseStatus("| |-", "|-status")



        // var area = e.composedPath()[0].getAttribute("area")
        // var point = setPoint(area)
        // var around = getAround(point)



        if (win) {
            // console.clear()
            console.log("win")
            return
        }
        if (lose) {
            // console.clear()
            console.log("lose")
            return
        }

        // 执行 点击操作
        console.log("|", "clickAction")
        clickAction(e.button, e.composedPath()[0])

        // console.log(point, around)
        // 改变鼠标状态， 鼠标状态

        mouse_down = false
    }
    root.onclick = function (e) {
        console.warn("onclick")
        getMouseStatus("| |-", "|-status")
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
            // @test cli.setAttribute('onclick', "console.log(this.getAttribute('area'))")
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
