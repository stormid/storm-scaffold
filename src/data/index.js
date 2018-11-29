import fetch from 'node-fetch';

export const ia = [
    {
        label: 'Dashboard',
        href: '/dashboard.html'
    },
    {
        label: 'Test',
        href: '/test/'
    },
    {
        label: 'Logout',
        href: '/'
    },
];

export const resource = () => fetch('https://reststop.randomhouse.com/resources/titles?search=storm', {
    headers: {
       "accept": "application/json"
    }
})