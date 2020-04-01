import React, { Component } from 'react'
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import BackgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'
import { server, showError, showSuccess } from '../common'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'


export default class Auth extends Component{

    state = {
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        stageNew: false
    }

    signInOrSignUp = () => {
        if(this.state.stageNew) {
            this.signup()
        }else {
            this.signin()
        }
    }

    signup = async () => {
        const { name, email, password, confirmPassword } = this.state

        try {
            await axios.post(`${server}/signup`, {
                name, email, password, confirmPassword
            })

            showSuccess('Usuário cadastrado com sucesso!')
            this.setState({ stageNew: false })
        } catch(err) {
            showError(err)
        }
    }

    signin = async () => {
        const { name, email, password, confirmPassword } = this.state
        try {
            const res = await axios.post(`${server}/signin`, {
                email, password
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)
        } catch(err) {
            showError(err)
        }
    }

    render(){

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground source={BackgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>{this.state.stageNew ? 'Crie sua Conta' : 'Informe Seus Dados'}</Text>
                    {this.state.stageNew && <AuthInput icon='user' onChangeText={name => this.setState({ name })} placeholder='Nome' value={this.state.name} style={styles.input}></AuthInput>}
                    <AuthInput icon='at' onChangeText={email => this.setState({ email })} placeholder='E-mail' value={this.state.email} style={styles.input}></AuthInput>
                    <AuthInput icon='lock' onChangeText={password => this.setState({ password })} secureTextEntry={true} placeholder='Senha' value={this.state.password} style={styles.input}></AuthInput>
                    {this.state.stageNew && <AuthInput icon='asterisk' secureTextEntry={true} onChangeText={confirmPassword => this.setState({ confirmPassword })} placeholder='Confirme Sua Senha' value={this.state.confirmPassword} style={styles.input}></AuthInput>}
                    <TouchableOpacity disabled={!validForm} onPress={this.signInOrSignUp}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: 'gray' }]}>
                            <Text style={styles.buttonText}>{this.state.stageNew ? 'Registrar' : 'Entrar'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.setState({ stageNew: !this.state.stageNew })} style={{ padding: 10 }}>
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Já possui uma conta?' : 'Ainda não possui uma conta?'}
                        </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 10
    }
})