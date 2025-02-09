import { lazy } from 'react';
// const FormElements = lazy(() => import('../pages/Form/FormElements'));
// const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
// const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const ShiftDetails = lazy(() => import('../pages/ShiftDetails'));
const AddStaff = lazy(() => import('../pages/AddStaff'));
const AddClient = lazy(() => import('../pages/AddClient'));
const AddTask = lazy(() => import('../pages/AddTask'));
const StaffList = lazy(() => import('../pages/StaffList'));
const ShiftList = lazy(() => import('../pages/ShiftList'));
const Employee = lazy(() => import('../pages/Employee'));
const IncidenetsList = lazy(() => import('../pages/IncidenetsList'));
const Profile = lazy(() => import('../pages/Profile'));
const MapScreen = lazy(() => import('../pages/MapScreen'));
const ViewID = lazy(() => import('../pages/ViewID'));
const MakeID = lazy(() => import('../pages/MakeID'));

const coreRoutes = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: Dashboard,
  },

  {
    path: '/addclient/:id?',
    title: 'AddClient',
    component: AddClient,
  },
  {
    path: '/addTask/:tag/:id?/:clientid?',
    title: 'AddTask',
    component: AddTask,
  },
  {
    path: '/addStaff/:id?',
    title: 'AddStaff',
    component: AddStaff,
  },
  {
    path: '/staffList',
    title: 'StaffList',
    component: StaffList,
  },
  {
    path: '/ShiftList',
    title: 'ShiftList',
    component: ShiftList,
  },
  {
    path: '/Employee',
    title: 'Employee',
    component: Employee,
  },
  {
    path: '/incidenetsList',
    title: 'IncidenetsList',
    component: IncidenetsList,
  },
  {
    path: '/profile/:id?',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/MapScreen',
    title: 'MapScreen',
    component: MapScreen,
  },
  {
    path: '/ShiftDetails/:staffIds/:id',
    title: 'ShiftDetails',
    component: ShiftDetails,
  },
  {
    path: '/ViewID',
    title: 'ViewID',
    component: ViewID,
  },
  {
    path: '/MakeID',
    title: 'MakeID',
    component: MakeID,
  },
];

const routes = [...coreRoutes];
export default routes;
