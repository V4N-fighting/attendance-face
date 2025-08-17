import config from "../config";
import Admin from "../pages/Admin";
import Home from "../pages/Home";



interface Route {
    path: string;
    component: React.ComponentType<any>;
    layout: string;
}

// Public routes
const publicRoutes: Route[] = [
    { path: '/', component: Home, layout: 'default' },
    { path: config.routes.home, component: Home, layout: 'default' },
    { path: config.routes.admin, component: Admin, layout: 'admin' },
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
