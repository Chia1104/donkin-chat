import { getSolBalance } from './solana.service';

describe('SolanaService', () => {
	beforeEach(() => {
		vi.mock('@/utils/env', () => ({
			env: {
				NEXT_PUBLIC_SOLANA_RPC: 'https://api.devnet.solana.com',
				NEXT_PUBLIC_APP_ENV: 'local',
			},
		}));
	});

	it('should get sol balance by sdk', async () => {
		const balance = await getSolBalance('BkY7kCRFhqhkqL1SmahGbU7vqo2aGsthy7vj3WNsXQGU', 'devnet');
		expect(balance != null).toBe(true);
	});
});
