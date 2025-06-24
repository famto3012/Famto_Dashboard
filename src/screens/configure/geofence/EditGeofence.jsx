import RenderIcon from "@/icons/RenderIcon";
import GlobalSearch from "@/components/others/GlobalSearch";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  getAllGeofence,
  getGeofenceDetail,
  updateGeofence,
} from "@/hooks/geofence/useGeofence";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const EditGeofence = () => {
  const [geofence, setGeofence] = useState({
    name: "",
    description: "",
    color: "",
    coordinates: [],
  });
  const mapContainerRef = useRef(null);
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const navigate = useNavigate();

  const { geofenceId } = useParams();

  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  const { data: geofenceData } = useQuery({
    queryKey: ["geofence-detail"],
    queryFn: () => getGeofenceDetail({ geofenceId, navigate }),
  });

  // Add this query to fetch all geofences
  const { data: allGeofences } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const handleUpdateGeofence = useMutation({
    mutationKey: ["edit-geofence"],
    mutationFn: ({ geofence }) =>
      updateGeofence({ geofenceId, updatedGeofence: geofence, navigate }),
    onSuccess: (data) => {
      navigate("/configure/geofence");
      toaster.create({
        title: "Success",
        description: data.message || "Geofence updated successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error.message || "Error updating geofence.",
        type: "error",
      });
    },
  });

  const handleColorChange = (e) => {
    setGeofence({ ...geofence, color: e.target.value });
  };

  const handleInputChange = (e) => {
    setGeofence({ ...geofence, [e.target.name]: e.target.value });
  };

  // Alternative component using individual polygons (like in AddGeofence)
  const AllGeofencesPolygons = ({ map, geofences, currentGeofenceId }) => {
    const polygonsRef = useRef([]);
    
    useEffect(() => {
      console.log("AllGeofencesPolygons - Starting");
      
      if (!map || !geofences || geofences.length === 0) {
        console.log("AllGeofencesPolygons - Early return: missing data");
        return; 
      }

      // Clear existing polygons
      polygonsRef.current.forEach(polygon => {
        if (polygon && polygon.setMap) {
          polygon.setMap(null);
        }
      });
      polygonsRef.current = [];

      // Filter out current geofence and create polygons for others
      const otherGeofences = geofences.filter(geo => geo.id != currentGeofenceId);
      console.log("AllGeofencesPolygons - Other geofences count:", otherGeofences.length);
      
      otherGeofences.forEach((geofence, index) => {
        if (!geofence.coordinates || !Array.isArray(geofence.coordinates)) {
          console.warn(`Geofence ${geofence.name} has invalid coordinates`);
          return;
        }

        // Convert coordinates to Mappls format
        const pts = geofence.coordinates
          .map((coord) => {
            if (!Array.isArray(coord) || coord.length !== 2) {
              console.error("Invalid coordinate format:", coord);
              return null;
            }
            const [lat, lng] = coord;
            return { lat, lng };
          })
          .filter((coord) => coord !== null);

        if (pts.length === 0) {
          console.warn(`No valid coordinates for geofence ${geofence.name}`);
          return;
        }

        console.log(`Creating polygon for ${geofence.name} with ${pts.length} points`);

        try {
          // Create the polygon
          const poly = window.mappls.Polygon({
            map: map,
            paths: pts,
            fillColor: geofence.color || "#000000",
            fillOpacity: 0.3,
            strokeColor: geofence.color || "#000000",
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fitbounds: false,
          });

          // Store the polygon reference
          polygonsRef.current.push(poly);
          console.log(`Polygon created successfully for ${geofence.name}`);
          
        } catch (error) {
          console.error(`Error creating polygon for ${geofence.name}:`, error);
        }
      });
      
      console.log("AllGeofencesPolygons - Total polygons created:", polygonsRef.current.length);

      // Cleanup function
      return () => {
        polygonsRef.current.forEach(polygon => {
          if (polygon && polygon.setMap) {
            polygon.setMap(null);
          }
        });
        polygonsRef.current = [];
      };
      
    }, [map, geofences, currentGeofenceId]);

    return null;
  };
  const AllGeofencesComponent = ({ map, geofences, currentGeofenceId }) => {
    const geoJsonRef = useRef(null);
    
    useEffect(() => {
      console.log("AllGeofencesComponent - Map:", !!map);
      console.log("AllGeofencesComponent - Geofences:", geofences);
      console.log("AllGeofencesComponent - CurrentGeofenceId:", currentGeofenceId);
      
      if (!map || !geofences || geofences.length === 0) {
        console.log("AllGeofencesComponent - Early return: missing map or geofences");
        return;
      }

      // Filter out the current geofence being edited
      const otherGeofences = geofences.filter(geo => geo.id != currentGeofenceId); // Use != instead of !==
      console.log("AllGeofencesComponent - Other geofences:", otherGeofences);
      
      if (otherGeofences.length === 0) {
        console.log("AllGeofencesComponent - No other geofences to display");
        return;
      }

      const geoJSON = {
        type: "FeatureCollection",
        features: otherGeofences.map((geofence) => {
          console.log("Processing geofence:", geofence.name, "Coordinates:", geofence.coordinates);
          return {
            type: "Feature",
            properties: {
              class_id: geofence.id,
              name: geofence.name,
              stroke: geofence.color || "#ffffff",
              "stroke-opacity": 0.8,
              "stroke-width": 2,
              fill: geofence.color || "#000000",
              "fill-opacity": 0.3,
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                geofence.coordinates.map((coord) => {
                  // Check if coordinates are in [lat, lng] format and convert to [lng, lat] for GeoJSON
                  if (Array.isArray(coord) && coord.length === 2) {
                    return [coord[1], coord[0]]; // [lng, lat]
                  }
                  console.warn("Invalid coordinate format:", coord);
                  return coord;
                }),
              ],
            },
          };
        }),
      };

      console.log("AllGeofencesComponent - Generated GeoJSON:", geoJSON);

      try {
        // Remove existing layer if it exists
        if (geoJsonRef.current) {
          console.log("Removing existing layer");
          window.mappls.removeLayer({ map: map, layer: geoJsonRef.current });
        }

        // Add new layer
        console.log("Adding new GeoJSON layer");
        geoJsonRef.current = window.mappls.addGeoJson({
          map: map,
          data: geoJSON,
          overlap: false, // Changed to true
          fitbounds: false,
          preserveViewport: true,
          cType: 0, // Add this parameter
        });
        
        console.log("AllGeofencesComponent - Layer added successfully:", geoJsonRef.current);
        
        // Test: Try to get layer bounds to verify it's actually on the map
        setTimeout(() => {
          if (geoJsonRef.current && geoJsonRef.current.length > 0) {
            console.log("Layer verification - Total layers added:", geoJsonRef.current.length);
            geoJsonRef.current.forEach((layer, index) => {
              console.log(`Layer ${index}:`, layer);
              if (layer.getBounds) {
                console.log(`Layer ${index} bounds:`, layer.getBounds());
              }
            });
          }
        }, 1000);
      } catch (error) {
        console.error("Error adding GeoJSON layer:", error);
      }

    }, [map, geofences, currentGeofenceId]);

    return null;
  };  

  // Component for the editable geofence
  const EditableGeofenceComponent = ({ map, geofence, color }) => {
    useEffect(() => {
      if (!map || !geofence.coordinates || !Array.isArray(geofence.coordinates))
        return;

      // Convert the coordinates to Mappls format
      const pts = geofence.coordinates
        .map((coord) => {
          if (!Array.isArray(coord) || coord.length !== 2) {
            console.error("Invalid coordinate format:", coord);
            return null;
          }
          const [lat, lng] = coord;
          return { lat, lng };
        })
        .filter((coord) => coord !== null);

      if (pts.length === 0) return;

      const poly = window.mappls.Polygon({
        map: map,
        paths: pts,
        fillColor: color,
        fillOpacity: 0.3,
        fitbounds: true,
      });

      // Enable editing of the polygon
      poly.setEditable(true);

      // Function to update coordinates
      const updateCoordinates = () => {
        console.log("Updating coordinates");
        const newCoordinates = poly
          .getPath()[0]
          .map((point) => [point.lat, point.lng]);
        setGeofence((prevState) => ({
          ...prevState,
          coordinates: newCoordinates,
        }));
      };

      // Add event listeners to capture changes
      poly.addListener("dblclick", updateCoordinates);
      
      let lastTapTime = 0;
      poly.addListener("touchstart", (event) => {
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;

        if (tapInterval < 300 && tapInterval > 0) {
          console.log("Double-tap detected on polygon");
          updateCoordinates(event);
        }

        lastTapTime = currentTime;
      });

      // Cleanup function
      return () => {
        if (poly && poly.setMap) {
          poly.setMap(null);
        }
      };
    }, [map, geofence, color]);

    return null;
  };

  useEffect(() => {
    console.log("Updated geofence data:", geofence);
  }, [geofence]);

  useEffect(() => {
    if (geofenceData) {
      console.log("Fetched geofence data:", geofenceData);

      const { name, description, color, coordinates } = geofenceData;
      
      if (Array.isArray(coordinates) && coordinates.length > 0) {
        console.log("Valid coordinates", coordinates);
        setGeofence((prevState) => ({
          ...prevState,
          name,
          description,
          color,
          coordinates,
        }));
      } else {
        console.warn("Invalid or undefined coordinates in geofence data:", coordinates);
        setGeofence({ name, description, color, coordinates: [] });
      }
    }
  }, [geofenceData]);

  let map, drawData, geoJSON, polyArray;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/9a632cda78b871b3a6eb69bddc470fef/map_sdk?layer=vector&v=3.0&polydraw&callback=initMap`;
    script.async = true;
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

              setTimeout(() => {
                const drawPolygonButton = document.querySelector(
                  ".mappls-gl-draw_ctrl-draw-btn.mappls-gl-draw_polygon"
                );
                const deleteButton = document.querySelector(
                  ".mappls-gl-draw_ctrl-draw-btn.mappls-gl-draw_trash"
                );

                if (drawPolygonButton) {
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
              }, 500);

              const formattedCoordinates =
                drawData?.data?.geometry?.coordinates[0].map(([lng, lat]) => [
                  lat,
                  lng,
                ]);
              if (formattedCoordinates.length != 0) {
                setGeofence((prevState) => ({
                  ...prevState,
                  coordinates: formattedCoordinates,
                }));
              }
            }
          );
        });
      } else {
        console.error("Map container not found");
      }
    };
  }, [authToken]);

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
          Edit Geofence
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
                      value={geofence?.color}
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
                      value={geofence?.name || ""}
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
                      value={geofence?.description || ""}
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
                onClick={() => handleUpdateGeofence.mutate({ geofence })}
                className="w-1/2 bg-teal-600 text-white px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Update
              </button>
            </div>

            <p className="text-gray-600 mt-[25px]">
              <span className="font-bold">Note:</span> After changing the
              coordinates of the geofence, double click on the marked area and
              then click the update button.
            </p>
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
              
              {/* Display all other geofences (read-only) - Try polygon approach first */}
              {isMapLoaded && allGeofences && allGeofences.length > 0 && (
                <AllGeofencesPolygons 
                  map={mapObject} 
                  geofences={allGeofences}
                  currentGeofenceId={geofenceId}
                />
              )}
              
              {/* Fallback: Display using GeoJSON if polygons don't work */}
              {/* 
              {isMapLoaded && allGeofences && allGeofences.length > 0 && (
                <AllGeofencesComponent 
                  map={mapObject} 
                  geofences={allGeofences}
                  currentGeofenceId={geofenceId}
                />
              )}
              */}
              
              {/* Display the editable geofence */}
              {isMapLoaded && geofenceData && geofence.coordinates && geofence.coordinates.length > 0 && (
                <EditableGeofenceComponent
                  map={mapObject}
                  geofence={geofence}
                  color={geofence.color}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default EditGeofence;
