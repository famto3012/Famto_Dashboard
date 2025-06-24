import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const AllAgents = lazy(() => import("../screens/general/agent/AllAgents"));
const AgentPayout = lazy(() => import("../screens/general/agent/AgentPayout"));
const AgentDetail = lazy(() => import("../screens/general/agent/AgentDetail"));

const AgentRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<AllAgents />} />
      <Route path="payout" element={<AgentPayout />} />
      <Route path=":agentId" element={<AgentDetail />} />
    </Routes>
  </Suspense>
);

export default AgentRoutes;
