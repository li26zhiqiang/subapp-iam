export default class Gverify {
    constructor(options) {
        this.options = {
            id: '', // 容器id
            canvasId: 'verifycanvas', // canvas的id
            width: '120', // 默认canvas宽度
            height: '40', // 默认canvas高度
            // 图形验证码，默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            type: 'blend',
            code: '',
            ...options
        };

        const nuuarr = '0,1,2,3,4,5,6,7,8,9'.split(',');
        const letterstr =
            'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(
                ','
            );
        this.numLet = {
            blend: [...nuuarr, ...letterstr],
            number: nuuarr,
            letter: letterstr
        };

        this._init();
        this.refresh();
    }

    /** 生成验证码* */
    refresh() {
        this.options.code = '';
        const canvas = document.getElementById(this.options.canvasId);
        const ctx = canvas.getContext ? canvas.getContext('2d') : null;

        if (!ctx) {
            return;
        }

        ctx.textBaseline = 'middle';
        ctx.fillStyle = this._randomcolor(180, 240);
        ctx.fillRect(0, 0, this.options.width, this.options.height);
        const txtarr = this.numLet[this.options.type];
        const showCode = [
            txtarr[this._randomnum(0, txtarr.length)],
            txtarr[this._randomnum(0, txtarr.length)],
            txtarr[this._randomnum(0, txtarr.length)],
            txtarr[this._randomnum(0, txtarr.length)]
        ];

        showCode.forEach((item, index) => {
            ctx.font = this._randomnum(this.options.height / 2, this.options.height) + 'px simhei'; // 随机生成字体大小
            ctx.fillStyle = this._randomcolor(50, 160); // 随机生成字体颜色
            ctx.shadowOffsetX = this._randomnum(-3, 3);
            ctx.shadowOffsetY = this._randomnum(-3, 3);
            ctx.shadowBlur = this._randomnum(-3, 3);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';

            const y = this.options.height / 2;
            const x = (this.options.width / 5) * index + 1;
            const deg = this._randomnum(-30, 30);

            /** 设置旋转角度和坐标原点* */
            ctx.translate(x, y);
            ctx.rotate((deg * Math.pi) / 180);
            this.options.code += item;
            ctx.fillText(item, 0, 0);

            /** 恢复旋转角度和坐标原点* */
            ctx.rotate((-deg * Math.pi) / 180);
            ctx.translate(-x, -y);
        });

        /** 绘制干扰线* */
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = this._randomcolor(40, 180);
            ctx.beginPath();
            ctx.moveTo(this._randomnum(0, this.options.width), this._randomnum(0, this.options.height));
            ctx.lineTo(this._randomnum(0, this.options.width), this._randomnum(0, this.options.height));
            ctx.stroke();
        }

        /** 绘制干扰点* */
        for (let i = 0; i < this.options.width / 4; i++) {
            ctx.fillStyle = this._randomcolor(0, 255);
            ctx.beginPath();
            ctx.arc(this._randomnum(0, this.options.width), this._randomnum(0, this.options.height), 1, 0, 2 * Math.pi);
            ctx.fill();
        }
    }

    /** 验证验证码* */
    validate(code) {
        return code.tolowercase() === this.options.code.tolowercase();
    }

    /** 初始化方法* */
    _init() {
        const con = document.getElementById(this.options.id);
        const canvas = document.createElement('canvas');

        this.options.width = con.offsetwidth > 0 ? con.offsetwidth : '100';
        this.options.height = con.offsetheight > 0 ? con.offsetheight : '40';

        canvas.id = this.options.canvasId;
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        canvas.style.cursor = 'pointer';
        canvas.innerHtml = '您的浏览器版本不支持canvas';
        con.appendChild(canvas);
    }

    /** 生成一个随机数* */
    _randomnum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /** 生成一个随机色* */
    _randomcolor(min, max) {
        const r = this._randomnum(min, max);
        const g = this._randomnum(min, max);
        const b = this._randomnum(min, max);

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
}
