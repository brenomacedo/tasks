import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://192.168.56.1:3000'

const showError = err => {
    if(err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um prolema!', `Mensagem: ${err.response.data}`)
    }else {
        Alert.alert('Ocorreu um erro inesperado, tente novamente.')
    }
}

const showSuccess = msg => {
    Alert.alert('Sucesso', msg)
}

export {
    server,
    showError,
    showSuccess
}