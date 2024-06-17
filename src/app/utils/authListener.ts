import { Auth, Hub } from 'aws-amplify';

export async function authListener() {
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signIn':
                return true
            case 'signOut':
                return false
        }
    })
    try {
        await Auth.currentAuthenticatedUser()
        return true
    } catch (error) {
        return false
    }
}
