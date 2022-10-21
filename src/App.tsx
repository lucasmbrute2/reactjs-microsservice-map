import { Mapping } from "./components/Mapping";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Mapping />
        </ThemeProvider>
    );
}

export default App;
