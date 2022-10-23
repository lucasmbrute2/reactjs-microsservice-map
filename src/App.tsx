import { Mapping } from "./components/Mapping";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <Mapping />
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
