import React from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, TouchableHighlight, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import moment from 'moment'
import 'moment/locale/pt-br'

import Task from '../components/Task'
import commonStyles from '../commonStyles'
import AddTask from './AddTask'

import Ripple from 'react-native-material-ripple'

import AsyncStorage from "@react-native-community/async-storage"

import axios from 'axios'
import { server, showError } from '../common'


const initialState = {
    tasks: [],
    showDoneTasks: true,
    visibleTasks: [],
    showAddTask: false
}

export default class Box extends React.Component{

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('taskState')
        const { showDoneTasks } = JSON.parse(stateString) || initialState
        this.setState({showDoneTasks}, this.filterTasks)
        this.loadTasks()
    }

    state = {
        ...initialState
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({
                tasks: res.data
            }, this.filterTasks)
        } catch(e) {
            showError(e)
        }
    }

    toggleFilter = () => {
        this.setState({
            showDoneTasks: !this.state.showDoneTasks
        }, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
           const pending = task => task.doneAt === null
           visibleTasks = this.state.tasks.filter(pending) 
        }

        this.setState({
            visibleTasks
        })

        AsyncStorage.setItem('taskState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await this.loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    addTask = async newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'A descrição não foi informada')
            return
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })
        } catch (error) {
            showError(error)
        }

       

        this.setState({
            showAddTask: false
        }, this.loadTasks)
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead){
            case 0:
                return todayImage
            case 1:
                return tomorrowImage
            case 7:
                return weekImage
            default:
                return monthImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead){
            case 0:
                return commonStyles.colors.today
            case 1:
                return commonStyles.colors.tomorrow
            case 7:
                return commonStyles.colors.week
            default:
                return commonStyles.colors.month
        }
    }

    render(){
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <AddTask onSave={this.addTask} onCancel={() => this.setState({ showAddTask: false })} isVisible={this.state.showAddTask}></AddTask>
                <ImageBackground style={styles.background} source={this.getImage()}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon size={20} color={commonStyles.colors.secondary} name={'bars'}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon size={20} color={commonStyles.colors.secondary} name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    
                    <FlatList renderItem={({item}) => (<Task onDelete={this.deleteTask} toggleTask={this.toggleTask} {...item}></Task>)} keyExtractor={item => `${item.id}`} data={this.state.visibleTasks} ></FlatList>
                </View>
                <Ripple rippleColor='white' rippleContainerBorderRadius={50} onPress={() => this.setState({ showAddTask: true })} style={[styles.addButton, { backgroundColor: this.getColor() }]}>
                    <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
                </Ripple>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color: commonStyles.colors.secondary,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
})