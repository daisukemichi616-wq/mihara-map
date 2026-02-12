import Papa from 'papaparse';
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0jkQnLXsIL33pmO60BCd0hIr_v5xh34cJ_IWAHkF0pTaj855pzicmNoVx6W8CPK3MEhlp-irodPSE/pub?gid=1232979489&single=true&output=csv";

export function formatDriveUrl(urlOrId, size = 'w1000') {
    if (!urlOrId) return '';
    const str = urlOrId.toString();
    const idMatch = str.match(/[-\w]{25,}/);
    if ((str.includes('google') || !str.startsWith('http')) && idMatch) {
        return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=${size}`;
    }
    return str;
}

export async function fetchSpots() {
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        return new Promise((resolve) => {
            Papa.parse(csvText, {
                header: true, skipEmptyLines: true,
                complete: (results) => {
                    const spots = results.data.map((row, i) => {
                        const clean = {};
                        Object.keys(row).forEach(k => clean[k.trim().toLowerCase()] = row[k]?.trim());
                        if (!clean.title) return null;
                        
                        clean.slug = clean.id || `spot-${i + 1}`;
                        clean.imageUrl = formatDriveUrl(clean.image, 'w1000');
                        clean.lat = clean.lat ? parseFloat(clean.lat) : 0;
                        clean.lng = clean.lng ? parseFloat(clean.lng) : 0;
                        
                        const areas = { 'all': '全エリア', 'mihara': '三原', 'daiwa': '大和', 'kui': '久井', 'hongo': '本郷', 'sagi': '佐木島' };
                        clean.areaLabel = areas[clean.area] || clean.area || 'MIHARA';
                        return clean;
                    }).filter(Boolean);
                    resolve(spots);
                }
            });
        });
    } catch (e) { return []; }
}