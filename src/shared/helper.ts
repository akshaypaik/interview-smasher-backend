import CryptoJS from 'crypto-js';

class HelperService {

    generateUserIdFromEmail(email: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const hash = CryptoJS.SHA256(normalizedEmail);
        return hash.toString(CryptoJS.enc.Hex);
    }

    getUTCTimeNow = () => {
    const date = Date.now();
    return new Date(date).toISOString();
}

}

const helperService = new HelperService();
export { helperService };