function logslider(position) {
    var minp = 0;
    var maxp = 60;
  
    var minv = Math.log(Math.E / 10);
    var maxv = Math.log(Math.E * 10);
  
    // calculate adjustment factor
    var scale = (maxv-minv) / (maxp-minp);
  
    return Math.exp(minv + scale*(position-minp));
}

// from https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/******* TRANSFORMATION *******/
// shader
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-shader").on("change", function() {
        let val = $("#item" + i.toString() + "-shader").val();
        userConfig["item"][i - 1]["shader"] = val;
    });
}

// model
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-model").on("change", function() {
        let val = $("#item" + i.toString() + "-model").val();
        userConfig["item"][i - 1]["model"] = val;
        loadModel(val);
    });
}

// scale
for(let i = 1; i <= 3; i++){
    ['x', 'y', 'z'].forEach((c) => {
        $("#item" + i.toString() + "-scale-" + c).on("change", function() {
            let valx = parseFloat($("#item" + i.toString() + "-scale-x").val());
            let valy = parseFloat($("#item" + i.toString() + "-scale-y").val());
            let valz = parseFloat($("#item" + i.toString() + "-scale-z").val());
            if(valx >= 0 && valy >= 0 && valz >= 0){
                userConfig["item"][i - 1]["scale"] = [valx, valy, valz];
            }
        });
    })
}

// shear
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-shear").on("change", function() {
        let val = parseInt($("#item" + i.toString() + "-shear").val());
        if(val >= 0 && val <= 180){
            userConfig["item"][i - 1]["shear"] = val;
        }
    });
}

// rotate
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-rotate, #item" + i.toString() + "-autorotate").on("change", function() {
        let degree = parseInt($("#item" + i.toString() + "-rotate").val());
        let autorotate = $("#item" + i.toString() + "-autorotate").is(":checked");
        $("#item" + i.toString() + "-rotate-unit").text(autorotate ? '° / sec' : '°');
        userConfig["item"][i - 1]["rotate"]["degree"] = degree;
        userConfig["item"][i - 1]["rotate"]["autorotate"] = autorotate;
        if(autorotate){
            userConfig["item"][i - 1]["rotate"]["lastTime"] = new Date().getTime();
            userConfig["item"][i - 1]["rotate"]["lastAngle"] = degree;
        }
    });
}

// rotate direction
for(let i = 1; i <= 3; i++){
    ['x', 'y', 'z'].forEach((c) => {
        $("#item" + i.toString() + "-rotate-direction-" + c).on("change", function() {
            let valx = $("#item" + i.toString() + "-rotate-direction-x").is(":checked");
            let valy = $("#item" + i.toString() + "-rotate-direction-y").is(":checked");
            let valz = $("#item" + i.toString() + "-rotate-direction-z").is(":checked");
            let dir = [];
            if(valx){
                dir = [1, 0, 0];
            }
            if(valy){
                dir = [0, 1, 0]
            }
            if(valz){
                dir = [0, 0, 1]
            }
            userConfig["item"][i - 1]["rotate"]["direction"] = dir;
        });
    })
}

// location
for(let i = 1; i <= 3; i++){
    ['x', 'y', 'z'].forEach((c) => {
        $("#item" + i.toString() + "-location-" + c).on("change", function() {
            let valx = parseFloat($("#item" + i.toString() + "-location-x").val());
            let valy = parseFloat($("#item" + i.toString() + "-location-y").val());
            let valz = parseFloat($("#item" + i.toString() + "-location-z").val());
            userConfig["item"][i - 1]["location"] = [valx, valy, valz];
        });
    })
}

/******* CONSTANT *******/
for(let i = 1; i <= 3; i++){
    ['Ka', 'Kd', 'Ks', 'Shininess'].forEach((c) => {
        $("#item" + i.toString() + "-constant-" + c).on("change", function() {
            let val = parseFloat($("#item" + i.toString() + "-constant-" + c).val());
            if(val >= 0){
                userConfig["item"][i - 1]["constant"][c] = val;
            }
        });
    })
}

/******* LIGHT *******/

// light position
for(let i = 1; i <= 3; i++){
    ['x', 'y', 'z'].forEach((c) => {
        $("#light" + i.toString() + "-position-" + c).on("change", function() {
            let valx = parseFloat($("#light" + i.toString() + "-position-x").val());
            let valy = parseFloat($("#light" + i.toString() + "-position-y").val());
            let valz = parseFloat($("#light" + i.toString() + "-position-z").val());
            userConfig["light-position"][i - 1] = [valx, valy, valz];
        });
    })
}

// light color
for(let i = 1; i <= 3; i++){
    initColorPicker('colorCanvas' + i.toString(), 'light' + i.toString() + '-color');
    $("#light" + i.toString() + "-color, #light" + i.toString() + "-brightness").on("change", function() {
        let val = $("#light" + i.toString() + "-color").val();
        let brightness = logslider(parseInt($("#light" + i.toString() + "-brightness").val()));
        if(val.split(',').length == 3){
            let square_sum =  val.split(',').reduce((a, num) => a + ((parseFloat(num) / 256) ** 2), 0);
            userConfig["light-color"][i - 1] = val.split(',').map((v) => parseFloat(v) / 256 / square_sum * brightness);
            $("#light" + i.toString() + "-color-indicator")
                .css("background-color", "rgb(" + val + ")")
                /*.css("color", "rgb(" + val.split(',').map((v) => 255 - v).join(',') + ")")
                .text("rgb(" + val + ")")*/;
        }
        /*$("#colorCanvas" + i.toString()).css("display", "none");
        $("#light" + i.toString() + "-color").css("display", "none");*/
    });
    $("#light" + i.toString() + "-color-indicator").on("click", function() {
        $("#colorCanvas" + i.toString()).toggle();
        $("#light" + i.toString() + "-color").toggle();
    })
}

function changeColor(id, offset){
    let now = new Date().getTime();
    let rgb = HSVtoRGB(((now + offset) % 1860) / 1860, 0.8, 0.8);
    $('#light' + id + '-color').val(rgb.r.toString() + ',' + rgb.g.toString() + ',' + rgb.b.toString())

    $("#light" + id + "-brightness").val(40);

    document.getElementById("light" + id + "-color").dispatchEvent(new Event('change'));
}

/******* RESET FORM *******/
// shader
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-shader").val(userConfig["item"][i - 1]["shader"]);
}

// model
for(let i = 1; i <= 3; i++){
    let val = $("#item" + i.toString() + "-model").val(userConfig["item"][i - 1]["model"]);
    //console.warn(val)
}

// scale
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-scale-x").val(userConfig["item"][i - 1]["scale"][0]);
    $("#item" + i.toString() + "-scale-y").val(userConfig["item"][i - 1]["scale"][1]);
    $("#item" + i.toString() + "-scale-z").val(userConfig["item"][i - 1]["scale"][2]);
}

// shear
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-shear").val(userConfig["item"][i - 1]["shear"]);
}

// rotate
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-rotate").val(userConfig["item"][i - 1]["rotate"]["degree"]);
}

// location
for(let i = 1; i <= 3; i++){
    $("#item" + i.toString() + "-location-x").val(userConfig["item"][i - 1]["location"][0]);
    $("#item" + i.toString() + "-location-y").val(userConfig["item"][i - 1]["location"][1]);
    $("#item" + i.toString() + "-location-z").val(userConfig["item"][i - 1]["location"][2]);
}

// constant
for(let i = 1; i <= 3; i++){
    ['Ka', 'Kd', 'Ks', 'Shininess'].forEach((c) => {
        $("#item" + i.toString() + "-constant-" + c).val(userConfig["item"][i - 1]["constant"][c]);
    })
}

// Light position
for(let i = 1; i <= 3; i++){
    $("#light" + i.toString() + "-position-x").val(userConfig["light-position"][i - 1][0]);
    $("#light" + i.toString() + "-position-y").val(userConfig["light-position"][i - 1][1]);
    $("#light" + i.toString() + "-position-z").val(userConfig["light-position"][i - 1][2]);
}

// Light color
$("#light1-color").val("255, 0, 0");
$("#light2-color").val("0, 255, 0");
$("#light3-color").val("0, 0, 255");

for(let i = 1; i <= 3; i++){
    
    document.getElementById("light" + i.toString() + "-color").dispatchEvent(new Event('change'));

    $("#light" + i.toString() + "-brightness").val("30");    
}

function initColorPicker(id, inputid) {
    var canvas = document.getElementById(id);
    var canvasContext = canvas.getContext('2d');
  
    let gradient = canvas.getContext('2d').createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#ff0000')
    gradient.addColorStop(1 / 6, '#ffff00')
    gradient.addColorStop((1 / 6) * 2, '#00ff00')
    gradient.addColorStop((1 / 6) * 3, '#00ffff')
    gradient.addColorStop((1 / 6) * 4, '#0000ff')
    gradient.addColorStop((1 / 6) * 5, '#ff00ff')
    gradient.addColorStop(1, '#ff0000')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
    gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
    gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    canvas.getContext('2d').fillStyle = gradient
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height)
  
  
    canvas.onclick = function(e) {
        var imgData = canvasContext.getImageData((e.offsetX / canvas.clientWidth) * canvas.width, (e.offsetY / canvas.clientHeight) * canvas.height, 1, 1)
        var rgba = imgData.data;
        var color = "" + rgba[0] + ", " + rgba[1] + ", " + rgba[2];
        $('#' + inputid).val(color);
        document.getElementById(inputid).dispatchEvent(new Event('change'));
    }
}