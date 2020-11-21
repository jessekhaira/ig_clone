import App from './App';
import {Provider} from 'react-redux';
import {reduxStore} from '../redux/createStore';

/**
 * This function wraps the React app with Provider from react redux in order to provide
 * the redux store to the application. 
 */
function AppWrapper() {
    return(
        <Provider store = {reduxStore}>
            <App /> 
        </Provider>
    )
}

export default AppWrapper;