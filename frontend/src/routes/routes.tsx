import config from "../config";
import Dashboard from "../layouts/components/Dashboard";
import Home from "../pages/Home";
import Students from "../layouts/components/Students";
import Classes from "../layouts/components/Classes";
import Attendance from "../layouts/components/Attendance";
import FacialData from "../layouts/components/FacialData";
import Reports from "../layouts/components/Reports";
import SystemManagement from "../layouts/components/SystemManagement";
import FaceRecognition from "../pages/FaceRecognition";

interface Route {
    path: string;
    component: React.ComponentType<any>;
    layout: string;
}

// Public routes
const publicRoutes: Route[] = [
    { path: '/', component: Home, layout: 'default' },
    { path: config.routes.home, component: Home, layout: 'default' },
    { path: config.routes.face_recognition, component: FaceRecognition, layout: 'default' },
    { path: config.routes.admin, component: Dashboard, layout: 'admin' },
    { path: config.routes.dashboard, component: Dashboard, layout: 'admin' },
    { path: config.routes.students, component: Students, layout: 'admin' },
    { path: config.routes.classes, component: Classes, layout: 'admin' },
    { path: config.routes.attendance, component: Attendance, layout: 'admin' },
    { path: config.routes.facial_data, component: FacialData, layout: 'admin' },
    { path: config.routes.reports, component: Reports, layout: 'admin' },
    { path: config.routes.system_management, component: SystemManagement, layout: 'admin' },
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
