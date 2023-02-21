async initBgImgAndFonts(url: string = "", fontFamily: string = "") {
    if (url === "") {
        return "图片地址不能为空";
    }
    try {
        registerFont(path.join(__dirname, `../public/fonts/${fontFamily}.ttf`), {
        family: "fonts"
        });
        // 加载背景图
        const img: any = await this.loadImg(url);
        // 创建canvas画布
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        // 将背景图嵌入画布中
        ctx.drawImage(img, 0, 0, img.width, img.height);
        return {
        ctx,
        canvas
        };
    } catch (error) {
        return error;
    }
} 
