export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const actionTypes = {
    login: 'login',
    resetPassword: 'reset-password',
    signUp: 'sign-up',
}

export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

export const websiteAddress = "https://cosmo-market.ro"
