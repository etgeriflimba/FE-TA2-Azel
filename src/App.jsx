import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SchedulePage from "./pages/SchedulePage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import ReservationDetailPage from "./pages/ReservationDetailPage";
import DashboardManagementPage from "./pages/admin/DashboardManagementPage";
import SpecializationManagementPage from "./pages/admin/specialization/SpecializationManagementPage";
import CreateSpecializationPage from "./pages/admin/specialization/CreateSpecializationPage";
import EditSpecializationPage from "./pages/admin/specialization/EditSpecializationPage";
import DoctorManagementPage from "./pages/admin/doctor/DoctorManagementPage";
import CreateDoctorPage from "./pages/admin/doctor/CreateDoctorPage";
import EditDoctorPage from "./pages/admin/doctor/EditDoctorPage";
import ScheduleSpecializationManagementPage from "./pages/admin/schedule/ScheduleSpecializationManagementPage";
import CreateScheduleSpecializationPage from "./pages/admin/schedule/CreateScheduleSpecializationPage";
import EditScheduleSpecializationPage from "./pages/admin/schedule/EditScheduleSpecializationPage";
import ScheduleGeneralManagementPage from "./pages/admin/schedule/ScheduleGeneralManagementPage";
import CreateScheduleGeneralPage from "./pages/admin/schedule/CreateScheduleGeneralPage";
import EditScheduleGeneralPage from "./pages/admin/schedule/EditScheduleGeneralPage.jsx";
import ReservationManagementPage from "./pages/admin/reservation/ReservationManagementPage";
import { Routes, Route, useLocation } from "react-router-dom";
import Spinner from "./components/ui/spinner";
import { useHydration } from "./hooks/useHydration";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DoctorUmumManagementPage from "./pages/admin/doctor_umum/DoctorUmumManagementPage";
import CreateDoctorUmumPage from "./pages/admin/doctor_umum/CreateDoctorUmumPage";
import EditDoctorUmumPage from "./pages/admin/doctor_umum/EditDoctorUmumPage";
import ReservationUmumDetailPage from "./pages/ReservationUmumDetailPage";

function App() {
  const location = useLocation();
  const { isHydrated } = useHydration();

  if (!isHydrated) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  return (
    <>
      {!location.pathname.startsWith("/admin") ? <Header /> : null}

      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/register" Component={RegisterPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/schedule" Component={SchedulePage} />
        <Route path="/contact" Component={ContactPage} />
        <Route path="/profile" Component={ProfilePage} />
        <Route path="/history" Component={HistoryPage} />
        <Route path="/reservation/:reservationId" Component={ReservationDetailPage} />
        <Route path="/reservation-umum" Component={ReservationUmumDetailPage} />

        <Route path="/admin">
          <Route path="login" Component={AdminLoginPage} />
          <Route path="dashboard" Component={DashboardManagementPage} />
          <Route path="specialization" Component={SpecializationManagementPage} />
          <Route path="specialization/create" Component={CreateSpecializationPage} />
          <Route path="specialization/edit/:specializationId" Component={EditSpecializationPage} />
          <Route path="doctor" Component={DoctorManagementPage} />
          <Route path="doctor-umum" Component={DoctorUmumManagementPage} />
          <Route path="doctor/create" Component={CreateDoctorPage} />
          <Route path="doctor/edit/:doctorId" Component={EditDoctorPage} />
          <Route path="doctor-umum/create" Component={CreateDoctorUmumPage} />
          <Route path="doctor-umum/edit/:doctorId" Component={EditDoctorUmumPage} />
          <Route path="schedule/specialization" Component={ScheduleSpecializationManagementPage} />
          <Route path="schedule/specialization/create" Component={CreateScheduleSpecializationPage} />
          <Route path="schedule/specialization/edit/:scheduleSpecializationId" Component={EditScheduleSpecializationPage} />
          <Route path="schedule/general" Component={ScheduleGeneralManagementPage} />
          <Route path="schedule/general/create" Component={CreateScheduleGeneralPage} />
          <Route path="schedule/general/edit/:scheduleGeneralId" Component={EditScheduleGeneralPage} />
          <Route path="reservation" Component={ReservationManagementPage} />
          
        </Route>

        <Route path="*" Component={NotFoundPage} />
      </Routes>

      {!location.pathname.startsWith("/admin") ? <Footer /> : null}
    </>
  );
}

export default App;
