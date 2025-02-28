import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
    {
        id: 1,
        label: 'Dashboard',
        icon: 'bx bxs-dashboard',
        link: '/dashboard',
    },    
    {
        id: 2,
        label: 'Data Record',
        icon: 'bx bxs-briefcase-alt',
        link: '/tenant'
    },
    {
        id: 3,
        label: 'Management',
        icon: 'bx bx-notepad',
        link: '/reportquantity'
    },
       
    {
        id: 4,
        label: 'Account',
        icon: 'bx bx-user',
        link: '/superadmin',
        role: 'SuperAdmin'
    },
    {
        id: 5,
        isLayout: true
    },
];

