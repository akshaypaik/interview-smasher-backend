class SanitizeInput {

    public sanitizeAlphanumeric(input: any) {
        return input.replace(/[^a-zA-Z0-9]/g, '');
    }

}

const sanitizeInput = new SanitizeInput();
export { sanitizeInput };