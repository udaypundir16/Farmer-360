
require('dotenv').config();
const { getSchemeNews } = require('./src/services/schemes.service');

async function test() {
    console.log('Testing getSchemeNews...');
    try {
        const news = await getSchemeNews();
        console.log('News fetched:', news.length);
        if (news.length > 0) {
            console.log('First item:', JSON.stringify(news[0], null, 2));
        } else {
            console.log('No news found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
