import { createTheme } from "@mui/material";
import { PaletteOptions } from "@mui/material/styles/createPalette";

const palette: PaletteOptions = {
    primary: {
        main: "#FFCD00",
        contrastText: "#242526",
    },
    background: {
        default: "#242526",
    },
};

export const theme = createTheme({
    palette,
});
