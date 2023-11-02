<template>
    <div>{{ timeStr }}</div>
</template>

<script>
export default {
    props: {
        countdownTime: {
            type: Number, // 倒计时开始时间，值为时间戳
            required: true
        },
        timeDuration: {
            type: Number, // 倒计时时长，单位为分钟
            required: false,
            default: 120
        }
    },
    data() {
        return {
            countdownInterval: null,
            timeStr: ''
        };
    },
    mounted() {
        this.startCountdown();
    },
    unmounted() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    },
    methods: {
        startCountdown() {
            this.countdownInterval = setInterval(() => {
                const currentTime = new Date().getTime();
                const timeDifference = this.countdownTime + this.timeDuration * 60 * 1000 - currentTime;

                if (timeDifference > 0) {
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                    this.timeStr = `还剩${days}天${hours}小时${minutes}分${seconds}秒`;
                } else {
                    clearInterval(this.countdownInterval);
                }
            }, 1000);
        }
    }
};
</script>
