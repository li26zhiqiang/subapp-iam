export default {
    api: {
        operationSuccess: 'Operation Success',
        operationFailed: 'Operation failed',
        errorTip: 'Error Tip',
        successTip: 'Success Tip',
        errorMessage: 'The operation failed, the system is abnormal!',
        timeoutMessage: 'Login timed out, please log in again!',
        apiTimeoutMessage: 'The interface request timed out, please refresh the page and try again!',
        apiRequestFailed: 'The interface request failed, please try again later!',
        networkException: 'network anomaly',
        networkExceptionMsg: 'Please check if your network connection is normal! The network is abnormal',

        errMsg401: 'The user does not have permission (token, user name, password error)!',
        errMsg403: 'The user is authorized, but access is forbidden!',
        errMsg404: 'Network request error, the resource was not found!',
        errMsg405: 'Network request error, request method not allowed!',
        errMsg408: 'Network request timed out!',
        errMsg500: 'Server error, please contact the administrator!',
        errMsg501: 'The network is not implemented!',
        errMsg502: 'Network Error!',
        errMsg503: 'The service is unavailable, the server is temporarily overloaded or maintained!',
        errMsg504: 'Network timeout!',
        errMsg505: 'The http version does not support the request!'
    },
    app: {
        logoutTip: 'Reminder',
        logoutMessage: 'Confirm to exit the system?',
        menuLoading: 'Menu loading...'
    },
    errorLog: {
        tableTitle: 'Error log list',
        tableColumnType: 'Type',
        tableColumnDate: 'Time',
        tableColumnFile: 'File',
        tableColumnMsg: 'Error message',
        tableColumnStackMsg: 'Stack info',

        tableActionDesc: 'Details',

        modalTitle: 'Error details',

        fireVueError: 'Fire vue error',
        fireResourceError: 'Fire resource error',
        fireAjaxError: 'Fire ajax error',

        enableMessage: 'Only effective when useErrorHandle=true in `/src/settings/projectSetting.ts`.'
    },
    exception: {
        backLogin: 'Back Login',
        backHome: 'Back Home',
        subTitle403: "Sorry, you don't have access to this page.",
        subTitle404: 'Sorry, the page you visited does not exist.',
        subTitle500: 'Sorry, the server is reporting an error.',
        noDataTitle: 'No data on the current page.',
        networkErrorTitle: 'Network Error',
        networkErrorSubTitle: 'Sorry，Your network connection has been disconnected, please check your network!'
    },
    lock: {
        unlock: 'Click to unlock',
        alert: 'Lock screen password error',
        backToLogin: 'Back to login',
        entry: 'Enter the system',
        placeholder: 'Please enter the lock screen password or user password'
    },
    login: {
        backSignIn: 'Back sign in',
        mobileSignInFormTitle: 'Mobile sign in',
        passwordSignInFormTitle: 'Password sign in',
        qrSignInFormTitle: 'Qr code sign in',
        signInFormTitle: 'Sign in',
        signUpFormTitle: 'Sign up',
        forgetFormTitle: 'Reset password',

        signInTitle: 'TuoYun - the preferred AI platform for domestic users',
        signInDesc:
            'We offer internationally leading AI tools such as chat GPT and MidJourney, allowing you to effortlessly make money without working overtime!',
        policy: 'I have read and agree to the',
        policy1: ' User Agreement ',
        policy2: ' Privacy Terms ',
        policy3: 'and',
        scanSign: `scanning the code to complete the login`,

        loginButton: 'Sign in',
        registerButton: 'Sign up',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget Password',
        otherSignIn: 'Sign in with',

        // notify
        loginSuccessTitle: 'Login successful',
        loginSuccessDesc: 'Welcome back',
        registerSuccessTitle: 'Registration successful, please log in again!',
        resetPSWSuccessTitle: 'Password reset successful, please log in again!',

        // placeholder
        accountPlaceholder: 'Please input username',
        passwordPlaceholder: 'Please input password',
        smsPlaceholder: 'Please input sms code',
        mobilePlaceholder: 'Please input mobile',
        policyPlaceholder: 'Register after checking',
        diffPwd: 'The two passwords are inconsistent',
        emailPlaceholder: 'Please input email',

        accountEmailValidateMsg: 'The account or email you entered is incorrect',
        accountEmailPhoneValidateMsg: 'The account, email, or phone you entered is incorrect',
        accountValidateMsg:
            'Please enter 5-20 characters, which can only contain numbers, letters, and underscores, and start with a letter.',
        passwordValidateMsg: 'Please enter 8-20 characters and must include letters, numbers, and special characters.',
        mobileValidateMsg: 'The mobile number you entered is incorrect',
        emailValidateMsg: 'The email you entered is incorrect',
        smsValidateMsg: 'Please enter a number',

        account: 'User Name / Email',
        resetAccount: 'User Name / Email / Phone',
        userName: 'User Name',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        email: 'Email',
        smsCode: 'SMS code',
        mobile: 'Mobile',
        verifyCode: 'Verify Code'
    }
};
