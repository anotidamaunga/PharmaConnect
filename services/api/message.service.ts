import { apiClient } from './client';
import { Conversation, Message } from '../../types';

export const messagesService = {
    async getConversations(): Promise<Conversation[]> {
        return apiClient.get('/messages/conversations');
    },

    async getMessages(conversationId: string): Promise<Message[]> {
        return apiClient.get(`/messages/conversations/${conversationId}/messages`);
    },

    async sendMessage(
        conversationId: string,
        content: string
    ): Promise<Message> {
        return apiClient.post(`/messages/conversations/${conversationId}/messages`, {
            content,
        });
    },

    async markAsRead(conversationId: string): Promise<void> {
        await apiClient.post(`/messages/conversations/${conversationId}/read`);
    },
};