import { ref, onBeforeMount } from 'vue';

function useMobile() {
    const isMobile = ref(false);

    onBeforeMount(() => {
        let flag = navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|SymbianOS)/i
        );

        isMobile.value = !!flag;

        console.log('isMobile.value=', isMobile.value);
    });

    return isMobile;
}

export default useMobile;
