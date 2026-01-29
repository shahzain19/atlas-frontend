import axios from 'axios';
import { useAuthStore } from './store/authStore';

const API_URL = 'https://atlas-backend-npbs.vercel.app/api';

/* ----------------------------- Types ----------------------------- */

export type ContentType = 'blog' | 'knowledge' | 'product';

export interface AutomationMeta {
    generator?: string;
    model?: string;
    topic?: string;
    version?: string;
    [key: string]: any;
}

/* -------------------------- Axios Setup --------------------------- */

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

/* ------------------------------ API ------------------------------- */

export const api = {
    // Auth endpoints
    auth: {
        register: async (username: string, email: string, password: string) => {
            const res = await apiClient.post('/auth/register', { username, email, password });
            return res.data;
        },
        login: async (identifier: string, password: string) => {
            const res = await apiClient.post('/auth/login', { identifier, password });
            return res.data;
        },
        me: async () => {
            const res = await apiClient.get('/auth/me');
            return res.data;
        },
        logout: async () => {
            const res = await apiClient.post('/auth/logout');
            return res.data;
        },
    },

    /* --------------------------- Content --------------------------- */

    getContent: async (
        category?: string,
        filters?: {
            status?: string;
            author_id?: number;
            featured?: boolean;
            type?: ContentType;
        }
    ) => {
        const res = await apiClient.get('/content', {
            params: { category, ...filters },
        });
        return res.data;
    },

    createContent: async (data: {
        title: string;
        body: string;
        category: string;
        status?: string;
        type?: ContentType;
        canonical_id?: string | null;
        automation?: AutomationMeta;
        tags?: string[];
        sources?: Array<{
            title: string;
            url?: string;
            type?: string;
            author?: string;
        }>;
    }) => {
        const res = await apiClient.post('/content', data);
        return res.data;
    },

    getArticle: async (id: string) => {
        const res = await apiClient.get(`/content/${id}`);
        return res.data;
    },

    updateContent: async (
        id: string,
        data: Partial<{
            title: string;
            body: string;
            category: string;
            status: string;
            featured: boolean;
            type: ContentType;
            canonical_id: string | null;
            automation: AutomationMeta;
        }>
    ) => {
        const res = await apiClient.put(`/content/${id}`, data);
        return res.data;
    },

    deleteContent: async (id: string) => {
        const res = await apiClient.delete(`/content/${id}`);
        return res.data;
    },

    addTagsToContent: async (id: string, tags: string[]) => {
        const res = await apiClient.post(`/content/${id}/tags`, { tags });
        return res.data;
    },

    /* ----------------------------- Tags ---------------------------- */

    tags: {
        getAll: async () => {
            const res = await apiClient.get('/tags');
            return res.data;
        },
        create: async (name: string, description?: string, category?: string) => {
            const res = await apiClient.post('/tags', { name, description, category });
            return res.data;
        },
        getContentByTag: async (slug: string, limit = 50, offset = 0) => {
            const res = await apiClient.get(`/tags/${slug}/content`, {
                params: { limit, offset },
            });
            return res.data;
        },
        autocomplete: async (query: string) => {
            const res = await apiClient.get('/tags/autocomplete', {
                params: { q: query },
            });
            return res.data;
        },
    },

    /* ---------------------------- Search --------------------------- */

    search: async (params: {
        q: string;
        category?: string;
        tags?: string;
        from?: string;
        to?: string;
        author_id?: number;
        limit?: number;
        type?: ContentType;
    }) => {
        const res = await apiClient.get('/search', { params });
        return res.data;
    },

    searchSuggestions: async (query: string) => {
        const res = await apiClient.get('/search/suggestions', {
            params: { q: query },
        });
        return res.data;
    },

    incrementView: async (id: string) => {
        await apiClient.post(`/content/${id}/view`);
    },

    /* ----------------------------- Users --------------------------- */

    users: {
        getAll: async () => {
            const res = await apiClient.get('/users');
            return res.data;
        },
        updateRole: async (userId: number, role: string) => {
            const res = await apiClient.patch(`/users/${userId}/role`, { role });
            return res.data;
        },
        delete: async (userId: number) => {
            const res = await apiClient.delete(`/users/${userId}`);
            return res.data;
        },
        completeOnboarding: async (userId: number) => {
            const res = await apiClient.patch(`/users/${userId}/onboarding`);
            return res.data;
        },
    },

    /* ---------------------------- API Keys -------------------------- */

    keys: {
        list: async () => {
            const res = await apiClient.get('/keys');
            return res.data;
        },
        create: async (name: string) => {
            const res = await apiClient.post('/keys', { name });
            return res.data;
        },
        delete: async (id: number) => {
            const res = await apiClient.delete(`/keys/${id}`);
            return res.data;
        },
    },

    /* --------------------------- Legacy ---------------------------- */

    seed: async () => {
        await apiClient.post('/seed');
    },
};
