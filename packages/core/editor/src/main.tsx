import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import {AntdThemeProvider} from "common";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AntdThemeProvider>
        <App/>
    </AntdThemeProvider>
)
