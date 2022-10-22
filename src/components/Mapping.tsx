import { Button, Grid, MenuItem, Select } from "@mui/material";
import { Loader } from "google-maps";
import { useState, useEffect, FormEvent, useCallback, useRef } from "react";
import { getCurrentPosition } from "../util/geolocation";
import { Route } from "../util/models";

type Props = {};

const API_URL = process.env.REACT_APP_API_URL;
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

export const Mapping = (props: Props) => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeIdSelected, setRouteIdSelected] = useState<string>("");
    const mapRef = useRef<google.maps.Map>();

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
            mapRef.current = new google.maps.Map(divMap, {
                zoom: 15,
                center: position,
            });
        })();
    }, []);

    const startRoute = useCallback(
        (event: FormEvent) => {
            event.preventDefault();
            console.log(routeIdSelected);
        },
        [routeIdSelected]
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
