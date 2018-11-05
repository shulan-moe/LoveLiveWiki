/**
 *  Target: LoveLive! SIF Perfect Lock Coverage Calculator for MF
 *  Version: 1.0.0.20161212_alpha
 *  Author: Chemical Fertilizers
 */

//9速10速的判定区间还是8速（from stat）
var Offset = [4.5, 4, 3.625, 3.25, 2.875, 2.5, 2.25, 2, 1.75, 1.5];
var Speed = [1.8, 1.6, 1.45, 1.3, 1.15, 1, 0.9, 0.8, 0.7, 0.6];
var Perfect = [0.072, 0.064, 0.058, 0.052, 0.046, 0.04, 0.036, 0.032, 0.032, 0.032];
var Great = [0.18, 0.16, 0.145, 0.13, 0.115, 0.1, 0.09, 0.08, 0.08, 0.08];
var Good = [0.288, 0.256, 0.232, 0.208, 0.184, 0.16, 0.144, 0.128, 0.128, 0.128];

function sortNumber(a, b)
{
    return a - b;
}

function sortArray(a, b)
{
    return a[0] - b[0];
}

//区间长度计算
function EndPoint_calc(StartPoint, td)
{
    return StartPoint + td;
}
    
//N判时间轴覆盖计算
function N_calc(n, p, td)
{
    var TimeAxis = new Array();
    for (var i = 0; i < Map_beat[Map_size - 1]; i++)
    {
        TimeAxis[i] = 1;
    }
    td *= 1000;
    var RequireNote = Math.floor(Map_size / n);

    var StartPoint = new Array();
    var EndPoint = new Array();
    var Probability = new Array();
    for (var k = 0; k < 200; k++)
    {
        StartPoint[k] = new Array();
        EndPoint[k] = new Array();
        Probability[k] = new Array();
    }

    for (i = 0; i < RequireNote; i++)
    {
        var j = 0;
        StartPoint[i][j] = Map_note[(i + 1) * n - 1];
        EndPoint[i][j] = EndPoint_calc(StartPoint[i][j], td);

        //计算第一个状态
        var sigma2 = 0;
        for (var l = 1; i != 0 && i - l != -1; l++)
        {
            var sigma1 = 0;
            for (k = 0; k < EndPoint[i - l].length; k++)
            {
                if (EndPoint[i - l][k] <= StartPoint[i][j])
                {
                    sigma1 = sigma1 + Probability[i - l][k];
                }
            }
            sigma2 = sigma2 + sigma1 * Math.pow((1 - p),(l - 1));
        }
        sigma2 = sigma2 + Math.pow((1 - p),(l - 1));
        Probability[i][j] = p * sigma2;

        //计算后面的状态
        j++;
        var TempStartPoint = new Array(0);
        var TempProbability = new Array(0);
        for (l = 1; i - l != -1; l++)
        {
            for (k = 0; k < EndPoint[i - l].length; k++)
            {
                if (EndPoint[i - l][k] > StartPoint[i][0])
                {
                    TempStartPoint[j] = EndPoint[i - l][k];
                    TempProbability[j] = p * Probability[i - l][k] * Math.pow((1 - p),(l - 1));
                    j++;
                }
            }
        }

        //合并重合的状态
        j = 1;
        l = 1;
        for (k = 1; k <= TempStartPoint.length; k++)
        {
            Probability[i][k] = 0;
        }
        while (l < TempStartPoint.length)
        {
            while (l < TempStartPoint.length)
            {
                if (TempStartPoint[l] != -1)
                {
                    StartPoint[i][j] = TempStartPoint[l];
                    Probability[i][j] += TempProbability[l];
                    break;
                }
                l++;
            }
            for (k = l + 1; k < TempStartPoint.length; k++)
            {
                if (TempStartPoint[k] == TempStartPoint[l])
                {
                    TempStartPoint[k] = -1;
                    Probability[i][j] += TempProbability[k];
                }
            }
            EndPoint[i][j] = EndPoint_calc(StartPoint[i][j], td);
            j++;
            l++;
        }

        //结果输出到时间轴
        for (j = 0; j < StartPoint[i].length; j++)
        {
            var a = Math.round(StartPoint[i][j]) - 1;
            var b = Math.round(EndPoint[i][j]) - 1;
            for (; a < b; a++)
            {
                TimeAxis[a] -= Probability[i][j];
            }
        }
    }

    return TimeAxis;
}

//T判时间轴覆盖计算
function T_calc(t, p, td, calctime)
{
    var TimeAxis = new Array();
    for (var i = 0; i < calctime; i++)
    {
        TimeAxis[i] = 1;
    }
    t *= 2;
    td *= 2;
    var StartPoint = new Array();
    var EndPoint = new Array();
    var Probability = new Array();
    var k = Math.ceil(calctime * 0.002 + 2);
    var f = new Array(k);
    var g = new Array(k);
    for (i = 0; i < k; i++)
    {
        f[i] = 0;
        g[i] = 0;
    }
    g[0] = 1;

    var j = 0;
    for (i = t; i < k; i++)
    {
        f[i] = p * g[i - t];
        g[i] = f[i - td] + (1 - p) * g[i - t];
        if (f[i] != 0)
        {
            StartPoint[j] = i * 500;
            EndPoint[j] = StartPoint[j] + td * 500;
            Probability[j] = f[i];
            j++;
        }
    }

    for (i = 0; i < StartPoint.length; i++)
    {
        for (j = Math.round(StartPoint[i]) - 1; j < Math.round(EndPoint[i]) - 1; j++)
        {
            TimeAxis[j] -= Probability[i];
        }
    }
    return TimeAxis;
}

//C判时间轴覆盖计算
function C_calc(c, p, td, s)
{
    var TimeAxis = new Array();
    for (var i = 0; i < Map_beat[Map_size - 1]; i++)
    {
        TimeAxis[i] = 1;
    }
    td *= 1000;
    var RequireNote = Math.floor(Map_size / c);

    var StartPoint = new Array();
    var EndPoint = new Array();
    var Probability = new Array();
    for (var k = 0; k < 200; k++)
    {
        StartPoint[k] = new Array();
        EndPoint[k] = new Array();
        Probability[k] = new Array();
    }

    for (i = 0; i < RequireNote; i++)
    {
        var j = 0;
        StartPoint[i][j] = Map_CTrigger[(i + 1) * c - 1][0];
        EndPoint[i][j] = EndPoint_calc(StartPoint[i][j], td);

        //计算第一个状态
        var sigma2 = 0;
        for (var l = 1; i != 0 && i - l != -1; l++)
        {
            var sigma1 = 0;
            for (k = 0; k < EndPoint[i - l].length; k++)
            {
                if (EndPoint[i - l][k] <= StartPoint[i][j])
                {
                    sigma1 = sigma1 + Probability[i - l][k];
                }
            }
            sigma2 = sigma2 + sigma1 * Math.pow((1 - p),(l - 1));
        }
        sigma2 = sigma2 + Math.pow((1 - p),(l - 1));
        Probability[i][j] = p * sigma2;

        //计算后面的状态
        j++;
        var TempStartPoint = new Array(0);
        var TempProbability = new Array(0);
        for (l = 1; i - l != -1; l++)
        {
            for (k = 0; k < EndPoint[i - l].length; k++)
            {
                if (EndPoint[i - l][k] > StartPoint[i][0])
                {
                    TempStartPoint[j] = EndPoint[i - l][k];
                    TempProbability[j] = p * Probability[i - l][k] * Math.pow((1 - p),(l - 1));
                    j++;
                }
            }
        }

        //合并重合的状态
        j = 1;
        l = 1;
        for (k = 1; k <= TempStartPoint.length; k++)
        {
            Probability[i][k] = 0;
        }
        while (l < TempStartPoint.length)
        {
            while (l < TempStartPoint.length)
            {
                if (TempStartPoint[l] != -1)
                {
                    StartPoint[i][j] = TempStartPoint[l];
                    Probability[i][j] += TempProbability[l];
                    break;
                }
                l++;
            }
            for (k = l + 1; k < TempStartPoint.length; k++)
            {
                if (TempStartPoint[k] == TempStartPoint[l])
                {
                    TempStartPoint[k] = -1;
                    Probability[i][j] += TempProbability[k];
                }
            }
            EndPoint[i][j] = EndPoint_calc(StartPoint[i][j], td);
            j++;
            l++;
        }

        //结果输出到时间轴
        for (j = 0; j < StartPoint[i].length; j++)
        {
            var a = Math.round(StartPoint[i][j]) - 1;
            var b = Math.round(EndPoint[i][j]) - 1;
            for (; a < b; a++)
            {
                TimeAxis[a] -= Probability[i][j];
            }
        }
    }

    return TimeAxis;
}

//计算对于trick的总note覆盖率
function CoverageOfTrick(s)
{
    TempCoverage = new Array(0);
    var k = new Array(0);
    for (var i = 0; i < Map_size; i++)
    {
        TempCoverage[i] = [0, 0];
        var a1 = Map_CTrigger[i][0] - 1000 * Good[s - 1];
        var a2 = Map_CTrigger[i][0] + 1000 * Good[s - 1];
        for (var j = a1; j < a2; j++)
        {
            TempCoverage[i][0] += TimeAxis[j];
        }
        TempCoverage[i][0] = TempCoverage[i][0] / (a2 - a1);

        if (i <= 49)
        {
            TempCoverage[i][1] = TempCoverage[i][0];
            k[i] = 1;
        }
        if (i >= 50 && i <= 99)
        {
            TempCoverage[i][1] = 1.10 * TempCoverage[i][0];
            k[i] = 1.10;
        }
        if (i >= 100 && i <= 199)
        {
            TempCoverage[i][1] = 1.15 * TempCoverage[i][0];
            k[i] = 1.15;
        }
        if (i >= 200 && i <= 399)
        {
            TempCoverage[i][1] = 1.20 * TempCoverage[i][0];
            k[i] = 1.20;
        }
        if (i >= 400 && i <= 599)
        {
            TempCoverage[i][1] = 1.25 * TempCoverage[i][0];
            k[i] = 1.25;
        }
        if (i >= 600 && i <= 799)
        {
            TempCoverage[i][1] = 1.30 * TempCoverage[i][0];
            k[i] = 1.30;
        }
        if (i >= 800)
        {
            TempCoverage[i][1] = 1.35 * TempCoverage[i][0];
            k[i] = 1.35;
        }
        if (Map[Map_CTrigger[i][1] - 1].effect == 3)
        {
            TempCoverage[i][1] *= 1.25;
            k[i] *= 1.25;
        }
    }
    var TempCoverageTrick = [0, 0];
    var j = 0;
    for (var i = 0; i < Map_size; i++)
    {
        TempCoverageTrick[0] += TempCoverage[i][0];
        TempCoverageTrick[1] += TempCoverage[i][1];
        j += k[i];
    }
    TempCoverageTrick[0] = TempCoverageTrick[0] / Map_size;
    TempCoverageTrick[1] = TempCoverageTrick[1] / j;
    return TempCoverageTrick;
}

function draw()
{
$(function ()
{
    $('#container').highcharts({
        title:
        {
            text: 'Coverage for Trick by Combo'
        },

        chart:
        {
            zoomType: 'x',
            resetZoomButton:
            {
                position:
                {
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 44
                }
            }
        },

        scrollbar:
        {
            enabled: true
        },

        exporting: 
        {
            enabled: false
        },

        xAxis:
        {
            reversed: false,
            gridLineWidth: 1,
            gridLineColor: "#d8d8d8",
            minorGridLineColor: "#f0f0f0",
            minRange: 50,
            title:
            {
                text: "Combo"
            }
        },

        yAxis:
        {
            min: 0,
            max: 1,
            tickInterval: 0.1,
            title:
            {
                text: "Coverage"
            },
            labels:
            {
                formatter: function()
                {
                    return this.value;
                } 
            }
        },

        tooltip:
        {
            crosshairs: true,
            formatter: function()
            {
                return 'Combo ' + this.x + '<br>Coverage ' + Math.round(1000 * this.y) / 10 + '%';
            }
        },

        legend:
        {
            enabled: false
        },

        plotOptions: 
        {
            area:
            {
                marker:
                {
                    enabled: false
                }
            }
        },

        series: Map_draw
    });
});
}

function CoverageCalculator()
{
    //读取卡组数据
    var member = new Array(9);
    var member_C = new Array(0);
    var j = 0;
    for (var i = 0; i < 9; i++)
    {
        member[i] = new Array(4);
        member[i][0] = Number(document.getElementById("member" + i).value);
        member[i][1] = Number(document.getElementById("require" + i).value);
        if (member[i][0] != 0 && member[i][1] <= 0)
        {
            alert("请输入正数");
            return;
        }
        if (member[i][0] != 0 && Math.floor(member[i][1]) != member[i][1])
        {
            alert("请输入整数");
            return;
        }
        if ((member[i][0] == 1 || member[i][0] == 3) && Number(document.getElementById("totalcombo").innerHTML) / member[i][1] > 200)
        {
            alert("结果超出设计容量");
            return;
        }
        member[i][2] = Number(document.getElementById("probability" + i).value);
        if (member[i][0] != 0 && (member[i][2] <= 0 || member[i][2] >= 100))
        {
            alert("impossible");
            return;
        }
        member[i][2] *= Number(document.getElementById("skillbuff").value);
        member[i][2] *= Number(document.getElementById("ouenbuff").value);
        member[i][2] /= 100;
        member[i][3] = Number(document.getElementById("time" + i).value);
        if (member[i][0] != 0 && member[i][3] <= 0)
        {
            alert("请输入正数");
            return;
        }
        if (member[i][0] == 2 && member[i][3] > member[i][1])
        {
            alert("覆盖时间应小于条件时间");
            return;
        }
        if (member[i][0] == 2 && Math.floor(2 * member[i][3]) != 2 * member[i][3])
        {
            alert("覆盖时间应为0.5的倍数");
            return;
        }
        //记录C判的信息
        if (member[i][0] == 3)
        {
            member_C[j] = new Array(0);
            member_C[j][0] = member[i][1];
            if (j - 1 >= 0 && member_C[j][0] != member_C[j - 1][0])
            {
                alert("暂不支持队伍中含有两种以上的C判");
                return;
            }
            member_C[j][1] = member[i][2];
            j++;
        }
    }

    var s = Number(document.getElementById("speeds").value);
    var _offset = Number(document.getElementById("offset").value);
    if (_offset < -50 || _offset > 50)
    {
        alert("请正确填写击打节奏");
        return;
    }
    if (Number(document.getElementById("live0").value) == 0 || Number(document.getElementById("live1").value) == 0 || Number(document.getElementById("live2").value) == 0)
    {
        alert("请选择歌曲，当前仅支持计算3连MF");
        return;
    }
    if (Number(document.getElementById("livetime0").value) == 0 || Number(document.getElementById("livetime1").value) == 0 || Number(document.getElementById("livetime2").value) == 0)
    {
        alert("歌曲缺少时间参数");
        return;
    }

    var maps1 = String(document.getElementById("live0").value);
    var maps2 = String(document.getElementById("live1").value);
    var maps3 = String(document.getElementById("live2").value);
        //处理文件序号
    var j = maps1.length;
    for (i = 0; i < 4 - j; i++)
    {
        maps1 = "0" + maps1;
    }
    var j = maps2.length;
    for (i = 0; i < 4 - j; i++)
    {
        maps2 = "0" + maps2;
    }
    var j = maps3.length;
    for (i = 0; i < 4 - j; i++)
    {
        maps3 = "0" + maps3;
    }
    if (_liveid < 641)
    {
        maps1 = "https://app.lovelivewiki.com/Maps/setting_" + maps1 + ".json";
        maps2 = "https://app.lovelivewiki.com/Maps/setting_" + maps2 + ".json";
        maps3 = "https://app.lovelivewiki.com/Maps/setting_" + maps3 + ".json";
    }
    else
    {
        maps1 = "https://rawfile.loveliv.es/livejson/Live_s" + maps1 + ".json";
        maps2 = "https://rawfile.loveliv.es/livejson/Live_s" + maps2 + ".json";
        maps3 = "https://rawfile.loveliv.es/livejson/Live_s" + maps3 + ".json";
    }

    document.getElementById('running').style.display = "";
    document.getElementById('running').scrollIntoView();
    Map = new Array(0);
    Map1 = new Array(0);
    Map2 = new Array(0);
    Map3 = new Array(0);
    $.getJSON(maps1, function(data){
    Map1 = data;
    $.getJSON(maps2, function(data){
    Map2 = data;
    $.getJSON(maps3, function(data){
    Map3 = data;
    //合并谱面
    var _livetime1 = Number(document.getElementById("livetime0").value);
    var _livetime2 = _livetime1 + Number(document.getElementById("livetime1").value);
    for (var i = 0; i < Map2.length; i++)
    {
        Map2[i].timing_sec += _livetime1;
    }
    for (var i = 0; i < Map3.length; i++)
    {
        Map3[i].timing_sec += _livetime2;
    }
    Map = Map1.concat(Map2);
    for (var i = 0; i < Map3.length; i++)
    {
        Map.push(Map3[i]);
    }

    Map_size = Map.length;
    Map_note = new Array(0);
    Map_beat = new Array(0);

    //计算note出现的时间，以ms为单位
    for (i = 0; i < Map_size; i++)
    {
        Map_note[i] = Math.round((Map[i].timing_sec - Speed[s - 1]) * 1000);
    }

    //计算模拟击打点列表
    for (i = 0; i < Map_size; i++)
    {    
        if (Map[i].effect == 3)
        {
            Map_beat[i] = Math.round((Map[i].timing_sec + Map[i].effect_value + Good[s - 1]) * 1000 - _offset * Offset[s - 1]);
        }
        else
        {
            Map_beat[i] = Math.round((Map[i].timing_sec + Good[s - 1]) * 1000 - _offset * Offset[s - 1]);
        }
    }
    Map_beat.sort(sortNumber);
    //找三首歌的时判计算区间
    var calctime1 = 0;
    var calctime2 = Map_beat[Number(document.getElementById("livecombo0").value) - 1];
    var calctime3 = _livetime1 * 1000;
    var calctime4 = Map_beat[Number(document.getElementById("livecombo0").value) + Number(document.getElementById("livecombo1").value) - 1];
    var calctime5 = _livetime2 * 1000;
    var calctime6 = Map_beat[Number(document.getElementById("totalcombo").innerHTML) - 1];
    var calctime = Math.max(Number(document.getElementById("livetime0").value),Number(document.getElementById("livetime1").value),Number(document.getElementById("livetime2").value)) * 1000;

    //计算C判触发可能点期望（判定点）列表
    Map_CTrigger = new Array(0);
    for (i = 0; i < Map_size; i++)
    {    
        Map_CTrigger[i] = new Array(0);
        if (Map[i].effect == 3)
        {
            Map_CTrigger[i][0] = Math.round((Map[i].timing_sec + Map[i].effect_value) * 1000 - _offset * Offset[s - 1]);
            Map_CTrigger[i][1] = i + 1;
        }
        else
        {
            Map_CTrigger[i][0] = Math.round(Map[i].timing_sec * 1000 - _offset * Offset[s - 1]);
            Map_CTrigger[i][1] = i + 1;
        }
    }
    Map_CTrigger.sort(sortArray);
        //消除1ms的谱面偏差
    for (i = 1; i < Map_size; i++)
    {
        if (Map_CTrigger[i][0] - Map_CTrigger[i - 1][0] == 1)
        {
            Map_CTrigger[i][0] = Map_CTrigger[i - 1][0];
        }
    }

    //计算主程序
    TimeAxis = new Array(0);
    for (var i = 0; i < Map_beat[Map_size - 1]; i++)
    {
        TimeAxis[i] = 1;
    }

    for (i = 0; i < 9; i++)
    {
        if (member[i][0] == 1)
        {
            var TempTimeAxis = N_calc(member[i][1], member[i][2], member[i][3]);
            for (j = 0; j < Map_beat[Map_size - 1]; j++)
            {
                TimeAxis[j] *= TempTimeAxis[j];
            }
        }
        if (member[i][0] == 2)
        {
            var TempTimeAxis = T_calc(member[i][1], member[i][2], member[i][3], calctime);
            var j1 = 0;
            var j2 = 0;
            for (j = 0; j < Map_beat[Map_size - 1]; j++)
            {
                if (j >= calctime1 && j <= calctime2)
                {
                    TimeAxis[j] *= TempTimeAxis[j];
                }
                if (j >= calctime3 && j <= calctime4)
                {
                    TimeAxis[j] *= TempTimeAxis[j1];
                    j1++;
                }
                if (j >= calctime5 && j <= calctime6)
                {
                    TimeAxis[j] *= TempTimeAxis[j2];
                    j2++;
                }
            }
        }
        if (member[i][0] == 3)
        {
            var TempTimeAxis = C_calc(member[i][1], member[i][2], member[i][3], s);
            for (j = 0; j < Map_beat[Map_size - 1]; j++)
            {
                TimeAxis[j] *= TempTimeAxis[j];
            }
        }
    }

    //最终时间轴采样输出
    for (var i = 0; i < Map_beat[Map_size - 1]; i++)
    {
        TimeAxis[i] = 1 - TimeAxis[i];
    }

    //计算总trick覆盖率
    CoverageTrick = CoverageOfTrick(s);
    CoverageTrick[0] = Math.round(CoverageTrick[0] * 1000) / 10;
    CoverageTrick[1] = Math.round(CoverageTrick[1] * 1000) / 10;
    CoverageTrickSingle = new Array(0);
    for (var i = 0; i < Map_size; i++)
    {
        CoverageTrickSingle[i] = TempCoverage[i][0];
    }
    document.getElementById("resultcoverage0").innerHTML = CoverageTrick[0];
    document.getElementById("resultcoverage1").innerHTML = CoverageTrick[1];

    //作图
    Map_draw = 
    [{
        type: 'area',
        lineWidth: 1,
        data: CoverageTrickSingle
    }];

    draw();
    document.getElementById('running').style.display = "none";
    });
    });
    });
}
