import { GITHUB_TOKEN } from '$env/static/private';
import type { RepoData } from '$lib/types';

const QUERY = `
query {
  viewer {
    repositories(
      first: 100
      orderBy: { field: UPDATED_AT, direction: DESC }
      privacy: PUBLIC
    ) {
      nodes {
        id
        name
        description
        url
        isFork
        isArchived
        stargazers {
            totalCount
        }
        updatedAt
        repositoryTopics(first: 5) {
          nodes {
            topic {
              name
            }
          }
        }
        languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

export async function fetchRepositories(): Promise<RepoData[]> {
	console.log('[GitHub] fetchRepositories starting...');
	if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_token_here') {
		console.warn('[GitHub] GITHUB_TOKEN not set or invalid. Returning empty list.');
		return [];
	}

	try {
		console.log('[GitHub] Sending GraphQL request to GitHub API...');
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: QUERY })
		});

		if (!response.ok) {
			const text = await response.text();
			console.error(`[GitHub] API error (${response.status}):`, text);
			return [];
		}

		console.log('[GitHub] Parsing response JSON...');
		const json = await response.json();

		if (json.errors) {
			console.error('[GitHub] GraphQL errors:', json.errors);
			return [];
		}

		const nodes = json.data?.viewer?.repositories?.nodes || [];
		console.log(`[GitHub] Successfully fetched ${nodes.length} repository nodes`);
		return nodes;
	} catch (error) {
		console.error('[GitHub] Failed to fetch repositories:', error);
		return [];
	}
}
