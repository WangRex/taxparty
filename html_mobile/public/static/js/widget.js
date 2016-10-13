app.fileupImg = (function () {

    //获取图片方向信息
    var getOrientation = function (file, callback) {
        if (!navigator.userAgent.match(/iphone/i)) {
            callback(-1);
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            var length = view.byteLength,
                offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                } else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    };

    //图片旋转
    var rotateImg = function (img, direction, canvas, ctx) {
        var height = img.height;
        var width = img.width;
        if (!navigator.userAgent.match(/iphone/i)) {
            direction = -1;
        }
        switch (direction) {
        case 2:
            // horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
            break;
        case 3:
            // 180° rotate left
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            ctx.drawImage(img, 0, 0);
            break;
        case 4:
            // vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0);
            break;
        case 5:
            // vertical flip + 90 rotate right
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0);
            break;
        case 6:
            // 90° rotate right
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            ctx.drawImage(img, 0, 0);
            break;
        case 7:
            // horizontal flip + 90 rotate right
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
            break;
        case 8:
            // 90° rotate left
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            ctx.drawImage(img, 0, 0);
            break;
        default:
            ctx.drawImage(img, 0, 0, width, height);
            break;
        }
    };

    //图片压缩
    var compressImage = function (img, direction) {

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        var initSize = img.src.length;
        var width = img.width;
        var height = img.height;

        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        var ratio;
        if ((ratio = width * height / 4000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }

        canvas.width = width;
        canvas.height = height;

        rotateImg(img, direction, canvas, ctx);

        //进行最小压缩
        var ndata = canvas.toDataURL("image/jpeg", 0.5);

        console.log("压缩前：" + initSize);
        console.log("压缩后：" + ndata.length);
        console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        return ndata;
    };

    return {
        getOrientation: getOrientation,
        rotateImg: rotateImg,
        compressImage: compressImage
    }
})()