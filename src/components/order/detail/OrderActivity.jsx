// import { Button } from "@/components/ui/button";
// import {
//   StepsContent,
//   StepsItem,
//   StepsList,
//   StepsNextTrigger,
//   StepsRoot,
// } from "@/components/ui/steps";
// import { getAuthTokenForDeliveryManagementMap } from "@/hooks/deliveryManagement/useDeliveryManagement";
// import { fetchPolylineFromPickupToDelivery } from "@/hooks/order/useOrder";

// import { formatDate, formatTime } from "@/utils/formatter";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { mappls } from "mappls-web-maps";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// const mapplsObject = new mappls();
// const mapplsClassObject = new mappls();

// const OrderActivity = ({ orderDetail }) => {
//   const { _id: orderId } = orderDetail;
//   const mapContainerRef = useRef(null);
//   const nextButtonRef = useRef(null);
//   const [mapObject, setMapObject] = useState(null);
//   const [isMapLoaded, setIsMapLoaded] = useState(false);
//   const [activeStepIndex, setActiveStepIndex] = useState(0);
//   const [steps, setStep] = useState();

//   const navigate = useNavigate();

//   const { data: authToken } = useQuery({
//     queryKey: ["get-auth-token"],
//     queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
//   });

//   const showAgentLocationOnMap = (coordinates, fullName, Id, phoneNumber) => {
//     const markerProps = {
//       fitbounds: true,
//       fitboundOptions: { padding: 120, duration: 1000 },
//       width: 100,
//       height: 100,
//       clusters: true,
//       clustersOptions: { color: "blue", bgcolor: "red" },
//       offset: [0, 10],
//       draggable: true,
//     };

//     const agentGeoData = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {
//             htmlPopup: `Id:${Id} |
//                Name: ${fullName} |
//                Phone Number: ${phoneNumber} `,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: coordinates,
//           },
//         },
//       ],
//     };

//     agentGeoData.features.forEach(async (feature) => {
//       const { coordinates } = feature.geometry;
//       const { htmlPopup } = feature.properties;

//       try {
//         const agentMarker = await mapplsObject.Marker({
//           map: mapObject,
//           position: { lat: coordinates[0], lng: coordinates[1] },
//           properties: { ...markerProps, popupHtml: htmlPopup },
//         });
//         await agentMarker.setIcon(
//           "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fgoride%20icon.svg?alt=media&token=71896ad1-d821-4ccd-996c-f3131fd09404"
//         );
//         await agentMarker.setPopup(htmlPopup);
//         mapObject.setView([coordinates[0], coordinates[1]], 17);
//       } catch (error) {
//         console.error("Error adding marker:", error);
//       }
//     });
//   };

//   const showShopLocationOnMap = (coordinates, fullName, Id) => {
//     const markerProps = {
//       fitbounds: true,
//       fitboundOptions: { padding: 120, duration: 1000 },
//       width: 100,
//       height: 100,
//       clusters: true,
//       clustersOptions: { color: "blue", bgcolor: "red" },
//       offset: [0, 10],
//       draggable: true,
//     };

//     const shopGeoData = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {
//             htmlPopup: `Id:${Id} |
//                Name: ${fullName} | `,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: coordinates,
//           },
//         },
//       ],
//     };

//     shopGeoData.features.forEach(async (feature) => {
//       const { coordinates } = feature.geometry;
//       const { htmlPopup } = feature.properties;

//       try {
//         const shopMarker = await mapplsObject.Marker({
//           map: mapObject,
//           position: { lat: coordinates[0], lng: coordinates[1] },
//           properties: { ...markerProps, popupHtml: htmlPopup },
//         });
//         await shopMarker.setIcon(
//           "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fshop-svgrepo-com.svg?alt=media&token=1da55e13-4b6e-477b-98ed-8024cfb89f24"
//         );
//         await shopMarker.setPopup(htmlPopup);
//       } catch (error) {
//         console.error("Error adding marker:", error);
//       }
//     });
//   };

//   const showDeliveryLocationOnMap = (
//     coordinates,
//     fullName,
//     Id,
//     phoneNumber
//   ) => {
//     const markerProps = {
//       fitbounds: true,
//       fitboundOptions: { padding: 120, duration: 1000 },
//       width: 25,
//       height: 40,
//       clusters: true,
//       clustersOptions: { color: "blue", bgcolor: "red" },
//       offset: [0, 10],
//       draggable: true,
//     };

//     const deliveryGeoData = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {
//             htmlPopup: `Id:${Id} |
//                Name: ${fullName} |
//                Phone Number: ${phoneNumber} `,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: coordinates, // Assuming agent.location is [lat, lng]
//           },
//         },
//       ],
//     };

//     deliveryGeoData.features.forEach(async (feature) => {
//       const { coordinates } = feature.geometry;
//       const { htmlPopup } = feature.properties;

//       try {
//         const houseMarker = await mapplsObject.Marker({
//           map: mapObject,
//           position: { lat: coordinates[0], lng: coordinates[1] },
//           properties: { ...markerProps, popupHtml: htmlPopup },
//         });
//         await houseMarker.setIcon(
//           "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fhouse-svgrepo-com%201%201.svg?alt=media&token=3b738e30-6cf1-4f21-97d6-7f713831562f4"
//         );
//         await houseMarker.setPopup(htmlPopup);
//       } catch (error) {
//         console.error("Error adding marker:", error);
//       }
//     });
//   };

//   const showStepperLocationOnMap = (coordinates, by, Id, date) => {
//     const markerProps = {
//       fitbounds: true,
//       fitboundOptions: { padding: 120, duration: 1000 },
//       width: 25,
//       height: 40,
//       clusters: true,
//       clustersOptions: { color: "blue", bgcolor: "red" },
//       offset: [0, 10],
//       draggable: true,
//     };

//     const stepperGeoData = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {
//             htmlPopup: `Id:${Id} |
//                By: ${by} |
//                date: ${date} `,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: coordinates, // Assuming agent.location is [lat, lng]
//           },
//         },
//       ],
//     };

//     stepperGeoData.features.forEach(async (feature) => {
//       const { coordinates } = feature.geometry;
//       const { htmlPopup } = feature.properties;

//       console.log("Feature coordinates:", coordinates);

//       try {
//         const houseMarker = await mapplsObject.Marker({
//           map: mapObject,
//           position: { lat: coordinates[0], lng: coordinates[1] },
//           properties: { ...markerProps, popupHtml: htmlPopup },
//         });
//         await houseMarker.setIcon(
//           "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427319321.svg?alt=media&token=f76a13db-218d-48fe-8e54-d13955daeb30"
//         );
//         await houseMarker.setPopup(htmlPopup);
//       } catch (error) {
//         console.error("Error adding marker:", error);
//       }
//     });
//   };

//   // const PolylineComponent = ({ map }) => {
//   //   console.log("Map object in PolylineComponent:", map);
//   //   const polylineRef = useRef(null);
//   //   const [coordinates, setCoordinates] = useState([]);
//   //   const generatePolyline = useMutation({
//   //     mutationKey: ["generate-polyline"],
//   //     mutationFn: ({ pickupLat, pickupLng, deliveryLat, deliveryLng }) =>
//   //       fetchPolylineFromPickupToDelivery({
//   //         navigate,
//   //         pickupLat,
//   //         pickupLng,
//   //         deliveryLat,
//   //         deliveryLng,
//   //       }),
//   //     onSuccess: (data) => {
//   //       const coords = data.map((coor) => ({
//   //         lat: coor[1],
//   //         lng: coor[0],
//   //       }));
//   //       setCoordinates(coords);
//   //     },
//   //   });

//   //   // useEffect(() => {
//   //   //   console.log("Order details", orderDetail);
//   //   //   const pickupLat = orderDetail?.customerDetail?.pickAddress?.location[0];
//   //   //   const pickupLng = orderDetail?.customerDetail?.pickAddress?.location[1];
//   //   //   const deliveryLat = orderDetail?.customerDetail?.dropAddress?.location[0];
//   //   //   const deliveryLng = orderDetail?.customerDetail?.dropAddress?.location[1];

//   //   //   generatePolyline.mutate({
//   //   //     pickupLat,
//   //   //     pickupLng,
//   //   //     deliveryLat,
//   //   //     deliveryLng,
//   //   //   });
//   //   // }, [orderDetail]);

//   //   useEffect(() => {
//   //     const location = orderDetail?.customerDetail?.pickAddress?.location;
//   //     const dropLocation = orderDetail?.customerDetail?.dropAddress?.location;

//   //     if (
//   //       Array.isArray(location) &&
//   //       Array.isArray(dropLocation) &&
//   //       location.length === 2 &&
//   //       dropLocation.length === 2
//   //     ) {
//   //       const [pickupLat, pickupLng] = location;
//   //       const [deliveryLat, deliveryLng] = dropLocation;

//   //       generatePolyline.mutate({
//   //         pickupLat,
//   //         pickupLng,
//   //         deliveryLat,
//   //         deliveryLng,
//   //       });
//   //     } else {
//   //       console.warn("Missing or invalid location data");
//   //     }
//   //   }, [orderDetail]);

//   //   useEffect(() => {
//   //     if (coordinates.length > 0) {
//   //       if (polylineRef.current) {
//   //         mapplsClassObject.removeLayer({
//   //           map: map,
//   //           layer: polylineRef.current,
//   //         });
//   //       }

//   //       polylineRef.current = mapplsClassObject.Polyline({
//   //         map: map,
//   //         path: coordinates,
//   //         strokeColor: "#00CED1",
//   //         strokeOpacity: 1.0,
//   //         strokeWeight: 10,
//   //         fitbounds: true,
//   //       });
//   //     }
//   //   }, [coordinates]);
//   // };

//   const PolylineComponent = ({ map }) => {
//     const polylineRef = useRef(null);
//     const [coordinates, setCoordinates] = useState([]);

//     const generatePolyline = useMutation({
//       mutationKey: ["generate-polyline"],
//       mutationFn: ({ pickupLat, pickupLng, deliveryLat, deliveryLng }) =>
//         fetchPolylineFromPickupToDelivery({
//           navigate,
//           pickupLat,
//           pickupLng,
//           deliveryLat,
//           deliveryLng,
//         }),
//       onSuccess: (data) => {
//         const coords = data.map((coor) => ({
//           lat: coor[1],
//           lng: coor[0],
//         }));
//         console.log("Polyline coordinates set:", coords);
//         setCoordinates(coords);
//       },
//     });

//     useEffect(() => {
//       const location = orderDetail?.customerDetail?.pickAddress?.[0]?.location;
//       const dropLocation =
//         orderDetail?.customerDetail?.dropAddress?.[0]?.location;

//       console.log("Order detail locations:", { location, dropLocation });

//       if (
//         Array.isArray(location) &&
//         Array.isArray(dropLocation) &&
//         location.length === 2 &&
//         dropLocation.length === 2
//       ) {
//         const [pickupLat, pickupLng] = location;
//         const [deliveryLat, deliveryLng] = dropLocation;

//         // Create the polyline on the map
//         const polyline = L.polyline(
//           [
//             [pickupLat, pickupLng],
//             [deliveryLat, deliveryLng],
//           ],
//           { color: "blue" }
//         );

//         polyline.addTo(map); // Ensure `map` is the correct Mappls map object
//       } else {
//         console.warn("Missing or invalid location data");
//       }
//     }, [orderDetail]);

//     useEffect(() => {
//       if (!map) {
//         console.warn("Map object not ready");
//         return;
//       }

//       if (coordinates.length < 2) {
//         console.warn("Not enough coordinates to draw a polyline");
//         return;
//       }

//       if (polylineRef.current) {
//         try {
//           polylineRef.current.remove(); // Better way to remove existing polyline
//         } catch (err) {
//           console.error("Failed to remove old polyline:", err);
//         }
//       }

//       polylineRef.current = new mappls.Polyline({
//         map,
//         path: coordinates,
//         strokeColor: "#00CED1",
//         strokeOpacity: 1.0,
//         strokeWeight: 10,
//         fitbounds: true,
//       });
//     }, [coordinates, map]);

//     return null;
//   };

//   useEffect(() => {
//     if (orderDetail && mapObject) {
//       if (orderId.charAt(0) === "O") {
//         const coordinates = orderDetail?.agentLocation;
//         showAgentLocationOnMap(
//           coordinates,
//           orderDetail?.deliveryAgentDetail?.name,
//           orderDetail?.deliveryAgentDetail?._id,
//           orderDetail?.deliveryAgentDetail?.phoneNumber
//         );
//         const shopCoordinates =
//           orderDetail?.customerDetail?.pickAddress?.location || [];
//         showShopLocationOnMap(
//           shopCoordinates,
//           orderDetail?.merchantDetail?.name,
//           orderDetail?.merchantDetail?._id
//         );
//         const deliveryLocation =
//           orderDetail?.customerDetail?.dropAddress?.location;
//         showDeliveryLocationOnMap(
//           deliveryLocation,
//           orderDetail?.customerDetail?.name,
//           "",
//           orderDetail?.customerDetail?.address?.phoneNumber
//         );
//       }
//     }

//     let mappedSteps = [];
//     orderDetail?.orderDetailStepper?.map((item) => {
//       const addStep = (step, label, index) => {
//         if (step) {
//           mappedSteps.push({
//             title: label,
//             description: `${label === "Assigned" ? "to" : "by"} ${step?.by}`,
//             id: step?.userId || "N/A",
//             time: `${formatDate(step?.date)} | ${formatTime(step?.date)}`,
//           });
//           const date = `${formatDate(step?.date)} | ${formatTime(step?.date)}`;
//           if (!item?.cancelled && step?.date) {
//             setActiveStepIndex(index);
//           }
//           if (step?.location) {
//             showStepperLocationOnMap(
//               step.location,
//               step?.by,
//               step?.userId,
//               date
//             );
//           }
//         }
//       };

//       addStep(item?.created, "Created", mappedSteps.length);
//       addStep(item?.accepted, "Accepted", mappedSteps.length);
//       addStep(item?.assigned, "Assigned", mappedSteps.length);
//       addStep(item?.pickupStarted, "Pickup Started", mappedSteps.length);
//       addStep(
//         item?.reachedPickupLocation,
//         "Reached pickup location",
//         mappedSteps.length
//       );
//       addStep(item?.deliveryStarted, "Delivery started", mappedSteps.length);
//       addStep(
//         item?.reachedDeliveryLocation,
//         "Reached delivery location",
//         mappedSteps.length
//       );
//       addStep(item?.noteAdded, "Note Added", mappedSteps.length);
//       addStep(item?.signatureAdded, "Signature Added", mappedSteps.length);
//       addStep(item?.imageAdded, "Image Added", mappedSteps.length);
//       addStep(item?.completed, "Completed", mappedSteps.length);

//       if (item?.cancelled) {
//         mappedSteps.push({
//           title: "Cancelled",
//           description: `by ${item?.cancelled?.by} with Id ${
//             item?.cancelled?.userId || "N/A"
//           }
//               on ${formatDate(item?.cancelled?.date)}, ${formatTime(
//                 item?.cancelled?.date
//               )}`,
//         });
//         setActiveStepIndex(mappedSteps.length);
//       }
//     });

//     setStep(mappedSteps);
//   }, [mapObject, orderDetail]);

//   useEffect(() => {
//     const mapProps = {
//       center: orderDetail?.pickAddress?.location || [
//         8.528818999999999, 76.94310683333333,
//       ],
//       traffic: true,
//       zoom: 12,
//       geolocation: true,
//       clickableIcons: true,
//     };

//     if (authToken) {
//       console.log("Auth token:", authToken);
//       mapplsObject.initialize(authToken, async () => {
//         if (mapContainerRef.current) {
//           const map = await mapplsObject?.Map({
//             id: "map",
//             properties: mapProps,
//           });

//           if (map && typeof map.on === "function") {
//             map.on("load", () => {
//               setMapObject(map);
//               setIsMapLoaded(true); // Save the map object to state
//             });
//           } else {
//             console.error(
//               "mapObject.on is not a function or mapObject is not defined"
//             );
//           }
//         } else {
//           console.error("Map container not found");
//         }
//       });
//     }
//   }, [authToken]);

//   useEffect(() => {
//     for (let i = 0; i < activeStepIndex; i++) {
//       nextButtonRef.current?.click();
//     }

//     // Cleanup interval on component unmount
//   }, [activeStepIndex, steps?.length]);

//   return (
//     <>
//       <div className="flex flex-col lg:flex-row m-5 mx-10 ">
//         <div className=" w-full lg:w-1/2 order-2 lg:order-1">
//           {activeStepIndex !== null && (
//             <StepsRoot
//               count={steps?.length}
//               orientation="vertical"
//               height="800px"
//               colorPalette="teal"
//               m="20px"
//               gap="0"
//             >
//               <StepsList>
//                 {steps?.map((step, index) => (
//                   <StepsItem
//                     key={index}
//                     index={index}
//                     activeStepIndex={activeStepIndex} // Pass the active step index
//                     title={step?.title}
//                     description={`${step?.description} #ID ${step?.id}`}
//                     data={step?.time}
//                     icon={index + 1}
//                   />
//                 ))}
//               </StepsList>
//               <StepsNextTrigger asChild>
//                 <Button
//                   ref={nextButtonRef}
//                   display="none"
//                   variant="outline"
//                   size="sm"
//                 >
//                   Next
//                 </Button>
//               </StepsNextTrigger>
//             </StepsRoot>
//           )}
//         </div>

//         <div className="w-full lg:w-3/4 bg-white h-[820px] order-1 lg:order-2">
//           <div
//             id="map"
//             ref={mapContainerRef}
//             style={{
//               width: "99%",
//               height: "810px",
//               display: "inline-block",
//             }}
//           >
//             {isMapLoaded && <PolylineComponent map={mapObject} />}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OrderActivity;

import { Button } from "@/components/ui/button";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { getAuthTokenForDeliveryManagementMap } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { fetchPolylineFromPickupToDelivery } from "@/hooks/order/useOrder";

import { formatDate, formatTime } from "@/utils/formatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapplsObject = new mappls();
const mapplsClassObject = new mappls();

const OrderActivity = ({ orderDetail }) => {
  const { _id: orderId } = orderDetail;
  const mapContainerRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [steps, setStep] = useState();

  const navigate = useNavigate();

  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  // Utility function to validate coordinates
  const isValidCoordinates = (coordinates) => {
    return (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1]) &&
      coordinates[0] !== null &&
      coordinates[1] !== null
    );
  };

  const showAgentLocationOnMap = (coordinates, fullName, Id, phoneNumber) => {
    // Validate coordinates first
    if (!isValidCoordinates(coordinates)) {
      console.warn("Invalid agent coordinates:", coordinates);
      return;
    }

    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 100,
      height: 100,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const agentGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id || "N/A"} |
               Name: ${fullName || "N/A"} |
               Phone Number: ${phoneNumber || "N/A"} `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    };

    agentGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      try {
        const agentMarker = await mapplsObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });

        if (agentMarker && typeof agentMarker.setIcon === "function") {
          await agentMarker.setIcon(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fgoride%20icon.svg?alt=media&token=71896ad1-d821-4ccd-996c-f3131fd09404"
          );
          await agentMarker.setPopup(htmlPopup);
          mapObject.setView([coordinates[0], coordinates[1]], 17);
        }
      } catch (error) {
        console.error("Error adding agent marker:", error);
      }
    });
  };

  const showShopLocationOnMap = (coordinates, fullName, Id) => {
    // Validate coordinates first
    if (!isValidCoordinates(coordinates)) {
      console.warn("Invalid shop coordinates:", coordinates);
      return;
    }

    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 100,
      height: 100,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const shopGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id || "N/A"} |
               Name: ${fullName || "N/A"} | `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    };

    shopGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      try {
        const shopMarker = await mapplsObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });

        if (shopMarker && typeof shopMarker.setIcon === "function") {
          await shopMarker.setIcon(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fshop-svgrepo-com.svg?alt=media&token=1da55e13-4b6e-477b-98ed-8024cfb89f24"
          );
          await shopMarker.setPopup(htmlPopup);
        }
      } catch (error) {
        console.error("Error adding shop marker:", error);
      }
    });
  };

  const showDeliveryLocationOnMap = (
    coordinates,
    fullName,
    Id,
    phoneNumber
  ) => {
    // Validate coordinates first
    if (!isValidCoordinates(coordinates)) {
      console.warn("Invalid delivery coordinates:", coordinates);
      return;
    }

    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 25,
      height: 40,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const deliveryGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id || "N/A"} |
               Name: ${fullName || "N/A"} |
               Phone Number: ${phoneNumber || "N/A"} `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    };

    deliveryGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      try {
        const houseMarker = await mapplsObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });

        if (houseMarker && typeof houseMarker.setIcon === "function") {
          await houseMarker.setIcon(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fhouse-svgrepo-com%201%201.svg?alt=media&token=3b738e30-6cf1-4f21-97d6-7f713831562f4"
          );
          await houseMarker.setPopup(htmlPopup);
        }
      } catch (error) {
        console.error("Error adding delivery marker:", error);
      }
    });
  };

  const showStepperLocationOnMap = (coordinates, by, Id, date) => {
    // Validate coordinates first
    if (!isValidCoordinates(coordinates)) {
      console.warn("Invalid stepper coordinates:", coordinates);
      return;
    }

    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 25,
      height: 40,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const stepperGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id || "N/A"} |
               By: ${by || "N/A"} |
               Date: ${date || "N/A"} `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    };

    stepperGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      console.log("Feature coordinates:", coordinates);

      try {
        const stepperMarker = await mapplsObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });

        if (stepperMarker && typeof stepperMarker.setIcon === "function") {
          await stepperMarker.setIcon(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427319321.svg?alt=media&token=f76a13db-218d-48fe-8e54-d13955daeb30"
          );
          await stepperMarker.setPopup(htmlPopup);
        }
      } catch (error) {
        console.error("Error adding stepper marker:", error);
      }
    });
  };

  const PolylineComponent = ({ map }) => {
    const polylineRef = useRef(null);
    const [coordinates, setCoordinates] = useState([]);

    const generatePolyline = useMutation({
      mutationKey: ["generate-polyline"],
      mutationFn: ({ path }) =>
        fetchPolylineFromPickupToDelivery({ navigate, path }),
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          const coords = data.map((coor) => ({
            lat: coor[1],
            lng: coor[0],
          }));
          setCoordinates(coords);
        }
      },
    });

    useEffect(() => {
      const polylineCoordinates = [];

      // Collect valid pickup locations
      const pickups = orderDetail?.customerDetail?.pickAddress;
      if (pickups) {
        const pickupList = Array.isArray(pickups) ? pickups : [pickups];
        pickupList.forEach((addr) => {
          const loc = addr?.location;
          if (isValidCoordinates(loc)) {
            polylineCoordinates.push(loc);
          }
        });
      }

      // Collect valid drop locations
      const drops = orderDetail?.customerDetail?.dropAddress;
      if (drops) {
        const dropList = Array.isArray(drops) ? drops : [drops];
        dropList.forEach((addr) => {
          const loc = addr?.location;
          if (isValidCoordinates(loc)) {
            polylineCoordinates.push(loc);
          }
        });
      }

      console.log("Final polylineCoordinates to send:", polylineCoordinates);

      // Send only if there are at least 2 valid points
      if (polylineCoordinates.length >= 2) {
        generatePolyline.mutate({
          path: polylineCoordinates,
        });
      } else {
        console.warn(
          "Not enough valid coordinates to draw polyline:",
          polylineCoordinates.length
        );
      }
    }, [orderDetail]);

    useEffect(() => {
      if (!map) {
        console.warn("Map object not ready");
        return;
      }

      if (coordinates.length < 2) {
        console.warn(
          "Not enough coordinates to draw a polyline:",
          coordinates.length
        );
        return;
      }

      // Remove existing polyline
      if (polylineRef.current) {
        try {
          if (typeof polylineRef.current.remove === "function") {
            polylineRef.current.remove();
          } else if (typeof mapplsClassObject.removeLayer === "function") {
            mapplsClassObject.removeLayer({
              map: map,
              layer: polylineRef.current,
            });
          }
        } catch (err) {
          console.error("Failed to remove old polyline:", err);
        }
      }

      try {
        // Try different methods to create polyline based on Mappls API
        if (typeof mapplsClassObject.Polyline === "function") {
          // Using the class object
          polylineRef.current = mapplsClassObject.Polyline({
            map: map,
            path: coordinates,
            strokeColor: "#00CED1",
            strokeOpacity: 1.0,
            strokeWeight: 10,
            fitbounds: true,
          });
        } else if (typeof mapplsObject.Polyline === "function")
          async () => {
            // Using the main object
            polylineRef.current = await mapplsObject.Polyline({
              map: map,
              path: coordinates,
              strokeColor: "#00CED1",
              strokeOpacity: 1.0,
              strokeWeight: 10,
              fitbounds: true,
            });
          };
        else {
          // Fallback: create polyline using Leaflet if Mappls doesn't work
          console.warn("Mappls Polyline not available, using Leaflet fallback");
          const leafletCoords = coordinates.map((coord) => [
            coord.lat,
            coord.lng,
          ]);
          polylineRef.current = L.polyline(leafletCoords, {
            color: "#00CED1",
            weight: 10,
            opacity: 1.0,
          }).addTo(map);
        }

        console.log("Polyline created successfully");
      } catch (error) {
        console.error(
          "Error creating polyline with Mappls, trying Leaflet fallback:",
          error
        );

        // Leaflet fallback
        try {
          const leafletCoords = coordinates.map((coord) => [
            coord.lat,
            coord.lng,
          ]);
          if (leafletCoords.length >= 2) {
            polylineRef.current = L.polyline(leafletCoords, {
              color: "#00CED1",
              weight: 10,
              opacity: 1.0,
            }).addTo(map);
            console.log("Leaflet polyline created successfully");
          }
        } catch (leafletError) {
          console.error("Leaflet fallback also failed:", leafletError);
        }
      }
    }, [coordinates, map]);

    return null;
  };

  useEffect(() => {
    if (orderDetail && mapObject) {
      if (orderId.charAt(0) === "O") {
        // Agent location
        const agentCoordinates = orderDetail?.agentLocation;
        if (isValidCoordinates(agentCoordinates)) {
          showAgentLocationOnMap(
            agentCoordinates,
            orderDetail?.deliveryAgentDetail?.name,
            orderDetail?.deliveryAgentDetail?._id,
            orderDetail?.deliveryAgentDetail?.phoneNumber
          );
        }

        // Shop location
        if (Array.isArray(orderDetail?.customerDetail?.pickAddress)) {
          orderDetail.customerDetail.pickAddress.forEach((address, index) => {
            if (isValidCoordinates(address?.location)) {
              showShopLocationOnMap(
                address.location,
                address?.fullName ||
                  orderDetail?.merchantDetail?.name ||
                  `Pick Address ${index + 1}`,
                orderDetail?.merchantDetail?._id || `PA-${index}`
              );
            }
          });
        } else if (
          isValidCoordinates(orderDetail?.customerDetail?.pickAddress?.location)
        ) {
          const address = orderDetail.customerDetail.pickAddress;
          showShopLocationOnMap(
            address.location,
            address?.fullName || orderDetail?.merchantDetail?.name,
            orderDetail?.merchantDetail?._id
          );
        }

        if (Array.isArray(orderDetail?.customerDetail?.dropAddress)) {
          orderDetail.customerDetail.dropAddress.forEach((address, index) => {
            if (isValidCoordinates(address?.location)) {
              showDeliveryLocationOnMap(
                address.location,
                address?.fullName ||
                  orderDetail?.customerDetail?.name ||
                  `Drop Address ${index + 1}`,
                `DA-${index}`,
                address?.phoneNumber || orderDetail?.customerDetail?.phone
              );
            }
          });
        } else if (
          isValidCoordinates(orderDetail?.customerDetail?.dropAddress?.location)
        ) {
          const address = orderDetail.customerDetail.dropAddress;
          showDeliveryLocationOnMap(
            address.location,
            address?.fullName || orderDetail?.customerDetail?.name,
            `DA-0`,
            address?.phoneNumber || orderDetail?.customerDetail?.phone
          );
        }
      }
    }

    let mappedSteps = [];
    orderDetail?.orderDetailStepper?.map((item) => {
      const addStep = (step, label, index) => {
        if (step) {
          mappedSteps.push({
            title: label,
            description: `${label === "Assigned" ? "to" : "by"} ${step?.by}`,
            id: step?.userId || "N/A",
            time: `${formatDate(step?.date)} | ${formatTime(step?.date)}`,
          });
          const date = `${formatDate(step?.date)} | ${formatTime(step?.date)}`;
          if (!item?.cancelled && step?.date) {
            setActiveStepIndex(index);
          }
          if (isValidCoordinates(step?.location)) {
            showStepperLocationOnMap(
              step.location,
              step?.by,
              step?.userId,
              date
            );
          }
        }
      };

      addStep(item?.created, "Created", mappedSteps.length);
      addStep(item?.accepted, "Accepted", mappedSteps.length);
      addStep(item?.assigned, "Assigned", mappedSteps.length);
      addStep(item?.pickupStarted, "Pickup Started", mappedSteps.length);
      addStep(
        item?.reachedPickupLocation,
        "Reached pickup location",
        mappedSteps.length
      );
      addStep(item?.deliveryStarted, "Delivery started", mappedSteps.length);
      addStep(
        item?.reachedDeliveryLocation,
        "Reached delivery location",
        mappedSteps.length
      );
      addStep(item?.noteAdded, "Note Added", mappedSteps.length);
      addStep(item?.signatureAdded, "Signature Added", mappedSteps.length);
      addStep(item?.imageAdded, "Image Added", mappedSteps.length);
      addStep(item?.completed, "Completed", mappedSteps.length);

      if (item?.cancelled) {
        mappedSteps.push({
          title: "Cancelled",
          description: `by ${item?.cancelled?.by} with Id ${
            item?.cancelled?.userId || "N/A"
          }
              on ${formatDate(item?.cancelled?.date)}, ${formatTime(
                item?.cancelled?.date
              )}`,
        });
        setActiveStepIndex(mappedSteps.length);
      }
    });

    setStep(mappedSteps);
  }, [mapObject, orderDetail]);

  useEffect(() => {
    // Default center coordinates - fallback if no pickAddress
    let centerCoordinates = [8.528818999999999, 76.94310683333333];

    // Try to get center from pickAddress
    if (
      orderDetail?.pickAddress?.location &&
      isValidCoordinates(orderDetail.pickAddress.location)
    ) {
      centerCoordinates = orderDetail.pickAddress.location;
    } else if (orderDetail?.customerDetail?.pickAddress) {
      let pickLocation;
      if (Array.isArray(orderDetail.customerDetail.pickAddress)) {
        pickLocation = orderDetail.customerDetail.pickAddress[0]?.location;
      } else {
        pickLocation = orderDetail.customerDetail.pickAddress.location;
      }
      if (isValidCoordinates(pickLocation)) {
        centerCoordinates = pickLocation;
      }
    }

    const mapProps = {
      center: centerCoordinates,
      traffic: true,
      zoom: 12,
      geolocation: true,
      clickableIcons: true,
    };

    if (authToken) {
      console.log("Auth token:", authToken);
      mapplsObject.initialize(authToken, async () => {
        if (mapContainerRef.current) {
          try {
            const map = await mapplsObject?.Map({
              id: "map",
              properties: mapProps,
            });

            if (map && typeof map.on === "function") {
              map.on("load", () => {
                setMapObject(map);
                setIsMapLoaded(true);
              });
            } else {
              console.error(
                "Map object is invalid or doesn't have 'on' method"
              );
            }
          } catch (error) {
            console.error("Error creating map:", error);
          }
        } else {
          console.error("Map container not found");
        }
      });
    }
  }, [authToken, orderDetail]);

  useEffect(() => {
    if (activeStepIndex > 0 && steps?.length) {
      for (let i = 0; i < activeStepIndex; i++) {
        nextButtonRef.current?.click();
      }
    }
  }, [activeStepIndex, steps?.length]);

  return (
    <>
      <div className="flex flex-col lg:flex-row m-5 mx-10 ">
        <div className=" w-full lg:w-1/2 order-2 lg:order-1">
          {activeStepIndex !== null && steps?.length > 0 && (
            <StepsRoot
              count={steps?.length}
              orientation="vertical"
              height="800px"
              colorPalette="teal"
              m="20px"
              gap="0"
            >
              <StepsList>
                {steps?.map((step, index) => (
                  <StepsItem
                    key={index}
                    index={index}
                    activeStepIndex={activeStepIndex}
                    title={step?.title}
                    description={`${step?.description} #ID ${step?.id}`}
                    data={step?.time}
                    icon={index + 1}
                  />
                ))}
              </StepsList>
              <StepsNextTrigger asChild>
                <Button
                  ref={nextButtonRef}
                  display="none"
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </StepsNextTrigger>
            </StepsRoot>
          )}
        </div>

        <div className="w-full lg:w-3/4 bg-white h-[820px] order-1 lg:order-2">
          <div
            id="map"
            ref={mapContainerRef}
            style={{
              width: "99%",
              height: "810px",
              display: "inline-block",
            }}
          >
            {isMapLoaded && mapObject && <PolylineComponent map={mapObject} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderActivity;
