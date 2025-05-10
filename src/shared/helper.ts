import CryptoJS from 'crypto-js';

class HelperService {

    generateUserIdFromEmail(email: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const hash = CryptoJS.SHA256(normalizedEmail);
        return hash.toString(CryptoJS.enc.Hex);
    }

}

const helperService = new HelperService();
export { helperService };