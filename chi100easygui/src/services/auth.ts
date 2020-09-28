export function isAuthenticated(to: any, from: any, next: any) {
    const token = localStorage.getItem('user-token');
    if (token) {
        next();
    }
    return false;
}
