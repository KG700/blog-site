import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from "aws-amplify/auth"

export async function authListener() {
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signedIn':
                return true
            case 'signedOut':
                return false
        }
    })
    try {
        await getCurrentUser()
        return true
    } catch (error) {
        return false
    }
}
