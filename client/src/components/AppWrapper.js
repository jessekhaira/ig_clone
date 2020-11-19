import App from './App';
import {Provider} from 'react-redux';
import {reduxStore} from '../redux/createStore';

function AppWrapper() {
    return(
        <Provider store = {reduxStore}>
            <App /> 
        </Provider>
    )
}

export default AppWrapper;