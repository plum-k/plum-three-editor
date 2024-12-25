export  function getEnv() {
    const env = {
        nodeEnv: import.meta.env.MODE,
        apiUrl: import.meta.env.VITE_APP_URL
    }
    return {
        ...env
    } as const
}
