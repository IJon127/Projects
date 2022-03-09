function setReportDom(w, h) {
  reportDiv = select("#report");
  reportDiv.size(w, h);
  reportDiv.position(cnvW, 0);
}

// clr=========

const bgcGrayL = "#f7f7f7";
const bgcGrayD = "#d6d6d6";
const bgcCoolL = "#91EAE4";
const bgcCoolD = "#7F7FD5";
const bgcWarmL = "#f5af19";
const bgcWarmD = "#f12711";
const bgcBrDD = "#5F3F6F";
const bgcBrDL = "#797B7F";
const bgcBrMD = "#9968B1";
const bgcBrML = "#8A9AB2";
const bgcBrLD = "#ECC5FF";
const bgcBrLL = "#CFDDF3";

//=========================

Chart.defaults.font.size = 8;
// Chart.defaults.font.family = "Gloria Hallelujah";

let doughnutOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
};

let hueOptions = {
  plugins: {
    title: {
      display: true,
      text: "color hue",
      align: "center",
      position: "bottom",
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
};
let wcOptions = {
  plugins: {
    title: {
      display: true,
      text: "warm / cool",
      align: "center",
      position: "bottom",
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
};

let brOptions = {
  plugins: {
    title: {
      display: true,
      text: "brightnexx",
      align: "center",
      position: "bottom",
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
};

let lineOptions = {
  elements: {
    point: {
      radius: 0,
    },
    line:{
      borderWidth: 1.5,
      tension: 0.3,
    },
  },
  plugins: {
    legend: {
      display: true,
      align: "center",
    },
  },
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const borderColorWhite = "rgba(255, 255, 255, 1)";

const hueLabels = [
  "red",
  "orange",
  "yellow",
  "springgreen",
  "green",
  "turquoise",
  "cyan",
  "ocean",
  "blue",
  "violet",
  "magenta",
  "raspberry",
];
const hueBgc = [
  "rgba(255, 0, 0, 0.7)",
  "rgba(255, 180, 0, 0.7)",
  "rgba(255, 255, 0, 0.7)",
  "rgba(190, 255, 0, 0.7)",
  "rgba(0, 255, 0, 0.7)",
  "rgba(0, 255, 180, 0.7)",
  "rgba(0, 255, 255, 0.7)",
  "rgba(0, 128, 255, 0.7)",
  "rgba(0, 0, 255, 0.7)",
  "rgba(128, 0, 255, 0.7)",
  "rgba(255, 0, 255, 0.7)",
  "rgba(255, 0, 128, 0.7)",
];

const hueBdc = [
  "rgba(255, 0, 0, 1)",
  "rgba(255, 180, 0, 1)",
  "rgba(255, 255, 0, 1)",
  "rgba(190, 255, 0, 1)",
  "rgba(0, 255, 0, 1)",
  "rgba(0, 255, 180, 1)",
  "rgba(0, 255, 255, 1)",
  "rgba(0, 128, 255, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(128, 0, 255, 1)",
  "rgba(255, 0, 255, 1)",
  "rgba(255, 0, 128, 1)",
];

const wcLabels = ["warm", "cool"];
// const wcBgc = ["rgba(0, 235, 255, 0.7)", "rgba(255,100,0, 0.7)"];
// const wcBdc = ["rgba(0, 235, 255, 1)", "rgba(255,100,0, 1)"];
const wcBdc = "#ffffff";

const brLabels = ["dark", "middle", "bright"];
const brBgc = [
  "rgba(100, 54, 138, 0.7)",
  "rgba(145, 100, 181, 0.7)",
  "rgba(216, 166, 255, 0.7)",
];
// const brBdc = ["rgba(100, 54, 138, 1)", "rgba(145, 100, 181, 1)", "rgba(216, 166, 255, 1)"];
const brBdc = "#ffffff";

//top 2 doughnuts ---------------------------------
const ctxSqueeze = document.getElementById("squeezeTimeChart").getContext("2d");

const gradientSq1 = ctxSqueeze.createLinearGradient(0, 0, 0, 175);
gradientSq1.addColorStop(0, "#833ab4");
gradientSq1.addColorStop(0.5, "#fd1d1d");
gradientSq1.addColorStop(1, "#fcb045");

const gradientSq2 = ctxSqueeze.createLinearGradient(0, 180, 0, 0);
gradientSq2.addColorStop(0, bgcGrayD);
gradientSq2.addColorStop(1, bgcGrayL);

const squeezeTimeChart = new Chart(ctxSqueeze, {
  type: "doughnut",
  data: {
    labels: ["squeezing", "releasing  "],
    datasets: [
      {
        label: "",
        data: squeezingTimeChartData,
        backgroundColor: [gradientSq1, gradientSq2],
        borderColor: borderColorWhite,
        borderWidth: 1,
      },
    ],
  },
  options: doughnutOptions,
});

const ctxblank = document.getElementById("blankAreaChart").getContext("2d");

const gradientBl1 = ctxblank.createLinearGradient(0, 0, 0, 175);
gradientBl1.addColorStop(0, "#FF0080");
gradientBl1.addColorStop(0.5, "#FF8C00");
gradientBl1.addColorStop(1, "#40E0D0");

const gradientBl2 = ctxblank.createLinearGradient(0, 180, 0, 0);
gradientBl2.addColorStop(0, bgcGrayD);
gradientBl2.addColorStop(1, bgcGrayL);
const blankAreaChart = new Chart(ctxblank, {
  type: "doughnut",
  data: {
    labels: ["painted area", "blank area   "],
    datasets: [
      {
        label: "",
        data: [1, 1],
        backgroundColor: [gradientBl1, gradientBl2],
        borderColor: borderColorWhite,
        borderWidth: 1,
      },
    ],
  },
  options: doughnutOptions,
});

// Pie Pro ==================================

const ctxHuePro = document.getElementById("hueProChart").getContext("2d");
const hueProChart = new Chart(ctxHuePro, {
  type: "pie",
  data: {
    labels: hueLabels,
    datasets: [
      {
        label: "hue",
        data: hueSumPro,
        backgroundColor: hueBgc,
        borderColor: hueBdc,
        borderWidth: 1,
      },
    ],
  },
  options: hueOptions,
});

const ctxWcPro = document.getElementById("wcProChart").getContext("2d");

const gradientWcPCool = ctxWcPro.createLinearGradient(0, 0, 0, 80);
gradientWcPCool.addColorStop(0, bgcCoolD);
gradientWcPCool.addColorStop(1, bgcCoolL);

const gradientWcPWarm = ctxWcPro.createLinearGradient(0, 80, 0, 0);
gradientWcPWarm.addColorStop(0, bgcWarmD);
gradientWcPWarm.addColorStop(1, bgcWarmL);

const wcProChart = new Chart(ctxWcPro, {
  type: "doughnut",
  data: {
    labels: wcLabels,
    datasets: [
      {
        label: "warm/cool",
        data: wcSumPro,
        backgroundColor: [gradientWcPCool, gradientWcPWarm],
        borderColor: wcBdc,
        borderWidth: 1,
      },
    ],
  },
  options: wcOptions,
});

const ctxBrPro = document.getElementById("brProChart").getContext("2d");

const gradientBrD = ctxBrPro.createLinearGradient(0, 0, 0, 80);
gradientBrD.addColorStop(0, bgcBrDD);
gradientBrD.addColorStop(1, bgcBrDL);

const gradientBrM = ctxWcPro.createLinearGradient(0, 80, 80, 0);
gradientBrM.addColorStop(0, bgcBrMD);
gradientBrM.addColorStop(1, bgcBrML);

const gradientBrL = ctxWcPro.createLinearGradient(0, 80, 0, 0);
gradientBrL.addColorStop(0, bgcBrLD);
gradientBrL.addColorStop(1, bgcBrLL);

const brProChart = new Chart(ctxBrPro, {
  type: "pie",
  data: {
    labels: brLabels,
    datasets: [
      {
        label: "brightness",
        data: brSumPro,
        backgroundColor: [gradientBrD, gradientBrM, gradientBrL],
        borderColor: brBdc,
        borderWidth: 1,
      },
    ],
  },
  options: brOptions,
});

// Pie Fin ==================================
const ctxHueFin = document.getElementById("hueFinChart").getContext("2d");
const hueFinChart = new Chart(ctxHueFin, {
  type: "pie",
  data: {
    labels: hueLabels,
    datasets: [
      {
        label: "hue",
        data: hueSumFin,
        backgroundColor: hueBgc,
        borderColor: hueBdc,
        borderWidth: 1,
      },
    ],
  },
  options: hueOptions,
});

const ctxWcFin = document.getElementById("wcFinChart").getContext("2d");

const gradientWcFCool = ctxWcFin.createLinearGradient(0, 0, 0, 80);
gradientWcFCool.addColorStop(0, bgcCoolD);
gradientWcFCool.addColorStop(1, bgcCoolL);

const gradientWcFWarm = ctxWcFin.createLinearGradient(0, 80, 0, 0);
gradientWcFWarm.addColorStop(0, bgcWarmD);
gradientWcFWarm.addColorStop(1, bgcWarmL);
const wcFinChart = new Chart(ctxWcFin, {
  type: "doughnut",
  data: {
    labels: wcLabels,
    datasets: [
      {
        label: "warm/cool",
        data: wcSumFin,
        backgroundColor: [gradientWcFCool, gradientWcFWarm],
        borderColor: wcBdc,
        borderWidth: 1,
      },
    ],
  },
  options: wcOptions,
});

const ctxBrFin = document.getElementById("brFinChart").getContext("2d");
const brFinChart = new Chart(ctxBrFin, {
  type: "pie",
  data: {
    labels: brLabels,
    datasets: [
      {
        label: "brightness",
        data: brSumFin,
        backgroundColor: [gradientBrD, gradientBrM, gradientBrL],
        borderColor: brBdc,
        borderWidth: 1,
      },
    ],
  },
  options: brOptions,
});

//lineal chart =============================
const ctxLine = document.getElementById("lineGraph").getContext("2d");

const lineGraph = new Chart(ctxLine, {
  data: {
    datasets: [
      {
        type: "line",
        label: "movement",
        data: [10, 20, 30, 10],
        borderWidth: 1,
        borderColor: "#777777"
      },
      {
        type: "line",
        label: "radius",
        data: [30, 10, 15, 50],
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "color",
        data: [30, 10, 15, 50],
        backgroundColor: clrTimeline,
        borderWidth: 0,
        barPercentage: 0.1,
      },
    ],
    labels: ["", "", "", ""],
  },
  options: lineOptions,
});
