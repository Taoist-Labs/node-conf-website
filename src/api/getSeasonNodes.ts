interface ResSeasonNodesData {
    code: number;
    msg: string;
    data: string[]; // Array of Ethereum addresses
}

const BASE_URL = 'https://api.seedao.top/v1';

export async function getSeasonNodes(seasonIdx: number): Promise<ResSeasonNodesData> {
    try {
        const response = await fetch(`${BASE_URL}/public_data/get_season_nodes/${seasonIdx}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data as ResSeasonNodesData;
        
    } catch (error) {
        console.error('Error fetching season nodes:', error);
        throw error;
    }
}