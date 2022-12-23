// routes
import Router from './routers/routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import {StyledChart} from './components/chart';
import AuthRouter from "./routers/authRouter";

// ----------------------------------------------------------------------

export default function App() {
    return (
        <ThemeProvider>
            <ScrollToTop/>
            <StyledChart/>
            <AuthRouter>
                <Router/>
            </AuthRouter>
        </ThemeProvider>
    );
}
