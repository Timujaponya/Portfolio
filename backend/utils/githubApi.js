const axios = require("axios")
const {githubToken} = require("../config/env.js");

// GitHub request fonksiyonu
async function getUserRepositories(user) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
    };

    if (githubToken) {
        headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await axios.get(`https://api.github.com/users/${user}/repos`, {
        timeout: 5000, // 5 saniye timeout
        headers,
        params: {
            per_page: 100, // Maksimum repo sayısı
            sort: 'updated'
        }
    });
    return response.data;
}


module.exports = {getUserRepositories}