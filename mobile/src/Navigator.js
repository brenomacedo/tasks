import { createDrawerNavigator } from 'react-navigation-drawer'
import { NavigationContainer, createSwitchNavigator, createAppContainer } from 'react-navigation'
import TaskList from './screens/TaskList'
import Auth from './screens/Auth'
import React from 'react'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'
import AuthOrApp from './screens/AuthOrApp'

const menuConfig = {
    unmountInactiveRoutes : true,
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            fontWeight: 'bold',
            color: '#080',
        }
    }
}

const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <TaskList title="Hoje" daysAhead={0} {...props} />,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <TaskList title="Amanhã" daysAhead={1} {...props} />,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <TaskList title="Semana" daysAhead={7} {...props} />,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <TaskList title="Mês" daysAhead={30} {...props} />,
        navigationOptions: {
            title: 'Mês'
        }
    },
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)

const MainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    }
}

const MainNavigator = createSwitchNavigator(MainRoutes, { initialRouteName: 'AuthOrApp' })
export default createAppContainer(MainNavigator)