//Styles
import "./index.scss";

//JS
import "bootstrap";
import Vue from "vue";
import VueFullscreen from "vue-fullscreen";
import $ from "jquery";
import Board from "./board.js";


let isPlaying = false;
let shiftX = 10;
let shiftY = 10;

const minWidthCanvas = 1000;
let widthCanvas = 0;
let widthBoard = 0;
let heightCanvas = 0;
let heightBoard = 950;

let colors = {
    "text": "#000",
    "border": "#cccccc",
    "cardBorder": "#333333",
    "ready": "#b800dd",
    "analysis": "#ce1212",
    "development": "#1266cf",
    "testing": "#008100",
    "deployed": "#000000"
};

let config = {};
let board = null;
let tracing = [];

Vue.component("b-cards", {
    props: ["cards"],
    template: "<div><b-card :card=\"card\" v-for=\"(card) in cards\"></b-card></div>"
});

Vue.component("b-card", {
    props: ["card"],
    template: "<table class=\"b-card\">" +
        "<tr><td v-html=\"card.cardId\"></td></tr>" +
        "<tr v-for=\"(estimation, stage) in card.estimations\"><td><template v-for=\"(i) in estimation\">" +
        "<b-estimation :stage=\"stage\" :burned=\"i <= estimation - card.remainings[stage]\"></b-estimation>" +
        "</template></td></tr>" +
        "</table>"
});

Vue.component("b-estimation", {
    props: ["stage", "burned"],
    template: "<div :class=\"'b-'+stage + ' b-estimation' + (burned ? ' b-burned-' +  stage: '' )\"></div>"
});

Vue.use(VueFullscreen);
let app = new Vue({
    el: "#app",
    data: {
        startButton: "▶",
        resetButton: "🔄",
        fullscreenButton: "🎦",
        toggles: {
            isFullscreen: false,
        },
        info: {
            cfd: {
                name: "Cumulative flow diagram",
                description: "How many issues is in progress",
                styleClass: "info_positive",
                sign: "",
                value: 0,
                visible: false
            },
            cc: {
                name: "Control Chart",
                description: "Average issue cycleTime",
                styleClass: "info_positive",
                sign: "",
                value: 0,
                visible: false
            },
            dd: {
                name: "Distribution diagram",
                description: "85 percentile",
                styleClass: "info_positive",
                sign: "",
                value: 0,
                visible: false
            }
        },
        stageConfigs: {
            limit: "Limit",
            diceCount: "Workers",
            delay: "Delay"
        },
        stages: {
            ready: {
                limit: 4,
                isInnerDone: false,
                cards: {
                    wip: []
                }
            },
            analysis: {
                limit: 2,
                diceCount: 2,
                complexity: 2,
                diceIcon: "👩🏻‍🦰",
                averageUtilization: 0,
                isInnerDone: true,
                cards: {
                    wip: [],
                    done: []
                }
            },
            development: {
                limit: 4,
                diceCount: 3,
                complexity: 1,
                diceIcon: "🧔🏻",
                averageUtilization: 0,
                isInnerDone: true,
                cards: {
                    wip: [],
                    done: []
                }
            },
            testing: {
                limit: 3,
                diceCount: 2,
                complexity: 3,
                diceIcon: "👱🏽‍♀",
                averageUtilization: 0,
                isInnerDone: false,
                cards: {
                    wip: []
                }
            },
            done: {
                isInnerDone: false,
                cards: {
                    wip: []
                }
            },
            deployed: {
                delay: 3,
                isInnerDone: false,
                cards: {
                    wip: []
                }
            }
        },
        boardData: {}
    },
    methods: {
        construct: function () {
            tracing = [];
            config.stages = Object.keys(this.stages).map(key => {
                let stage = {};
                Object.assign(stage, this.stages[key]);
                stage.name = key;
                return stage;
            });
            board = new Board(config);
        },
        about: function () {
            return window.open('https://timmson.github.io');
        },
        reset: function (event) {
            if (isPlaying) {
                this.startToggle();
            }
            this.construct();
        },
        startToggle: function (event) {
            isPlaying = !isPlaying;
            this.startButton = isPlaying ? "⏸" : "▶";
            this.tickDown();
        },
        handleResize: function (event) {
            if (!isPlaying && board !== null) {
                this.tickDown();
            }
        },
        handleKey: function (event) {
            if (event.keyCode === 70) {
                this.toggles.isFullscreen = !this.toggles.isFullscreen;
            } else if (event.keyCode === 83) {
                this.startToggle(event);
            } else if (event.keyCode === 82) {
                this.reset(event);
            }
        },
        tickDown: function () {
            this.boardData = isPlaying ? board.turn() : board.view();
            Object.keys(this.boardData.utilization).forEach(stageName => {
                this.stages[stageName].averageUtilization = this.boardData.utilization[stageName].average;
            });

            Object.keys(this.boardData.columns).forEach(stageName => {
                this.stages[stageName].cards = this.boardData.columns[stageName];
            });
            this.$forceUpdate();
            this.draw();
            if (isPlaying) {
                setTimeout(this.tickDown, 1000);
            }
        },
        draw: function () {
            widthCanvas = window.innerWidth * 0.33,//Math.max(window.innerWidth * 0.25, minWidthCanvas);
                widthBoard = widthCanvas - 2 * shiftX;
            heightCanvas = (minWidthCanvas / 1.68) + (widthCanvas - minWidthCanvas) * 0.2;
            heightBoard = heightCanvas - 2 * shiftY;
            $("canvas").attr("width", widthCanvas);
            $("canvas").attr("height", heightCanvas);
            drawCFD(document.getElementById("cfd").getContext("2d"), this.boardData);
            drawCC(document.getElementById("cc").getContext("2d"), this.boardData);
            drawDD(document.getElementById("dd").getContext("2d"), this.boardData);
        }
    },
    created() {
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("keyup", this.handleKey);
        this.handleResize();
    },
    mounted() {
        this.construct();
        this.tickDown();
    },
    updated() {
        config.stages = Object.keys(this.stages).map(key => {
            let stage = {};
            Object.assign(stage, this.stages[key]);
            stage.name = key;
            return stage;
        });
        board.updatedConfig(config);
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("keyup", this.handleKey)
    }
});

function drawLabel(ctx, x, y, font, color, value) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
}

function drawCFD(ctx, data) {
    ctx.clearRect(0, 0, widthBoard, heightBoard);

    let spec = {cellGridCount: 5};
    spec.cellWidth = tracing.length > 10 ? Math.min(
        Math.floor(heightBoard / (tracing[tracing.length - 1].ready * 1.5)),
        Math.floor(widthBoard / (tracing.length * 1.5))
    ) : 32;
    spec.cellColumnCount = Math.floor(widthBoard / spec.cellWidth);
    spec.cellRowCount = Math.floor(heightBoard / spec.cellWidth);

    drawGrid(ctx, spec, "days", "count");

    if (data.currentDay > 0) {
        let currentTracing = {
            "deployed": data.columns.deployed.wip.length
        };
        currentTracing.testing = currentTracing.deployed + data.columns.done.wip.length;
        currentTracing.development = currentTracing.testing + data.columns.testing.wip.length + data.columns.development.done.length;
        currentTracing.analysis = currentTracing.development + data.columns.development.wip.length + data.columns.analysis.done.length;
        currentTracing.ready = currentTracing.analysis + data.columns.analysis.wip.length + data.columns.ready.wip.length;

        if (isPlaying) {
            tracing.push(currentTracing);
        }

        let lastPoint = {};
        tracing.forEach((count, i) => {
            Object.keys(count).forEach(key => {
                if (lastPoint[key] === undefined) {
                    lastPoint[key] = {
                        x: spec.cellGridCount * spec.cellWidth,
                        y: heightBoard - spec.cellGridCount * spec.cellWidth
                    };
                }
                ctx.lineWidth = 3;
                let point = {
                    x: spec.cellGridCount * spec.cellWidth + i * spec.cellWidth,
                    y: heightBoard - spec.cellGridCount * spec.cellWidth - spec.cellWidth * count[key]
                };
                ln(ctx, lastPoint[key].x, lastPoint[key].y, point.x, point.y, colors[key], [1, 0]);
                lastPoint[key] = point;
                ctx.beginPath();
                ctx.arc(lastPoint[key].x, lastPoint[key].y, 3, 0, 2 * Math.PI);
                ctx.strokeStyle = colors[key];
                ctx.stroke();
                ctx.fillStyle = colors[key];
                ctx.fill();
            });
        });

        if ((currentTracing.ready - currentTracing.deployed) > app.info.cfd.value) {
            app.info.cfd.styleClass = "info_negative";
            app.info.cfd.sign = "⬆️";
        } else {
            app.info.cfd.styleClass = "info_positive";
            app.info.cfd.sign = "⬇️";
        }
        app.info.cfd.value = (currentTracing.ready - currentTracing.deployed);
    }
}

function drawCC(ctx, data) {
    ctx.clearRect(0, 0, widthBoard, heightBoard);

    let cycleTimeList = data.columns.deployed.wip.map(card => card.endDay - card.startDay);

    let spec = {cellGridCount: 5};
    spec.cellWidth = cycleTimeList.length > 5 ? Math.min(
        Math.floor(heightBoard / (Math.max.apply(Math, cycleTimeList) * 1.5)),
        Math.floor(widthBoard / (cycleTimeList.length * 1.5))
    ) : 24;
    spec.cellColumnCount = Math.floor(widthBoard / spec.cellWidth);
    spec.cellRowCount = Math.floor(heightBoard / spec.cellWidth);

    drawGrid(ctx, spec, "# task", "days");

    if (data.currentDay > 0) {
        let lastAvg = null;
        cycleTimeList.forEach((taskCt, i) => {
            let peek = {
                x: spec.cellGridCount * spec.cellWidth + spec.cellWidth * i,
                y: heightBoard - (spec.cellGridCount + taskCt) * spec.cellWidth
            };

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.setLineDash([1, 0]);
            ctx.arc(peek.x, peek.y, 3, 0, 2 * Math.PI);
            ctx.strokeStyle = colors.development;
            ctx.stroke();
            ctx.fillStyle = colors.development;
            ctx.fill();

            ctx.lineWidth = 5;
            ln(ctx, peek.x, heightBoard - spec.cellGridCount * spec.cellWidth, peek.x, peek.y, colors.development, [1, 0]);

            let rollingAvgWindow = 5;
            let sum = 0;
            let start = (i < rollingAvgWindow ? 0 : i - rollingAvgWindow);
            let end = (i < cycleTimeList.length - rollingAvgWindow - 1 ? i + rollingAvgWindow : cycleTimeList.length - 1);

            for (let j = start; j <= end; j++) {
                sum += cycleTimeList[j];

            }
            let avgY = heightBoard - (spec.cellGridCount + Math.floor(sum / (end + 1 - start))) * spec.cellWidth;

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.setLineDash([1, 0]);
            ctx.arc(peek.x, avgY, 3, 0, 2 * Math.PI);
            ctx.strokeStyle = colors.analysis;
            ctx.stroke();
            ctx.fillStyle = colors.analysis;
            ctx.fill();

            if (lastAvg != null) {
                ctx.lineWidth = 3;
                ln(ctx, lastAvg.x, lastAvg.y, peek.x, avgY, colors.analysis, [1, 0]);
            }

            lastAvg = {x: peek.x, y: avgY};
        });


        if (cycleTimeList.length >= 5) {
            let avg = cycleTimeList.slice(-5, -1).reduce((a, b) => a + b) / 5;
            if (avg > app.info.cc.value) {
                app.info.cc.styleClass = "info_negative";
                app.info.cc.sign = "⬆️";
            } else {
                app.info.cc.styleClass = "info_positive";
                app.info.cc.sign = "⬇️";
            }
            app.info.cc.value = avg;
        }

    }

}

function drawDD(ctx, data) {
    ctx.clearRect(0, 0, widthBoard, heightBoard);

    let spec = {cellColumnCount: 50};
    spec.cellWidth = Math.floor(widthBoard / spec.cellColumnCount);
    spec.cellRowCount = Math.floor(heightBoard / spec.cellWidth);
    spec.cellGridCount = 5;

    drawGrid(ctx, spec, "days", "count");

    if (data.currentDay > 0) {
        let cycleTimeMap = {};
        let cycleTime = data.columns.deployed.wip.map(card => card.endDay - card.startDay);
        cycleTime.forEach(cycleTime => cycleTimeMap[cycleTime] = 1 + (cycleTimeMap[cycleTime] !== undefined ? cycleTimeMap[cycleTime] : 0));
        let max = {
            key: 0,
            val: 0
        };
        Object.keys(cycleTimeMap).forEach(key => {
            max = cycleTimeMap[key] >= max.val ? {key: key, val: cycleTimeMap[key]} : max;

            let peek = {
                x: spec.cellGridCount * spec.cellWidth + spec.cellWidth * key,
                y: heightBoard - (spec.cellGridCount + cycleTimeMap[key]) * spec.cellWidth
            };

            let lastPeek = {
                x: spec.cellGridCount * spec.cellWidth + spec.cellWidth * (parseInt(key) === 0 ? 0 : key - 1),
                y: heightBoard - (spec.cellGridCount + (cycleTimeMap[key - 1] !== undefined ? cycleTimeMap[key - 1] : 0)) * spec.cellWidth
            };

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.setLineDash([1, 0]);
            ctx.arc(peek.x, peek.y, 3, 0, 2 * Math.PI);
            ctx.strokeStyle = colors.development;
            ctx.stroke();
            ctx.fillStyle = colors.development;
            ctx.fill();

            ln(ctx, lastPeek.x, lastPeek.y, peek.x, peek.y, colors.development, [1, 0]);
            ln(ctx, peek.x, heightBoard - spec.cellGridCount * spec.cellWidth, peek.x, peek.y, colors.development, [20, 5]);
        });

        let percentil = 0;
        let cnt = 0;
        let border = 0.85;

        while ((cnt / cycleTime.length) <= border) {
            cnt = cycleTime.filter(t => t < percentil).length;
            percentil++;
        }

        if (percentil > app.info.dd.value) {
            app.info.dd.styleClass = "info_negative";
            app.info.dd.sign = "⬆️";
        } else {
            app.info.dd.styleClass = "info_positive";
            app.info.dd.sign = "⬇️";
        }

        app.info.dd.value = percentil;
    }
}

function drawGrid(ctx, spec, xLabel, yLabel) {
    ctx.lineWidth = 1;

    rr(ctx, 0, 0, widthBoard, heightBoard, 25, colors.border, [1, 0]);

    for (let i = 1; i < spec.cellColumnCount; i++) {
        ctx.lineWidth = (i === spec.cellGridCount ? 5 : 1);
        ln(ctx, spec.cellWidth * i, 0, spec.cellWidth * i, heightBoard, colors[i % spec.cellGridCount === 0 ? "text" : "border"], [1, 0]);
        if (i > spec.cellGridCount && i % spec.cellGridCount === 0) {
            let text = (i + spec.cellGridCount >= spec.cellColumnCount) ? xLabel : i - spec.cellGridCount;
            drawLabel(ctx, spec.cellWidth * (i - 1), heightBoard - spec.cellWidth * (spec.cellGridCount - 1), "20px Arial", colors.text, text);
        }
    }

    for (let j = 1; j < spec.cellRowCount; j++) {
        ctx.lineWidth = (j === spec.cellGridCount ? 5 : 1);
        ln(ctx, 0, heightBoard - spec.cellWidth * j, widthBoard, heightBoard - spec.cellWidth * j, colors[j % spec.cellGridCount === 0 ? "text" : "border"], [1, 0]);
        if (j > spec.cellGridCount && j % spec.cellGridCount === 0) {
            let text = (j + spec.cellGridCount >= spec.cellRowCount) ? yLabel : j - spec.cellGridCount;
            drawLabel(ctx, spec.cellWidth * (spec.cellGridCount - 1), heightBoard - spec.cellWidth * (j - 1), "20px Arial", colors.text, text);
        }
    }

    ctx.lineWidth = 1;
}

function ca(ctx, x, y, r, color, done, all) {
    ctx.lineWidth = 1;
    for (let i = 0; i < all; i++) {
        ctx.beginPath();
        ctx.arc(x + 3 * r * i, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
        if (i < done) {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
}

function ln(ctx, x1, y1, x2, y2, color, dashed) {
    ctx.setLineDash(dashed);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function rr(ctx, x1, y1, x2, y2, r, color, dashed) {
    ctx.setLineDash(dashed);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1 + r, y1);
    ctx.lineTo(x2 - r, y1);
    ctx.arc(x2 - r, y1 + r, r, 1.5 * Math.PI, 0);
    ctx.lineTo(x2, y2 - r);
    ctx.arc(x2 - r, y2 - r, r, 0, 0.5 * Math.PI);
    ctx.lineTo(x1 + r, y2);
    ctx.arc(x1 + r, y2 - r, r, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(x1, y1 + r);
    ctx.arc(x1 + r, y1 + r, r, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
}
