import { Link, useNavigate } from "react-router-dom";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import GlobalSearch from "@/components/others/GlobalSearch";
import RenderIcon from "@/icons/RenderIcon";
import { getAuthTokenForDeliveryManagementMap } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { useQuery } from "@tanstack/react-query";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { Card } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";
import DeleteGeofence from "@/models/configure/geofence/DeleteGeofence";
import ShowSpinner from "@/components/others/ShowSpinner";

const AllGeofence = () => {
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const mapContainerRef = useRef(null);

  const navigate = useNavigate();

  const mapplsClassObject = new mappls();

  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  const { data: geofences, isLoading: geofenceLoading } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const initializeMap = async () => {
    const mapProps = {
      center: [8.528818999999999, 76.94310683333333],
      traffic: true,
      zoom: 12,
      geolocation: true,
      clickableIcons: true,
    };

    mapplsClassObject.initialize(`${authToken}`, async () => {
      if (mapContainerRef.current) {
        const map = await mapplsClassObject.Map({
          id: "map",
          properties: mapProps,
        });

        if (map && typeof map.on === "function") {
          map.on("load", async () => {
            setMapObject(map);
            setIsMapLoaded(true);
          });
        } else {
          console.error(
            "mapObject.on is not a function or mapObject is not defined"
          );
        }
      } else {
        console.error("Map container not found");
      }
    });
  };

  const showModalDeleteTask = (id) => {
    setSelectedId(id);
    setModal(true);
  };

  const GeoJsonComponent = ({ map }) => {
    const geoJsonRef = useRef(null);
    const geoJSON = {
      type: "FeatureCollection",
      features: geofences?.map((geofence) => ({
        type: "Feature",
        properties: {
          class_id: geofence?.id,
          name: geofence?.name,
          stroke: geofence?.color,
          "stroke-opacity": 0.4,
          "stroke-width": 3,
          fill: geofence?.color,
          "fill-opacity": 0.4,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            geofence?.coordinates?.map((coord) => [coord[0], coord[1]]),
          ],
        },
      })),
    };

    useEffect(() => {
      if (geoJsonRef.current) {
        mapplsClassObject.removeLayer({ map: map, layer: geoJsonRef.current });
      }
      geoJsonRef.current = mapplsClassObject.addGeoJson({
        map: map,
        data: geoJSON,
        overlap: false,
        fitbounds: true,
        preserveViewport: false,
      });
    }, [map]); // Ensure this only runs when `map` or `geoJSON` change
  };

  useEffect(() => {
    if (geofences?.length >= 0) {
      initializeMap();
    }
  }, [geofences]);

  const isLoading = geofenceLoading;

  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <div className="flex items-center justify-between mx-10">
          <h1 className="font-bold text-lg">Geofence</h1>
          <Link
            to="/configure/geofence/add"
            className="bg-teal-700 text-white rounded-md flex items-center px-4 sm:px-9 py-2 "
          >
            <RenderIcon iconName="PlusIcon" size={16} loading={6} /> Add
            Geofence
          </Link>
        </div>
        <p className=" text-gray-500  mx-10 mt-5">
          A geofence is a virtual perimeter for a real-world geographic area.
          Different geofences can be assigned to a single city.
        </p>

        {/* Adjusted flex layout for small screens */}
        <div className="flex flex-col sm:flex-row sm:justify-between mt-10 gap-5 mx-10">
          {/* Map section */}
          <div className="w-full sm:w-3/4 bg-white h-[520px] flex items-center justify-center relative sm:mb-0 mb-5">
            <div
              id="map"
              ref={mapContainerRef}
              style={{
                width: "99%",
                height: "510px",
                display: "inline-block",
                position: "relative",
              }}
            >
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={initializeMap}
                    className="m-2 p-3 bg-teal-600 text-[15px] font-bold text-white"
                  >
                    Initialize Map
                  </Button>
                </div>
              )}
              {isMapLoaded && geofences?.length >= 0 && (
                <GeoJsonComponent map={mapObject} />
              )}
            </div>
          </div>

          {/* Geofences Data Section */}
          <div className="w-full sm:w-1/3 max-h-[32rem] overflow-y-auto">
            {isLoading ? (
              <ShowSpinner />
            ) : geofences?.length === 0 ? (
              <p className="text-center mt-[20px]">No geofences Found.</p>
            ) : (
              geofences?.map((data) => (
                <Card.Root
                  className="bg-white mt-5 flex hover:bg-teal-800 hover:text-white"
                  key={data?._id}
                >
                  <div className="flex mx-5">
                    <div className="flex items-center">
                      <p
                        className="rounded-full p-4 text-white"
                        style={{ backgroundColor: data?.color }}
                      ></p>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <Card.Body>
                        <Card.Title className="text-[18px] font-semibold">
                          {data?.name}
                        </Card.Title>
                        <Card.Title>{data?.description}</Card.Title>
                      </Card.Body>
                    </div>
                    <div className="flex items-center">
                      <MenuRoot isLazy>
                        <MenuTrigger>
                          <RenderIcon
                            iconName="ThreeDots"
                            size={26}
                            loading={16}
                          />
                        </MenuTrigger>
                        <MenuContent>
                          <Link
                            className="text-black "
                            to={`/configure/geofence/${data?._id}`}
                          >
                            <MenuItem>Edit</MenuItem>
                          </Link>
                          <MenuItem
                            className="text-black"
                            onClick={() => showModalDeleteTask(data._id)}
                          >
                            Delete
                          </MenuItem>
                        </MenuContent>
                      </MenuRoot>
                    </div>
                  </div>
                </Card.Root>
              ))
            )}
          </div>
        </div>
      </div>

      <DeleteGeofence
        isOpen={modal}
        onClose={() => setModal(false)}
        geofenceId={selectedId}
      />
    </>
  );
};

export default AllGeofence;
