import RenderIcon from "@/icons/RenderIcon";
import GlobalSearch from "@/components/others/GlobalSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addGeofence, getAllGeofence } from "@/hooks/geofence/useGeofence";
import { getAuthTokenForDeliveryManagementMap } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { mappls, mappls_plugin } from "mappls-web-maps";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const PlaceSearchPlugin = ({ map }) => {
  const placeSearchRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (map && placeSearchRef.current) {
      mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
    }

    const optional_config = {
      location: [8.5892862, 76.8773566], // Center of Trivandrum
      region: "IND",
      height: 300,
      hyperLocal: true,
    };

    const callback = (data) => {
      if (data) {
        const dt = data[0];
        if (!dt) return false;
        const eloc = dt.eLoc;
        const place = `${dt.placeName}`;
        if (markerRef.current) markerRef.current.remove();
        mapplsPluginObject.pinMarker(
          {
            map: map,
            pin: eloc,
            popupHtml: place,
            popupOptions: {
              openPopup: true,
            },
            zoom: 10,
          },
          (data) => {
            markerRef.current = data;
            markerRef.current.fitbounds();
          }
        );
        markerRef.current.remove();
      }
    };
    placeSearchRef.current = mapplsPluginObject.search(
      document.getElementById("auto"),
      optional_config,
      callback
    );

    return () => {
      if (map && placeSearchRef.current) {
        mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [map]);

  return null;
};

const AddGeofence = () => {
  const [newGeofence, setNewGeofence] = useState({
    name: "",
    description: "",
    color: "#4931a0",
    coordinates: [],
  });
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);

  const navigate = useNavigate();

  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  const { data: geofences } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const handleAddGeofence = useMutation({
    mutationKey: ["add-geofence"],
    mutationFn: ({ newGeofence }) => addGeofence({ newGeofence, navigate }),
    onSuccess: (data) => {
      navigate("/configure/geofence");
      toaster.create({
        title: "Success",
        description: data.message || "Geofence added successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error.message || "Error adding geofence.",
        type: "error",
      });
    },
  });

  const handleColorChange = (e) => {
    setNewGeofence({ ...newGeofence, color: e.target.value });
  };

  const handleInputChange = (e) => {
    setNewGeofence({ ...newGeofence, [e.target.name]: e.target.value });
  };

  let drawData, geoJSON, polyArray;

  useEffect(() => {
    if (authToken) {
      const script = document.createElement("script");
      script.src = `https://apis.mappls.com/advancedmaps/api/9a632cda78b871b3a6eb69bddc470fef/map_sdk?layer=vector&v=3.0&polydraw&callback=initMap`;
      script.async = true;
      script.onload = () => console.log("Mappls script loaded successfully.");
      script.onerror = () => console.error("Error loading Mappls script.");
      document.body.appendChild(script);

      window.initMap = () => {
        const map = new window.mappls.Map("map", {
          center: [8.528818999999999, 76.94310683333333],
          zoomControl: true,
          geolocation: false,
          fullscreenControl: false,
          zoom: 12,
        });

        if (map && typeof map.on === "function") {
          map.on("load", () => {
            setMapObject(map);
            setIsMapLoaded(true);

            window.mappls.polygonDraw(
              {
                map: map,
                data: geoJSON,
              },
              function (data) {
                drawData = data;

                drawData.control(true);
                polyArray = drawData.data?.geometry.coordinates[0];

                // Wait for the DOM to load or the map to initialize
                setTimeout(() => {
                  const drawPolygonButton = document.querySelector(
                    ".mappls-gl-draw_ctrl-draw-btn.mappls-gl-draw_polygon"
                  );
                  const deleteButton = document.querySelector(
                    ".mappls-gl-draw_ctrl-draw-btn.mappls-gl-draw_trash"
                  );

                  if (drawPolygonButton) {
                    // Adjust size and add icon
                    drawPolygonButton.style.width = "40px";
                    drawPolygonButton.style.height = "40px";
                    drawPolygonButton.style.padding = "0px";
                    drawPolygonButton.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fmap%20selection.png?alt=media&token=f9084e35-d417-4211-84a3-d11220bae42b" alt="PolyDraw" style="width: 55px; height: 40px;" />`;
                  }

                  if (deleteButton) {
                    deleteButton.style.width = "40px";
                    deleteButton.style.height = "40px";
                    deleteButton.style.padding = "0px";
                    deleteButton.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fmap%20deletion.png?alt=media&token=eb4baa67-9ff6-4661-9b4b-326fd0ebeaaf" alt="Delete" style="width: 55px; height: 40px;" />`;
                  }
                }, 1000);

                const formattedCoordinates =
                  drawData?.data?.geometry?.coordinates[0].map(([lng, lat]) => [
                    lat,
                    lng,
                  ]);

                setNewGeofence((prevState) => ({
                  ...prevState,
                  coordinates: formattedCoordinates,
                }));
              }
            );
          });
        } else {
          console.error("Map container not found");
        }
      };
    }
  }, [authToken]);

  const GeoJsonComponent = ({ map }) => {
    const geoJsonRef = useRef(null);
    const geoJSON = {
      type: "FeatureCollection",
      features: geofences.map((geofence) => ({
        type: "Feature",
        properties: {
          class_id: geofence.id,
          name: geofence.name,
          stroke: geofence.color,
          "stroke-opacity": 0.4,
          "stroke-width": 3,
          fill: geofence.color,
          "fill-opacity": 0.4,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            geofence.coordinates.map((coord) => [coord[0], coord[1]]),
          ],
        },
      })),
    };

    useEffect(() => {
      if (geoJsonRef.current) {
        window.mappls.removeLayer({ map: map, layer: geoJsonRef.current });
      }
      geoJsonRef.current = window.mappls.addGeoJson({
        map: map,
        data: geoJSON,
        overlap: false,
        fitbounds: true,
        preserveViewport: false,
      });
    }, [map]); // Ensure this only runs when `map` or `geoJSON` change
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <h1 className="font-bold text-lg mx-10 flex">
          <span
            onClick={() => navigate("/configure/geofence")}
            className="cursor-pointer me-4 mt-1"
          >
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>
          Add Geofence
        </h1>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mx-10 mt-8">
          {/* Geofence Form */}
          <div className="p-6 bg-white rounded-lg shadow-sm w-full sm:w-1/3">
            <form>
              <div className="flex flex-col gap-3">
                {/* Colour Picker */}
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionName"
                  >
                    Colour
                  </label>
                  <div className="relative rounded-full">
                    <input
                      type="color"
                      className="appearance-none w-full h-12 rounded outline-none focus:outline-none mt-2"
                      style={{ WebkitAppearance: "none" }}
                      value={newGeofence?.color}
                      onChange={handleColorChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-white text-[25px]">
                      <RenderIcon
                        iconName="PaintPaletteIcon"
                        size={20}
                        loading={6}
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionName"
                  >
                    Name
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      name="name"
                      id="regionName"
                      value={newGeofence?.name || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm w-full"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionDescription"
                  >
                    Description
                  </label>
                  <div className="relative mt-2">
                    <textarea
                      name="description"
                      id="regionDescription"
                      value={newGeofence?.description || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="flex flex-row gap-2 mt-6">
              <button
                onClick={() => navigate("/configure/geofence")}
                className="w-1/2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => handleAddGeofence.mutate({ newGeofence })}
                className="w-1/2 bg-teal-600 text-white px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm w-full sm:w-2/3">
            <div
              ref={mapContainerRef}
              id="map"
              className="map-container w-full h-[600px]"
            >
              <input
                type="text"
                id="auto"
                name="auto"
                className="absolute top-0 left-0 mt-2 ms-2 p-[10px] text-[15px] outline-none focus:outline-none 
             w-[170px] sm:w-[200px] md:w-[250px] lg:w-[300px]"
                placeholder="Search places"
                spellCheck="false"
              />

              {isMapLoaded && <PlaceSearchPlugin map={mapObject} />}
              {isMapLoaded && geofences.length >= 0 && (
                <GeoJsonComponent map={mapObject} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddGeofence;
