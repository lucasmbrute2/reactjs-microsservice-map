import { Button, Grid, MenuItem, Select } from "@mui/material";
import { Loader } from "google-maps";
import {
    useState,
    useEffect,
    FormEvent,
    useCallback,
    useRef,
    FunctionComponent,
} from "react";
import { getCurrentPosition } from "../util/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/map";
import { Route } from "../util/models";
import { sample, shuffle } from "lodash";
import { RouteExistsError } from "./errors/route-exists.error";
import { useSnackbar } from "notistack";

const API_URL = process.env.REACT_APP_API_URL;
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

const colors = [
    "#b71c1c",
    "#4a148c",
    "#2e7d32",
    "#e65100",
    "#2962ff",
    "#c2185b",
    "#FFCD00",
    "#3e2723",
    "#03a9f4",
    "#827717",
];

export const Mapping: FunctionComponent = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeIdSelected, setRouteIdSelected] = useState<string>("");
    const mapRef = useRef<Map>();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function getRoutes() {
            const data = await fetch(API_URL as string);
            const response = await data.json();
            setRoutes(response);
        }
        getRoutes();
    }, []);

    useEffect(() => {
        (async () => {
            const [_, position] = await Promise.all([
                googleMapsLoader.load(),
                getCurrentPosition({ enableHighAccuracy: true }),
            ]);

            const divMap = document.getElementById("map") as HTMLElement;
            mapRef.current = new Map(divMap, {
                zoom: 15,
                center: position,
            });
        })();
    }, []);

    const startRoute = useCallback(
        (event: FormEvent) => {
            event.preventDefault();
            const route = routes.find((r) => r._id === routeIdSelected);
            const color = sample(shuffle(colors)) as string;
            try {
                mapRef.current?.addRoute(routeIdSelected, {
                    currentMarketOptions: {
                        position: route?.startPosition,
                        icon: makeCarIcon(color),
                    },
                    endMarkerOptions: {
                        position: route?.endPosition,
                        icon: makeMarkerIcon(color),
                    },
                });
            } catch (error) {
                if (error instanceof RouteExistsError) {
                    enqueueSnackbar(
                        `${route?.title} já adicionado, espere finalizar.`,
                        {
                            variant: "error",
                        }
                    );
                    return;
                }

                throw error;
            }
        },
        [routeIdSelected, routes, enqueueSnackbar]
    );

    return (
        <Grid
            container
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <Grid item xs={12} sm={3}>
                <form onSubmit={startRoute}>
                    <Select
                        fullWidth
                        value={routeIdSelected}
                        onChange={(e) =>
                            setRouteIdSelected(e.target.value + "")
                        }
                    >
                        <MenuItem value="">
                            <em>Selecione uma corrida</em>
                        </MenuItem>
                        {routes.map((route, key) => (
                            <MenuItem key={key} value={route._id}>
                                {route.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button type="submit" color="primary" variant="contained">
                        Iniciar uma corrida
                    </Button>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div
                    id="map"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                ></div>
            </Grid>
        </Grid>
    );
};
