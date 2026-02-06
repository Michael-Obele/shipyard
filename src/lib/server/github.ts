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
	if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_token_here') {
		console.warn('GITHUB_TOKEN not set or invalid. Returning empty list.');
		// Return mock data for development if needed, or empty
        return [];
	}

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: QUERY })
		});

		const json = await response.json();
        
        if (json.errors) {
            console.error('GitHub GraphQL errors:', json.errors);
            return [];
        }

		return json.data?.viewer?.repositories?.nodes || [];
	} catch (error) {
		console.error('Failed to fetch repositories:', error);
		return [];
	}
}
