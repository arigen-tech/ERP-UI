import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { MenuProvider } from './context/MenuContext';



const Layout =  React.lazy(() => import('./Views/layout/index'));
const Dashboard = React.lazy(() => import('./Views/Dashboard/index'));
const Login = React.lazy(() => import('./Views/Login/index'));
const RelationMaster = React.lazy(() => import('./Views/Admin/Apointment/RelationMaster'));
const MaritalMaster = React.lazy(() => import('./Views/Admin/Apointment/MaritalMaster'));
const GenderMaster = React.lazy(() => import('./Views/Admin/Apointment/GenderMaster'));
const ReligionMaster = React.lazy(() => import('./Views/Admin/Apointment/ReligionMaster'));
const HolidayMaster = React.lazy(() => import('./Views/Admin/Apointment/HolidayMaster'));
const CourseMaster = React.lazy(() => import('./Views/Admin/Apointment/CourseMaster'));
const LeaveMaster = React.lazy(() => import('./Views/Admin/Apointment/LeaveMaster'));
const QualificationMaster = React.lazy(() => import('./Views/Admin/Apointment/QualificationMaster'));
const InstituteMaster = React.lazy(() => import('./Views/Admin/Apointment/InstituteMaster'));
const CountryMaster = React.lazy(() => import('./Views/Admin/Apointment/CountryMaster'));
const StateMaster = React.lazy(() => import('./Views/Admin/Apointment/StateMaster'));
const DistrictMaster = React.lazy(() => import('./Views/Admin/Apointment/DistrictMaster'));
const VillageMaster = React.lazy(() => import('./Views/Admin/Apointment/VillageMaster'));
const CasteMaster = React.lazy(() => import('./Views/Admin/Apointment/CasteMaster'));
const CategoryMaster = React.lazy(() => import('./Views/Admin/Apointment/CategoryMaster'));
const BlockMaster = React.lazy(() => import('./Views/Admin/Apointment/BlockMaster'));
const LeavetypeMaster = React.lazy(() => import('./Views/Admin/Apointment/LeavetypeMaster'));
const CentreMaster = React.lazy(() => import('./Views/Admin/Apointment/CentreMaster'));
const ItemClassMaster = React.lazy(() => import('./Views/Admin/Apointment/ItemclassMaster'));



const isAuthenticated = () => {
  // Replace this with real authentication check logic
 // return Cookies.get('isAuthenticated') === "true";
 return true;
};
const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};
function App() {
  return (
    <MenuProvider>
    <Router>
      <Suspense>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Layout />} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/RelationMaster" element={<RelationMaster />} />
              <Route path="/MaritalMaster" element={<MaritalMaster />} />
              <Route path="/GenderMaster" element={<GenderMaster />} />
              <Route path="/ReligionMaster" element={<ReligionMaster />} />
              <Route path="/HolidayMaster" element={<HolidayMaster />} />
              <Route path="/CourseMaster" element={<CourseMaster />} />
              <Route path="/LeaveMaster" element={<LeaveMaster />} />
              <Route path="/QualificationMaster" element={<QualificationMaster />} />
              <Route path="/InstituteMaster" element={<InstituteMaster />} />
              <Route path="/CountryMaster" element={<CountryMaster />} />
              <Route path="/StateMaster" element={<StateMaster />} />
              <Route path="/DistrictMaster" element={<DistrictMaster />} />
              <Route path="/VillageMaster" element={<VillageMaster />} />
              <Route path="/CasteMaster" element={<CasteMaster />} />
              <Route path="/CategoryMaster" element={<CategoryMaster />} />
              <Route path="/BlockMaster" element={<BlockMaster />} />
              <Route path="/LeavetypeMaster" element={<LeavetypeMaster />} />
              <Route path="/CentreMaster" element={<CentreMaster />} />
              <Route path="/ItemClassMaster" element={<ItemClassMaster />} />
            </Route>
        </Routes>
      </Suspense>
    </Router>
    </MenuProvider>
  );
}

export default App;
