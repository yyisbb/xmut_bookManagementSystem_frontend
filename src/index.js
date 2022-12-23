import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'
import {PersistGate} from "redux-persist/integration/react";
import {HelmetProvider} from "react-helmet-async";
import {store, persist} from './redux'

//
import App from './App';
import * as serviceWorker from './serviceWorker';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

export const children = <Provider store={store}>
    <HelmetProvider>
        <PersistGate persistor={persist}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </PersistGate>
    </HelmetProvider>
</Provider>;
root.render(
    children,
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();
